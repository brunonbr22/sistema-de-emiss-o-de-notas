import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: { name: string; email: string; password: string }) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    return this.prisma.user.create({ data: { name: input.name, email: input.email, passwordHash } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  comparePassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}
