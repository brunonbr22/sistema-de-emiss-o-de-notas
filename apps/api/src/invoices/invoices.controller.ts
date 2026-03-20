import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { InvoicesService } from './invoices.service';

const createInvoiceSchema = z.object({
  companyId: z.string(),
  type: z.enum(['NFE', 'NFSE']),
  customerName: z.string(),
  customerTaxId: z.string(),
  serviceCity: z.string().optional(),
  totalAmount: z.number().positive(),
  payload: z.record(z.any()),
});

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('simulate-fiscal-engine')
  simulateFiscalEngine(@Body() body: unknown) {
    return this.invoicesService.simulateFiscalEngine(body as Record<string, unknown>);
  }

  @Post()
  create(@Body() body: unknown) {
    return this.invoicesService.create(createInvoiceSchema.parse(body));
  }

  @Get(':companyId')
  list(@Param('companyId') companyId: string) {
    return this.invoicesService.listByCompany(companyId);
  }
}
