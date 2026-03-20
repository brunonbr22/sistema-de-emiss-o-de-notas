import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OnboardingService } from './onboarding.service';

const onboardingSchema = z.object({ userId: z.string(), cnpj: z.string() });

@Controller('onboarding')
@UseGuards(AuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('cnpj/:cnpj')
  byCnpj(@Param('cnpj') cnpj: string) {
    return this.onboardingService.lookupByCnpj(cnpj);
  }

  @Post('cnpj')
  createByCnpj(@Body() body: unknown) {
    return this.onboardingService.createCompanyFromCnpj(onboardingSchema.parse(body));
  }
}
