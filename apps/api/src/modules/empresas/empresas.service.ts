import { Injectable } from '@nestjs/common';
import { AuditService } from '../../audit/audit.service';
import { BillingService } from '../../billing/billing.service';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class EmpresasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly billing: BillingService,
    private readonly audit: AuditService,
  ) {}

  async create(input: {
    userId: string;
    cnpj: string;
    legalName: string;
    tradeName?: string;
    city: string;
    state: string;
    cnae: string;
    legalNature?: string;
    activityProfile: 'COMMERCE' | 'SERVICE' | 'BOTH';
  }) {
    const trialEndsAt = this.billing.createTrialEndDate();
    const empresa = await this.prisma.company.create({
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
      action: 'empresa.created',
      entity: 'company',
      entityId: empresa.id,
      metadata: {
        cnpj: input.cnpj,
        city: input.city,
        state: input.state,
        cnae: input.cnae,
        legalNature: input.legalNature,
        activityProfile: input.activityProfile,
      },
    });

    return {
      ...empresa,
      city: input.city,
      state: input.state,
      cnae: input.cnae,
      legalNature: input.legalNature,
      activityProfile: input.activityProfile,
      trialDaysRemaining: this.billing.calculateTrialDaysRemaining(trialEndsAt),
    };
  }

  async detail(companyId: string) {
    const empresa = await this.prisma.company.findUnique({ where: { id: companyId }, include: { invoices: true, memberships: true } });
    if (!empresa) return null;
    return { ...empresa, trialDaysRemaining: this.billing.calculateTrialDaysRemaining(empresa.trialEndsAt) };
  }
}
