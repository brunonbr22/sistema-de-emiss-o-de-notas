import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { InvoicesService } from './invoices.service';

const createInvoiceSchema = z.object({
  companyId: z.string(),
  customerName: z.string(),
  customerTaxId: z.string(),
  operationType: z.enum(['COMMERCE', 'SERVICE']),
  itemDescription: z.string(),
  companyActivityProfile: z.enum(['COMMERCE', 'SERVICE', 'BOTH']).optional(),
  cnae: z.string().optional(),
  companyState: z.string(),
  customerState: z.string(),
  companyCity: z.string(),
  serviceCity: z.string().optional(),
  totalAmount: z.number().positive(),
  payload: z.record(z.any()),
});

const simulateSchema = createInvoiceSchema.omit({ companyId: true, customerName: true, itemDescription: true, payload: true });

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('simulate-fiscal-engine')
  simulateFiscalEngine(@Body() body: unknown) {
    return this.invoicesService.simulateFiscalEngine(simulateSchema.parse(body));
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
