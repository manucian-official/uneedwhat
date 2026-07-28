import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public, Roles } from '../../common/decorators/roles.decorator';
import { getClientIp } from '../../common/middleware/ip-firewall.middleware';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from '../../database/entities/enums';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRefreshDto, AuthRegisterDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: AuthLoginDto, @Req() req: Request) {
    return this.authService.login(dto, getClientIp(req));
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('admin/login')
  adminLogin(@Body() dto: AuthLoginDto, @Req() req: Request) {
    return this.authService.adminLogin(dto, getClientIp(req));
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: AuthRefreshDto) {
    return this.authService.refreshToken(dto);
  }

  @Public()
  @Post('admin/refresh')
  adminRefresh(@Body() dto: AuthRefreshDto) {
    return this.authService.adminRefreshToken(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: { id: string }) {
    return this.authService.logout(user.id);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @Post('admin/logout')
  adminLogout(@CurrentUser() user: { id: string }) {
    return this.authService.adminLogout(user.id);
  }
}
