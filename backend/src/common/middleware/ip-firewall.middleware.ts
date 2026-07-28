import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpFirewallMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const ip = this.extractIp(req);
    const blocklist = this.config.get<string[]>('app.ipBlocklist') || [];
    const allowlist = this.config.get<string[]>('app.ipAllowlist') || [];

    if (blocklist.length && blocklist.includes(ip)) {
      throw new ForbiddenException('Access denied');
    }

    if (allowlist.length && !allowlist.includes(ip)) {
      throw new ForbiddenException('Access denied');
    }

    next();
  }

  private extractIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}
