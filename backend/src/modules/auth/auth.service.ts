import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../database/entities/enums';
import { UsersService } from '../users/users.service';
import { AuthLoginDto, AuthRefreshDto, AuthRegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: AuthRegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      phone: dto.phoneNumber,
    });

    if (dto.role === UserRole.HR_PROFESSIONAL || dto.role === UserRole.RECRUITER) {
      await this.usersService.createHRProfile(user.id, {
        company: dto.companyName || 'My Company',
        jobTitle: 'HR Professional',
      });
    } else {
      await this.usersService.createJobSeekerProfile(user.id, {
        skills: [],
        experience: [],
        education: [],
        isOpenToWork: true,
      });
    }

    return this.buildAuthResponse(user);
  }

  async login(dto: AuthLoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateLastLogin(user.id);
    return this.buildAuthResponse(user);
  }

  async refreshToken(dto: AuthRefreshDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.config.get<string>('app.jwtRefreshSecret'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user?.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const valid = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
      if (!valid) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.buildAuthResponse(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  private async buildAuthResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('app.jwtRefreshSecret'),
      expiresIn: this.config.get<string>('app.jwtRefreshExpiration'),
    });
    await this.usersService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
