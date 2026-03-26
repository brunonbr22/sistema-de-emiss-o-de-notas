import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private readonly queue = new Queue('invoice-issuance', { connection: { url: process.env.REDIS_URL } as never });

  enqueue(name: string, data: unknown) {
    return this.queue.add(name, data);
  }
}
