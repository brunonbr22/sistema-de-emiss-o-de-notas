import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { FocusNfeService } from './focus-nfe/focus-nfe.service';
import { FocusNfseService } from './focus-nfse/focus-nfse.service';
import { FiscalModule } from '../fiscal/fiscal.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [FiscalModule, StorageModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, FocusNfeService, FocusNfseService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
