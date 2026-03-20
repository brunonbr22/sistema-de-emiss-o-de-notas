import { Body, Controller, Post } from '@nestjs/common';

@Controller('webhooks/focus')
export class FocusWebhookController {
  @Post()
  receive(@Body() body: unknown) {
    return { received: true, provider: 'Focus NFe', body };
  }
}
