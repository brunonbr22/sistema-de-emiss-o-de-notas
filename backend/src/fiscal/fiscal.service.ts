import { BadRequestException, Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CheckFiscalDto } from './dto/check-fiscal.dto';
import { findCnaeMei, isCnaeMeiAllowed } from './data/cnae-mei.data';
import { getIssRate } from './data/iss-rates.data';

/** Limite anual do MEI em R$ (Resolução CGSN nº 182/2023) */
const MEI_ANNUAL_LIMIT = 81_000;

export interface FiscalCheckResult {
  invoiceType: 'NFE' | 'NFSE';
  cnaeAllowed: boolean;
  cnaeDescription: string;

  grossValue: number;
  issRate: number;
  issValue: number;
  netValue: number;
  retentionRequired: boolean;

  annualIssued: number;
  annualRemaining: number;
  limitWarning: boolean;   // > 80 % do limite
  limitExceeded: boolean;  // já ultrapassou o limite

  ibgeCode: string | null;
  city: string | null;
}

@Injectable()
export class FiscalService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Verificação completa antes de emitir ──────────────────
  async check(companyId: string, dto: CheckFiscalDto): Promise<FiscalCheckResult> {
    this.assertCnaeAllowed(dto.cnaeCode);

    const gross = parseFloat(dto.grossValue);
    const annualIssued = await this.getAnnualIssued(companyId);
    const annualRemaining = Math.max(0, MEI_ANNUAL_LIMIT - annualIssued);

    const cnaeInfo = findCnaeMei(dto.cnaeCode)!;
    const invoiceType = this.resolveInvoiceType(cnaeInfo.invoiceType, dto.ibgeCode);

    let issRate = 0;
    let issValue = 0;
    let retentionRequired = false;
    let city: string | null = null;

    if (invoiceType === 'NFSE') {
      const ibge = dto.ibgeCode ?? null;
      if (ibge) {
        const rateInfo = getIssRate(ibge);
        issRate = rateInfo.rate;
        issValue = this.round2(gross * issRate);
        city = rateInfo.city;
        retentionRequired =
          rateInfo.retentionThreshold !== null &&
          gross >= rateInfo.retentionThreshold;
      }
    }

    const netValue = this.round2(gross - issValue);

    return {
      invoiceType,
      cnaeAllowed: true,
      cnaeDescription: cnaeInfo.description,
      grossValue: gross,
      issRate,
      issValue,
      netValue,
      retentionRequired,
      annualIssued: this.round2(annualIssued),
      annualRemaining: this.round2(annualRemaining),
      limitWarning: annualIssued + gross >= MEI_ANNUAL_LIMIT * 0.8,
      limitExceeded: annualIssued + gross > MEI_ANNUAL_LIMIT,
      ibgeCode: dto.ibgeCode ?? null,
      city,
    };
  }

  // ─── Consulta quanto já foi emitido no ano vigente ─────────
  async getAnnualIssued(companyId: string): Promise<number> {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const result = await this.prisma.invoice.aggregate({
      where: {
        companyId,
        status: { in: ['ISSUED'] },
        issuedAt: { gte: startOfYear },
      },
      _sum: { grossValue: true },
    });

    return Number(result._sum.grossValue ?? new Decimal(0));
  }

  // ─── Valida CNAE permitido para MEI ───────────────────────
  assertCnaeAllowed(cnaeCode: string) {
    if (!isCnaeMeiAllowed(cnaeCode)) {
      throw new BadRequestException(
        `CNAE ${cnaeCode} não é permitido para MEI. Consulte a lista de atividades autorizadas.`,
      );
    }
  }

  // ─── Determina tipo de nota ────────────────────────────────
  private resolveInvoiceType(
    cnaeType: 'NFE' | 'NFSE' | 'BOTH',
    ibgeCode?: string,
  ): 'NFE' | 'NFSE' {
    if (cnaeType === 'BOTH') {
      // Atividades mistas: se há município informado emite NFS-e, senão NF-e
      return ibgeCode ? 'NFSE' : 'NFE';
    }
    return cnaeType;
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
