import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../database/entities/enums';
import { LoginAttemptService } from '../../common/services/login-attempt.service';
import { UsersService } from '../users/users.service';
import { AuthLoginDto, AuthRefreshDto, AuthRegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly loginAttempts: LoginAttemptService,
  ) {}

  async register(dto: AuthRegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    if (dto.role === UserRole.ADMIN) {
      throw new ConflictException('Admin accounts cannot be created via public registration');
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

  async login(dto: AuthLoginDto, ipAddress = 'unknown') {
    if (await this.loginAttempts.isLocked(dto.email)) {
      throw new ForbiddenException(
        'Account temporarily locked due to too many failed attempts',
      );
    }

    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.isActive) {
      await this.loginAttempts.recordAttempt(dto.email, ipAddress, false, 'user');
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      await this.loginAttempts.recordAttempt(dto.email, ipAddress, false, 'user');
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.loginAttempts.recordAttempt(dto.email, ipAddress, true, 'user');
    await this.loginAttempts.clearAttempts(dto.email);
    await this.usersService.updateLastLogin(user.id);
    return this.buildAuthResponse(user);
  }

  async adminLogin(dto: AuthLoginDto, ipAddress = 'unknown') {
    if (await this.loginAttempts.isLocked(dto.email)) {
      throw new ForbiddenException(
        'Account temporarily locked due to too many failed attempts',
      );
    }

    const user = await this.usersService.findByEmail(dto.email);
    if (!user || user.role !== UserRole.ADMIN || !user.isActive) {
      await this.loginAttempts.recordAttempt(dto.email, ipAddress, false, 'admin');
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      await this.loginAttempts.recordAttempt(dto.email, ipAddress, false, 'admin');
      throw new UnauthorizedException('Invalid admin credentials');
    }

    await this.loginAttempts.recordAttempt(dto.email, ipAddress, true, 'admin');
    await this.loginAttempts.clearAttempts(dto.email);
    await this.usersService.updateLastLogin(user.id);
    return this.buildAdminAuthResponse(user);
  }

  async refreshToken(dto: AuthRefreshDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.config.get<string>('app.jwtRefreshSecret'),
      });
      if (payload.aud === 'admin') {
        throw new UnauthorizedException('Use admin refresh endpoint');
      }
      const user = await this.usersService.findById(payload.sub);
      if (!user?.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const valid = await bcrypt.compare(dto.refreshToken, user.refreshTokenHash);
      if (!valid) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return this.buildAuthResponse(user);
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async adminRefreshToken(dto: AuthRefreshDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.config.get<string>('app.jwtRefreshSecret'),
      });
      if (payload.aud !== 'admin') {
        throw new UnauthorizedException('Invalid admin refresh token');
      }
      const user = await this.usersService.findById(payload.sub);
      if (!user?.adminRefreshTokenHash || user.role !== UserRole.ADMIN) {
        throw new UnauthorizedException('Invalid admin refresh token');
      }
      const valid = await bcrypt.compare(
        dto.refreshToken,
        user.adminRefreshTokenHash,
      );
      if (!valid) {
        throw new UnauthorizedException('Invalid admin refresh token');
      }
      return this.buildAdminAuthResponse(user);
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Invalid admin refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  async adminLogout(userId: string) {
    await this.usersService.clearAdminRefreshToken(userId);
    return { message: 'Admin logged out successfully' };
  }

  private async buildAuthResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    twoFactorEnabled?: boolean;
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
        twoFactorEnabled: user.twoFactorEnabled ?? false,
      },
    };
  }

  private async buildAdminAuthResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    twoFactorEnabled?: boolean;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      aud: 'admin',
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('app.adminJwtExpiration'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('app.jwtRefreshSecret'),
      expiresIn: this.config.get<string>('app.jwtRefreshExpiration'),
    });
    await this.usersService.setAdminRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled ?? false,
      },
    };
  }
}
