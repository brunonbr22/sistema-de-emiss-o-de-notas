import { Injectable } from '@nestjs/common';
import { BillingService } from '../billing/billing.service';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billing: BillingService,
    private readonly audit: AuditService,
  ) {}

  async create(input: { userId: string; cnpj: string; legalName: string; tradeName?: string }) {
    return this.createFromOnboarding({
      ...input,
      city: 'São Paulo',
      state: 'SP',
      cnae: '0000-0/00',
      activityProfile: 'BOTH',
    });
  }

  async createFromOnboarding(input: {
    userId: string;
    cnpj: string;
    legalName: string;
    tradeName?: string;
    city: string;
    state: string;
    cnae: string;
    activityProfile: 'COMMERCE' | 'SERVICE' | 'BOTH';
  }) {
    const trialEndsAt = this.billing.createTrialEndDate();
    const company = await this.prisma.company.create({
      data: {
        cnpj: input.cnpj,
        legalName: input.legalName,
        tradeName: input.tradeName,
        taxRegime: 'MEI',
        mei: true,
        trialEndsAt,
        memberships: { create: { userId: input.userId, role: 'OWNER' } },
      },
      include: { memberships: true },
    });

    await this.audit.log({
      action: 'company.created.from-onboarding',
      entity: 'company',
      entityId: company.id,
      metadata: {
        cnpj: company.cnpj,
        city: input.city,
        state: input.state,
        cnae: input.cnae,
        activityProfile: input.activityProfile,
        trialEndsAt,
      },
    });

    return {
      ...company,
      city: input.city,
      state: input.state,
      cnae: input.cnae,
      activityProfile: input.activityProfile,
      trialDaysRemaining: this.billing.calculateTrialDaysRemaining(trialEndsAt),
    };
  }

  async detail(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { invoices: true, memberships: true },
    });

    if (!company) {
      return null;
    }

    return {
      ...company,
      trialDaysRemaining: this.billing.calculateTrialDaysRemaining(company.trialEndsAt),
    };
  }
}
