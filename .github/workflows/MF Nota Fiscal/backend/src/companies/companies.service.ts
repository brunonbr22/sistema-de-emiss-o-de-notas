import {
  Injectable, ConflictException, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

const TRIAL_DAYS = 14;

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCompanyDto) {
    const existing = await this.prisma.company.findUnique({ where: { cnpj: dto.cnpj } });
    if (existing) throw new ConflictException('CNPJ já cadastrado no sistema.');

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

    const company = await this.prisma.company.create({
      data: {
        ...dto,
        trialEndsAt,
        members: {
          create: { userId, role: 'OWNER' },
        },
      },
    });

    return company;
  }

  async findAllForUser(userId: string) {
    const memberships = await this.prisma.companyMember.findMany({
      where: { userId },
      include: {
        company: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((m) => ({
      ...m.company,
      role: m.role,
    }));
  }

  async findOne(companyId: string, userId: string) {
    await this.assertMember(companyId, userId);
    return this.prisma.company.findUniqueOrThrow({ where: { id: companyId } });
  }

  async update(companyId: string, userId: string, dto: UpdateCompanyDto) {
    await this.assertOwnerOrAdmin(companyId, userId);
    return this.prisma.company.update({
      where: { id: companyId },
      data: dto,
    });
  }

  // ─── Helpers ──────────────────────────────────────────────
  private async assertMember(companyId: string, userId: string) {
    const member = await this.prisma.companyMember.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
    if (!member) throw new NotFoundException('Empresa não encontrada.');
    return member;
  }

  private async assertOwnerOrAdmin(companyId: string, userId: string) {
    const member = await this.assertMember(companyId, userId);
    if (!['OWNER', 'ADMIN'].includes(member.role)) {
      throw new ForbiddenException('Sem permissão para editar esta empresa.');
    }
    return member;
  }
}
