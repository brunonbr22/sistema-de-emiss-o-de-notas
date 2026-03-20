import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  createTrialEndDate() {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);
    return trialEndsAt;
  }
}
