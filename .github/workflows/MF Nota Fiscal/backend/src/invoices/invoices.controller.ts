import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { EmitNfeDto } from './dto/emit-nfe.dto';
import { EmitNfseDto } from './dto/emit-nfse.dto';
import { CancelNfeDto } from './dto/cancel-nfe.dto';
import { UpsertNfseConfigDto } from './dto/upsert-nfse-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}

  // ─── NF-e ─────────────────────────────────────────────────────────────────

  @ApiTags('NF-e')
  @Post('nfe/companies/:companyId')
  @ApiOperation({ summary: 'Emite uma NF-e via Focus NFe' })
  emitNfe(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: EmitNfeDto,
  ) {
    return this.invoices.emitNfe(companyId, user.id, dto);
  }

  @ApiTags('NF-e')
  @Get('nfe/companies/:companyId')
  @ApiOperation({ summary: 'Lista as NF-e da empresa' })
  listNfe(@CurrentUser() user: AuthUser, @Param('companyId') companyId: string) {
    return this.invoices.listByCompany(companyId, user.id);
  }

  @ApiTags('NF-e')
  @Get('nfe/:id')
  @ApiOperation({ summary: 'Consulta status de uma NF-e (sincroniza com Focus NFe)' })
  getStatus(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.invoices.getStatus(id, user.id);
  }

  @ApiTags('NF-e')
  @Post('nfe/:id/cancel')
  @ApiOperation({ summary: 'Cancela uma NF-e autorizada' })
  cancelNfe(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CancelNfeDto,
  ) {
    return this.invoices.cancel(id, user.id, dto);
  }

  @ApiTags('NF-e')
  @Get('nfe/:id/xml')
  @ApiOperation({ summary: 'Download do XML assinado da NF-e' })
  async downloadXml(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.invoices.downloadXml(id, user.id);
    res.set({ 'Content-Type': 'application/xml', 'Content-Disposition': `attachment; filename="nfe-${id}.xml"` });
    res.send(buffer);
  }

  @ApiTags('NF-e')
  @Get('nfe/:id/danfe')
  @ApiOperation({ summary: 'Download do DANFE em PDF' })
  async downloadDanfe(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.invoices.downloadDanfe(id, user.id);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="danfe-${id}.pdf"` });
    res.send(buffer);
  }

  // ─── NFS-e Config ─────────────────────────────────────────────────────────

  @ApiTags('NFS-e')
  @Put('nfse-config/companies/:companyId')
  @ApiOperation({
    summary: 'Cadastra ou atualiza configuração NFS-e de um município',
    description:
      'Necessário antes de emitir NFS-e. Armazena inscrição municipal, item da lista de serviços e código de tributação.',
  })
  upsertNfseConfig(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: UpsertNfseConfigDto,
  ) {
    return this.invoices.upsertNfseConfig(companyId, user.id, dto);
  }

  @ApiTags('NFS-e')
  @Get('nfse-config/companies/:companyId')
  @ApiOperation({ summary: 'Lista as configurações NFS-e por município da empresa' })
  listNfseConfigs(@CurrentUser() user: AuthUser, @Param('companyId') companyId: string) {
    return this.invoices.listNfseConfigs(companyId, user.id);
  }

  // ─── NFS-e ────────────────────────────────────────────────────────────────

  @ApiTags('NFS-e')
  @Post('nfse/companies/:companyId')
  @ApiOperation({ summary: 'Emite uma NFS-e via Focus NFe (padrão ABRASF)' })
  emitNfse(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: EmitNfseDto,
  ) {
    return this.invoices.emitNfse(companyId, user.id, dto);
  }

  @ApiTags('NFS-e')
  @Get('nfse/companies/:companyId')
  @ApiOperation({ summary: 'Lista as NFS-e da empresa' })
  listNfse(@CurrentUser() user: AuthUser, @Param('companyId') companyId: string) {
    return this.invoices.listNfseByCompany(companyId, user.id);
  }

  @ApiTags('NFS-e')
  @Get('nfse/:id')
  @ApiOperation({ summary: 'Consulta status de uma NFS-e (sincroniza com Focus NFe)' })
  getNfseStatus(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.invoices.getNfseStatus(id, user.id);
  }

  @ApiTags('NFS-e')
  @Post('nfse/:id/cancel')
  @ApiOperation({ summary: 'Cancela uma NFS-e autorizada' })
  cancelNfse(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CancelNfeDto,
  ) {
    return this.invoices.cancelNfse(id, user.id, dto);
  }

  @ApiTags('NFS-e')
  @Get('nfse/:id/xml')
  @ApiOperation({ summary: 'Download do XML da NFS-e' })
  async downloadNfseXml(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.invoices.downloadNfseXml(id, user.id);
    res.set({ 'Content-Type': 'application/xml', 'Content-Disposition': `attachment; filename="nfse-${id}.xml"` });
    res.send(buffer);
  }

  @ApiTags('NFS-e')
  @Get('nfse/:id/pdf')
  @ApiOperation({ summary: 'Download do PDF da NFS-e' })
  async downloadNfsePdf(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.invoices.downloadNfsePdf(id, user.id);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="nfse-${id}.pdf"` });
    res.send(buffer);
  }
}
