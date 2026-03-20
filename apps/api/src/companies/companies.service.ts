import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { BillingService } from '../billing/billing.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billing: BillingService,
    private readonly audit: AuditService,
  ) {}

  async create(input: { userId: string; cnpj: string; legalName: string; tradeName?: string }) {
    const company = await this.prisma.company.create({
      data: {
        cnpj: input.cnpj,
        legalName: input.legalName,
        tradeName: input.tradeName,
        taxRegime: 'MEI',
        mei: true,
        trialEndsAt: this.billing.createTrialEndDate(),
        memberships: { create: { userId: input.userId, role: 'owner' } },
      },
      include: { memberships: true },
    });
    await this.audit.log({ action: 'company.created', entity: 'company', entityId: company.id, metadata: { cnpj: company.cnpj } });
    return company;
  }

  detail(companyId: string) {
    return this.prisma.company.findUnique({ where: { id: companyId }, include: { invoices: true, memberships: true } });
  }
}
