import {
  Injectable, Logger, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PlansService } from '../plans/plans.service';
import { PaymentWebhookDto } from './dto/webhook.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly plans: PlansService,
    private readonly config: ConfigService,
  ) {}

  validateSignature(receivedSecret: string | undefined): void {
    const expected = this.config.get<string>('WEBHOOK_SECRET');
    if (!expected) return; // sem secret configurado, aceita todos (dev)
    if (receivedSecret !== expected) {
      throw new UnauthorizedException('Assinatura do webhook inválida.');
    }
  }

  async handle(dto: PaymentWebhookDto): Promise<{ ok: boolean; message: string }> {
    this.logger.log(`Webhook recebido: ${dto.event} | company=${dto.companyId}`);

    const company = await this.prisma.company.findUnique({ where: { id: dto.companyId } });
    if (!company) throw new NotFoundException(`Empresa ${dto.companyId} não encontrada.`);

    switch (dto.event) {
      case 'payment.approved': {
        const planId = dto.planId ?? 'basic-monthly';
        if (!this.plans.findById(planId)) {
          this.logger.warn(`Plano desconhecido recebido no webhook: ${planId}`);
        }
        await this.prisma.company.update({
          where: { id: dto.companyId },
          data: { planId },
        });
        this.logger.log(`Plano ${planId} ativado para empresa ${dto.companyId}`);
        return { ok: true, message: `Plano ${planId} ativado.` };
      }

      case 'payment.refunded':
      case 'subscription.canceled': {
        await this.prisma.company.update({
          where: { id: dto.companyId },
          data: { planId: null },
        });
        this.logger.log(`Assinatura cancelada para empresa ${dto.companyId}`);
        return { ok: true, message: 'Assinatura cancelada.' };
      }

      default:
        return { ok: true, message: 'Evento ignorado.' };
    }
  }
}
