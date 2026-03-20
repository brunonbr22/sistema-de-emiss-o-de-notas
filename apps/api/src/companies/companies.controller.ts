import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { CompaniesService } from './companies.service';

const createCompanySchema = z.object({ userId: z.string(), cnpj: z.string(), legalName: z.string(), tradeName: z.string().optional() });

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.companiesService.create(createCompanySchema.parse(body));
  }

  @Get(':companyId')
  detail(@Param('companyId') companyId: string) {
    return this.companiesService.detail(companyId);
  }
}
