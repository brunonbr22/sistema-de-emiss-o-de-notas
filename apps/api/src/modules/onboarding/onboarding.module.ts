import { Module } from '@nestjs/common';
import { EmpresasModule } from '../empresas/empresas.module';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { CnpjService } from './cnpj.service';

@Module({ imports: [EmpresasModule], controllers: [OnboardingController], providers: [OnboardingService, CnpjService], exports: [OnboardingService, CnpjService] })
export class OnboardingModule {}
