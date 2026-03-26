import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service';

const registerSchema = z.object({ name: z.string(), email: z.string().email(), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: unknown) {
    return this.authService.register(registerSchema.parse(body));
  }

  @Post('login')
  login(@Body() body: unknown) {
    return this.authService.login(loginSchema.parse(body));
  }
}
