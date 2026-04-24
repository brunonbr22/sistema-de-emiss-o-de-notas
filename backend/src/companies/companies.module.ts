import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CnpjService } from './cnpj/cnpj.service';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, CnpjService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
