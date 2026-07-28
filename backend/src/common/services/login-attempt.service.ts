import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MoreThan, Repository } from 'typeorm';
import { LoginAttempt } from '../../database/entities/login-attempt.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class LoginAttemptService {
  constructor(
    @InjectRepository(LoginAttempt)
    private readonly attemptsRepo: Repository<LoginAttempt>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async recordAttempt(
    email: string,
    ipAddress: string,
    success: boolean,
    attemptType: 'user' | 'admin' = 'user',
  ) {
    await this.attemptsRepo.save(
      this.attemptsRepo.create({
        email: email.toLowerCase(),
        ipAddress,
        success,
        attemptType,
      }),
    );

    if (!success) {
      const user = await this.usersRepo.findOne({ where: { email } });
      if (user) {
        const maxAttempts = this.config.get<number>('app.loginMaxAttempts') || 5;
        const lockoutMinutes =
          this.config.get<number>('app.loginLockoutMinutes') || 15;
        const failed = (user.failedLoginAttempts || 0) + 1;
        const update: {
          failedLoginAttempts: number;
          lockedUntil?: Date;
        } = { failedLoginAttempts: failed };
        if (failed >= maxAttempts) {
          update.lockedUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
        }
        await this.usersRepo.update(user.id, update);
      }
    }
  }

  async clearAttempts(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user) {
      await this.usersRepo.update(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: undefined,
      });
    }
  }

  async isLocked(email: string): Promise<boolean> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user?.lockedUntil) return false;
    if (user.lockedUntil > new Date()) return true;
    await this.usersRepo.update(user.id, {
      failedLoginAttempts: 0,
      lockedUntil: undefined,
    });
    return false;
  }

  async getRecentFailedCount(
    email: string,
    windowMinutes = 15,
  ): Promise<number> {
    const since = new Date(Date.now() - windowMinutes * 60 * 1000);
    return this.attemptsRepo.count({
      where: {
        email: email.toLowerCase(),
        success: false,
        createdAt: MoreThan(since),
      },
    });
  }
}
