import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(input: { actorId?: string; action: string; entity: string; entityId: string; metadata: unknown }) {
    return this.prisma.auditLog.create({ data: input });
  }
}
