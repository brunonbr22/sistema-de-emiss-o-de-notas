import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

const MEI_ANNUAL_LIMIT = 81_000;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(companyId: string, userId: string) {
    // Verifica acesso
    const membership = await this.prisma.companyMember.findUnique({
      where: { userId_companyId: { userId, companyId } },
      include: { company: true },
    });
    if (!membership) throw new NotFoundException('Empresa não encontrada.');

    const company = membership.company;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [monthAgg, yearAgg, recentInvoices] = await Promise.all([
      // Totais do mês
      this.prisma.invoice.aggregate({
        where: { companyId, status: 'ISSUED', issuedAt: { gte: startOfMonth } },
        _sum: { grossValue: true },
        _count: { id: true },
      }),
      // Totais do ano
      this.prisma.invoice.aggregate({
        where: { companyId, status: 'ISSUED', issuedAt: { gte: startOfYear } },
        _sum: { grossValue: true },
        _count: { id: true },
      }),
      // Últimas 6 notas
      this.prisma.invoice.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true, type: true, status: true, number: true,
          takerName: true, grossValue: true, netValue: true,
          issuedAt: true, createdAt: true, cnaeCode: true,
          serviceDesc: true,
        },
      }),
    ]);

    const monthTotal = toNumber(monthAgg._sum.grossValue);
    const monthCount = monthAgg._count.id;
    const yearTotal = toNumber(yearAgg._sum.grossValue);
    const yearCount = yearAgg._count.id;

    const usedPercent = round2((yearTotal / MEI_ANNUAL_LIMIT) * 100);

    // Status do plano/trial
    const trialDaysLeft = company.trialEndsAt
      ? Math.ceil((company.trialEndsAt.getTime() - now.getTime()) / 86_400_000)
      : null;
    const planActive = !!company.planId || (trialDaysLeft !== null && trialDaysLeft > 0);

    return {
      month: {
        total: round2(monthTotal),
        count: monthCount,
      },
      year: {
        total: round2(yearTotal),
        count: yearCount,
        limit: MEI_ANNUAL_LIMIT,
        remaining: round2(Math.max(0, MEI_ANNUAL_LIMIT - yearTotal)),
        usedPercent,
        limitWarning: usedPercent >= 80,
        limitExceeded: yearTotal > MEI_ANNUAL_LIMIT,
      },
      plan: {
        active: planActive,
        planId: company.planId,
        trialEndsAt: company.trialEndsAt,
        trialDaysLeft: trialDaysLeft !== null ? Math.max(0, trialDaysLeft) : null,
      },
      recentInvoices,
    };
  }
}

function toNumber(d: Decimal | null | undefined): number {
  return Number(d ?? 0);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
