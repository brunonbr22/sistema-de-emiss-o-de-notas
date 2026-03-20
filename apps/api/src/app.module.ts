import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { InvoicesModule } from './invoices/invoices.module';
import { AuditModule } from './audit/audit.module';
import { BillingModule } from './billing/billing.module';
import { StorageModule } from './storage/storage.module';
import { PrismaService } from './common/prisma.service';
import { QueueModule } from './queues/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CompaniesModule,
    OnboardingModule,
    InvoicesModule,
    AuditModule,
    BillingModule,
    StorageModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
