import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      product: 'sistema emitir nota mais simples do Brasil',
      scope: ['auth', 'multiempresa', 'onboarding-cnpj', 'nfe', 'nfse', 'trial-14d'],
    };
  }
}
