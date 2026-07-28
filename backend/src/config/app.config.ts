import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'uneedwhat',
  port: parseInt(process.env.APP_PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  adminJwtExpiration: process.env.ADMIN_JWT_EXPIRATION || '4h',
  ipAllowlist: (process.env.IP_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  ipBlocklist: (process.env.IP_BLOCKLIST || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  loginMaxAttempts: parseInt(process.env.LOGIN_MAX_ATTEMPTS || '5', 10),
  loginLockoutMinutes: parseInt(process.env.LOGIN_LOCKOUT_MINUTES || '15', 10),
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@uneedwhat.com',
  defaultAdminPassword:
    process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@uneedwhat123',
  seedOnStartup: process.env.SEED_ON_STARTUP !== 'false',
}));
