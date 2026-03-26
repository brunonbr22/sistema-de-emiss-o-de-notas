import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../common/prisma.service';
import { AuditService } from '../audit/audit.service';
import { StorageService } from '../storage/storage.service';
import { QueueService } from '../queues/queue.service';
import { FiscalEngineModule } from '../modules/fiscal-engine/fiscal-engine.module';
import { FocusModule } from '../modules/focus/focus.module';
import { NfseModule } from '../modules/nfse/nfse.module';

@Module({
  imports: [FiscalEngineModule, FocusModule, NfseModule],
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService, AuditService, StorageService, QueueService],
})
export class InvoicesModule {}
