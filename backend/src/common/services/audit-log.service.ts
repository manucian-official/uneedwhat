import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminAuditLog } from '../../database/entities/admin-audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AdminAuditLog)
    private readonly auditRepo: Repository<AdminAuditLog>,
  ) {}

  async log(params: {
    adminId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const entry = this.auditRepo.create(params);
    return this.auditRepo.save(entry);
  }

  async findRecent(limit = 50) {
    return this.auditRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['admin'],
    });
  }

  async findByAdmin(adminId: string, limit = 50) {
    return this.auditRepo.find({
      where: { adminId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
