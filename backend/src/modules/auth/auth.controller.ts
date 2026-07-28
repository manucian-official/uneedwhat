import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRefreshDto, AuthRegisterDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: AuthRegisterDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.register(dto);
    setAuthCookies(response, session.accessToken, session.refreshToken);
    return { user: session.user };
  }

  @Public()
  @Post('login')
  async login(@Body() dto: AuthLoginDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.login(dto);
    setAuthCookies(response, session.accessToken, session.refreshToken);
    return { user: session.user };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() dto: AuthRefreshDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = dto.refreshToken || getCookieValue(request.headers.cookie, 'refreshToken');
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.authService.refreshToken(refreshToken);
    setAuthCookies(response, session.accessToken, session.refreshToken);
    return { user: session.user };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { id: string; email: string; firstName: string; lastName: string; role: string }) {
    return { user };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: { id: string }, @Res({ passthrough: true }) response: Response) {
    await this.authService.logout(user.id);
    clearAuthCookies(response);
    return { message: 'Logged out successfully' };
  }
}

function getCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.slice(name.length + 1));
}

function parseDurationMs(value: string | undefined, fallbackMs: number) {
  if (!value) {
    return fallbackMs;
  }

  const match = /^(\d+)([smhd])$/i.exec(value.trim());
  if (!match) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallbackMs;
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
}

function authCookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeMs,
  };
}

function refreshCookieOptions(maxAgeMs: number) {
  return {
    ...authCookieOptions(maxAgeMs),
    path: '/auth',
  };
}

function setAuthCookies(response: Response, accessToken: string, refreshToken: string) {
  response.cookie(
    'accessToken',
    accessToken,
    authCookieOptions(parseDurationMs(process.env.JWT_EXPIRATION, 7 * 24 * 60 * 60 * 1000)),
  );
  response.cookie(
    'refreshToken',
    refreshToken,
    refreshCookieOptions(
      parseDurationMs(process.env.JWT_REFRESH_EXPIRATION, 30 * 24 * 60 * 60 * 1000),
    ),
  );
}

function clearAuthCookies(response: Response) {
  response.clearCookie(
    'accessToken',
    authCookieOptions(parseDurationMs(process.env.JWT_EXPIRATION, 7 * 24 * 60 * 60 * 1000)),
  );
  response.clearCookie(
    'refreshToken',
    refreshCookieOptions(
      parseDurationMs(process.env.JWT_REFRESH_EXPIRATION, 30 * 24 * 60 * 60 * 1000),
    ),
  );
}
