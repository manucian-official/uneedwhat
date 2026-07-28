import { registerAs } from '@nestjs/config';

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'uneedwhat',
  port: parseInt(process.env.APP_PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: requiredEnv('JWT_SECRET'),
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  jwtRefreshSecret: requiredEnv('JWT_REFRESH_SECRET'),
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
}));
