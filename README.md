# Sistema emitir nota mais simples do Brasil

MVP beta nacional de um SaaS desktop web para emissão simplificada de NF-e e NFS-e com foco em MEI.

## Stack
- Backend: Node.js, NestJS, Prisma, PostgreSQL, Redis, BullMQ, JWT, bcrypt.
- Frontend: React, Vite, React Router, React Hook Form, Zod, Axios.
- Infra: Docker Compose, Cloudflare R2 (compatível S3), Focus NFe, padrão nacional NFS-e.

## Estrutura
- `apps/api`: API REST modular monolith preparada para escalar.
- `apps/web`: landing page e aplicação desktop web.
- `infra`: arquivos de infraestrutura e apoio ao deploy.

## MVP incluído
- Cadastro/login.
- Multiempresa.
- Onboarding por CNPJ.
- Emissão de NF-e e NFS-e padrão nacional.
- Wizard de emissão em etapas.
- Motor fiscal inteligente para MEI.
- Armazenamento de XML.
- Trial grátis de 14 dias.
- Painel simples do usuário.
- Landing page comercial.

## Subir localmente
```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```
