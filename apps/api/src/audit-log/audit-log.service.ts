import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(user: any) {
    // Only Owner and Admin can view audit logs
    if (!['Owner', 'Admin'].includes(user.role?.name)) {
      throw new ForbiddenException('Insufficient permissions to view audit logs');
    }

    const logs = await this.auditLogRepository.find({
      relations: ['user'],
      order: {
        timestamp: 'DESC',
      },
      take: 100, // Limit to last 100 logs
    });

    return logs;
  }
}