import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(input: { name: string; email: string; password: string }) {
    const user = await this.usersService.create(input);
    return this.issueTokens(user.id, user.email, user.name);
  }

  async login(input: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(input.email);
    if (!user || !(await this.usersService.comparePassword(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return this.issueTokens(user.id, user.email, user.name);
  }

  refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET ?? 'refresh-secret') as { sub: string; email: string; name: string };
      return this.issueTokens(payload.sub, payload.email, payload.name);
    } catch {
      throw new UnauthorizedException('Refresh token inválido.');
    }
  }

  private issueTokens(id: string, email: string, name: string) {
    const accessToken = jwt.sign({ sub: id, email, name }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: id, email, name }, process.env.JWT_REFRESH_SECRET ?? 'refresh-secret', { expiresIn: '7d' });
    return { accessToken, refreshToken, user: { id, email, name } };
  }
}
