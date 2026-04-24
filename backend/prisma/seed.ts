import { PrismaClient, TaxRegime, MemberRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const HASH_ROUNDS = 12;

async function hash(password: string) {
  return bcrypt.hash(password, HASH_ROUNDS);
}

async function main() {
  console.log('Limpando dados de seed anteriores...');
  await prisma.invoice.deleteMany();
  await prisma.companyMember.deleteMany();
  await prisma.company.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando usuários de teste...');

  // ── 1. Administrador com plano ativo ──────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mfmei.com.br',
      password: await hash('Admin@123'),
      name: 'Admin Teste',
    },
  });

  await prisma.company.create({
    data: {
      cnpj: '11222333000181',
      name: 'Empresa Admin MEI',
      tradeName: 'Admin MEI',
      email: 'admin@mfmei.com.br',
      phone: '11999990001',
      street: 'Rua das Flores',
      number: '100',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001000',
      ibgeCode: '3550308',
      regime: TaxRegime.MEI,
      situation: 'ATIVA',
      planId: 'plan_basic',
      members: {
        create: { userId: adminUser.id, role: MemberRole.OWNER },
      },
    },
  });

  // ── 2. Usuário com trial ativo (30 dias) ──────────────────────
  const trialUser = await prisma.user.create({
    data: {
      email: 'trial@mfmei.com.br',
      password: await hash('Trial@123'),
      name: 'Trial Teste',
    },
  });

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 30);

  await prisma.company.create({
    data: {
      cnpj: '22333444000181',
      name: 'Empresa Trial MEI',
      tradeName: 'Trial MEI',
      email: 'trial@mfmei.com.br',
      phone: '11999990002',
      street: 'Av. Paulista',
      number: '200',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310100',
      ibgeCode: '3550308',
      regime: TaxRegime.MEI,
      situation: 'ATIVA',
      trialEndsAt,
      members: {
        create: { userId: trialUser.id, role: MemberRole.OWNER },
      },
    },
  });

  // ── 3. Usuário com trial expirado ─────────────────────────────
  const expiredUser = await prisma.user.create({
    data: {
      email: 'expirado@mfmei.com.br',
      password: await hash('Expirado@123'),
      name: 'Trial Expirado',
    },
  });

  const expiredAt = new Date();
  expiredAt.setDate(expiredAt.getDate() - 7);

  await prisma.company.create({
    data: {
      cnpj: '33444555000181',
      name: 'Empresa Expirada MEI',
      tradeName: 'Expirado MEI',
      email: 'expirado@mfmei.com.br',
      phone: '11999990003',
      street: 'Rua Augusta',
      number: '300',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305000',
      ibgeCode: '3550308',
      regime: TaxRegime.MEI,
      situation: 'ATIVA',
      trialEndsAt: expiredAt,
      members: {
        create: { userId: expiredUser.id, role: MemberRole.OWNER },
      },
    },
  });

  console.log('\n✅ Seed concluído! Usuários criados:\n');
  console.log('  📧 admin@mfmei.com.br     🔑 Admin@123     (plano ativo)');
  console.log('  📧 trial@mfmei.com.br     🔑 Trial@123     (trial 30 dias)');
  console.log('  📧 expirado@mfmei.com.br  🔑 Expirado@123  (trial expirado)');
  console.log('');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
