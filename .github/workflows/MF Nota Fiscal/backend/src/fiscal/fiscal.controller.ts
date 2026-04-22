import {
  Body, Controller, Get, Param, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FiscalService } from './fiscal.service';
import { CheckFiscalDto } from './dto/check-fiscal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CNAES_MEI } from './data/cnae-mei.data';
import { getIssRate } from './data/iss-rates.data';

@ApiTags('Fiscal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fiscal')
export class FiscalController {
  constructor(private readonly fiscal: FiscalService) {}

  @Post('companies/:companyId/check')
  @ApiOperation({
    summary: 'Verifica regras fiscais MEI antes de emitir uma nota',
    description:
      'Valida CNAE, calcula ISS, verifica limite anual e determina o tipo de nota (NF-e ou NFS-e).',
  })
  check(
    @Param('companyId') companyId: string,
    @Body() dto: CheckFiscalDto,
  ) {
    return this.fiscal.check(companyId, dto);
  }

  @Get('companies/:companyId/annual-limit')
  @ApiOperation({ summary: 'Retorna o total emitido no ano e o saldo restante do limite MEI' })
  async annualLimit(@Param('companyId') companyId: string) {
    const issued = await this.fiscal.getAnnualIssued(companyId);
    const limit = 81_000;
    const remaining = Math.max(0, limit - issued);
    return {
      limit,
      issued: Math.round(issued * 100) / 100,
      remaining: Math.round(remaining * 100) / 100,
      usedPercent: Math.round((issued / limit) * 10000) / 100,
      limitWarning: issued >= limit * 0.8,
      limitExceeded: issued > limit,
    };
  }

  @Get('cnaes')
  @ApiOperation({ summary: 'Lista todos os CNAEs permitidos para MEI' })
  listCnaes() {
    return CNAES_MEI;
  }

  @Get('iss-rates/:ibgeCode')
  @ApiOperation({ summary: 'Retorna a alíquota de ISS de um município pelo código IBGE' })
  issRate(@Param('ibgeCode') ibgeCode: string) {
    return getIssRate(ibgeCode);
  }
}
