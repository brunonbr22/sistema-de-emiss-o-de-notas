import { Module } from '@nestjs/common';
import { FocusService } from './focus.service';
import { FocusConsultaService } from './focus.consulta.service';
import { FocusWebhookController } from './focus.webhook.controller';

@Module({ controllers: [FocusWebhookController], providers: [FocusService, FocusConsultaService], exports: [FocusService, FocusConsultaService] })
export class FocusModule {}
