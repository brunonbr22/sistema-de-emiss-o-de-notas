import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PaymentWebhookDto } from './dto/webhook.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Webhook de eventos de pagamento',
    description:
      'Recebe eventos de gateways de pagamento (aprovação, reembolso, cancelamento). ' +
      'Protegido por `X-Webhook-Secret` comparado à variável `WEBHOOK_SECRET`.',
  })
  async webhook(
    @Headers('x-webhook-secret') secret: string | undefined,
    @Body() dto: PaymentWebhookDto,
  ) {
    this.payments.validateSignature(secret);
    return this.payments.handle(dto);
  }
}
