import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @ApiProperty({
    description: 'Tipo do evento',
    enum: ['payment.approved', 'payment.refunded', 'subscription.canceled'],
  })
  @IsString()
  @IsIn(['payment.approved', 'payment.refunded', 'subscription.canceled'])
  event: string;

  @ApiProperty({ description: 'ID da empresa no MF Mei' })
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @ApiPropertyOptional({ description: 'ID do plano ativado' })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiPropertyOptional({ description: 'ID externo do pagamento/assinatura no gateway' })
  @IsOptional()
  @IsString()
  externalId?: string;
}
