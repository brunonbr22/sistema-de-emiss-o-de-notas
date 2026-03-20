import { Module } from '@nestjs/common';
import { AssinaturaNfseService } from './assinatura-nfse.service';
import { NfseConsultaService } from './nfse-consulta.service';
import { NfseService } from './nfse.service';

@Module({ providers: [NfseService, AssinaturaNfseService, NfseConsultaService], exports: [NfseService, NfseConsultaService] })
export class NfseModule {}
