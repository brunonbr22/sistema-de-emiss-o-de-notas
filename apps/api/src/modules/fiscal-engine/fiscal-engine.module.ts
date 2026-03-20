import { Module } from '@nestjs/common';
import { FiscalEngineService } from './fiscal-engine.service';

@Module({ providers: [FiscalEngineService], exports: [FiscalEngineService] })
export class FiscalEngineModule {}
