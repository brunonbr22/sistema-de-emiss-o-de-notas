import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../common/prisma.service';
import { BillingService } from '../billing/billing.service';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService, BillingService, AuditService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
