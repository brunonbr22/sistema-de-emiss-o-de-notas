import { Controller, Get, Param } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('cnpj/:cnpj')
  byCnpj(@Param('cnpj') cnpj: string) {
    return this.onboardingService.lookupByCnpj(cnpj);
  }
}
