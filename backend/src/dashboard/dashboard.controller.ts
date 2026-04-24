import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthUser { id: string; email: string; name: string }

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('companies/:companyId')
  @ApiOperation({
    summary: 'Resumo do dashboard para uma empresa',
    description: 'Retorna totais do mês e do ano, barra de limite MEI, últimas notas e status do plano.',
  })
  getSummary(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
  ) {
    return this.dashboard.getSummary(companyId, user.id);
  }
}
