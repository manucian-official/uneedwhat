import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../database/entities/enums';
import { UsersService } from '../users/users.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getBcryptSaltRounds() {
  const parsedRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  return Number.isFinite(parsedRounds) ? Math.max(parsedRounds, 12) : 12;
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthRegisterDto) {
    const email = normalizeEmail(dto.email);
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, getBcryptSaltRounds());
    const user = await this.usersService.create({
      email,
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
    const user = await this.usersService.findByEmail(normalizeEmail(dto.email));
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

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: requiredEnv('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user?.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
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
    const accessToken = this.jwtService.sign(payload, {
      secret: requiredEnv('JWT_SECRET'),
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: requiredEnv('JWT_REFRESH_SECRET'),
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
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
