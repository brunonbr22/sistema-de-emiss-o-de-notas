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
- Onboarding por CNPJ com criação automática da empresa.
- Identificação de razão social, município, UF, CNAE principal e perfil de atividade.
- Emissão de NF-e e NFS-e padrão nacional.
- Wizard de emissão em 4 etapas.
- Motor fiscal inteligente para MEI.
- Armazenamento de XML.
- Trial grátis de 14 dias.
- Painel simples do usuário.
- Pós-emissão com status, download de XML e histórico.
- Landing page comercial.

## Fluxo principal do usuário
1. Cadastro da conta com nome, e-mail e senha.
2. Onboarding por CNPJ: consulta dados, cria empresa, vincula OWNER e ativa trial.
3. Dashboard com boas-vindas, botão principal de emissão e trial restante.
4. Wizard com cliente, item/operação, revisão e emissão.
5. Pós-emissão com status, XML e histórico.

## Subir localmente
```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```
