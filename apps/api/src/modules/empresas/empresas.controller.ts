import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../../common/guards/auth.guard';
import { EmpresasService } from './empresas.service';

const createEmpresaSchema = z.object({
  userId: z.string(),
  cnpj: z.string(),
  legalName: z.string(),
  tradeName: z.string().optional(),
  city: z.string(),
  state: z.string(),
  cnae: z.string(),
  legalNature: z.string().optional(),
  activityProfile: z.enum(['COMMERCE', 'SERVICE', 'BOTH']),
});

@Controller('empresas')
@UseGuards(AuthGuard)
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.empresasService.create(createEmpresaSchema.parse(body));
  }

  @Get(':empresaId')
  detail(@Param('empresaId') empresaId: string) {
    return this.empresasService.detail(empresaId);
  }
}
