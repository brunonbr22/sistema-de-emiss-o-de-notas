import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: { name: string; email: string; password: string }) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.prisma.user.create({ data: { name: input.name, email: input.email, passwordHash } });
    return this.issueToken(user.id, user.email, user.name);
  }

  async login(input: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return this.issueToken(user.id, user.email, user.name);
  }

  private issueToken(id: string, email: string, name: string) {
    const token = jwt.sign({ sub: id, email, name }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' });
    return { accessToken: token, user: { id, email, name } };
  }
}
