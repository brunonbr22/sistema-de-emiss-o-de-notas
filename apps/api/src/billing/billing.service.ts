import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  createTrialEndDate() {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);
    return trialEndsAt;
  }

  calculateTrialDaysRemaining(trialEndsAt: Date) {
    const msRemaining = trialEndsAt.getTime() - Date.now();
    const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
    return Math.max(daysRemaining, 0);
  }
}
