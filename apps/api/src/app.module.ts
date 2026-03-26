import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuditModule } from './audit/audit.module';
import { BillingModule } from './billing/billing.module';
import { PrismaService } from './common/prisma.service';
import { InvoicesModule } from './invoices/invoices.module';
import { QueueModule } from './queues/queue.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { FiscalEngineModule } from './modules/fiscal-engine/fiscal-engine.module';
import { FocusModule } from './modules/focus/focus.module';
import { NfseModule } from './modules/nfse/nfse.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    EmpresasModule,
    OnboardingModule,
    InvoicesModule,
    AuditModule,
    BillingModule,
    StorageModule,
    QueueModule,
    FiscalEngineModule,
    FocusModule,
    NfseModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
