import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { PrismaService } from '../../common/prisma.service';
import { BillingService } from '../../billing/billing.service';
import { AuditService } from '../../audit/audit.service';

@Module({ controllers: [EmpresasController], providers: [EmpresasService, PrismaService, BillingService, AuditService], exports: [EmpresasService] })
export class EmpresasModule {}
