import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginAttempt } from '../database/entities/login-attempt.entity';
import { AdminAuditLog } from '../database/entities/admin-audit-log.entity';
import { User } from '../database/entities/user.entity';
import { LoginAttemptService } from './services/login-attempt.service';
import { AuditLogService } from './services/audit-log.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([LoginAttempt, AdminAuditLog, User]),
  ],
  providers: [LoginAttemptService, AuditLogService],
  exports: [LoginAttemptService, AuditLogService],
})
export class CommonModule {}
