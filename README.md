# MF Mei — SaaS de Emissão de Notas Fiscais para MEI

> Emita sua nota fiscal em menos de 1 minuto.

## Visão Geral

O **MF Mei** é um SaaS nacional focado em Microempreendedores Individuais (MEI), oferecendo emissão simplificada de NF-e e NFS-e sem linguagem contábil.

## Stack

| Camada     | Tecnologia                              |
|------------|-----------------------------------------|
| Backend    | Node.js · NestJS · PostgreSQL · Prisma  |
| Auth       | JWT · bcrypt                            |
| Queue      | Redis · BullMQ                          |
| Frontend   | React · Vite · React Hook Form · Zod    |
| HTTP       | Axios                                   |
| Infra      | Docker · docker-compose · Nginx         |

## Estrutura do Projeto

```
mf-mei/
├── backend/          # API NestJS
├── frontend/         # App React + Vite
├── infra/            # Nginx, configs de infra
├── docs/             # Documentação técnica
├── docker-compose.yml
└── .env.example
```

## Rodando Localmente

### Pré-requisitos

- Docker >= 24
- Docker Compose >= 2.20
- Node.js >= 20 (desenvolvimento local)

### Setup

```bash
# 1. Copie as variáveis de ambiente
cp .env.example .env

# 2. Suba todos os serviços
docker compose up -d

# 3. Execute as migrations do banco
docker compose exec backend npx prisma migrate dev

# 4. Acesse
# Frontend: http://localhost:5173
# API:      http://localhost:3000
# API Docs: http://localhost:3000/api
```

### Desenvolvimento Local (sem Docker)

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev

# Frontend (outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Deploy — Railway

O projeto usa um monorepo com dois serviços Railway (backend e frontend) + addons PostgreSQL e Redis.

### 1. Criar o repositório no GitHub

Suba o projeto para um repositório GitHub (público ou privado).

### 2. Criar o projeto no Railway

1. Acesse [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**
2. Selecione o repositório

### 3. Adicionar os addons

No painel do projeto Railway, clique em **+ New** e adicione:
- **PostgreSQL** — Railway provisiona automaticamente e injeta `DATABASE_URL`
- **Redis** — Railway provisiona automaticamente e injeta `REDIS_URL`

### 4. Configurar o serviço Backend

- **Source → Root Directory**: `backend`
- **Variables** (adicione todas):

```
NODE_ENV=production
JWT_SECRET=<gere um secret seguro de 256 bits>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://<url-do-frontend>.railway.app
FOCUS_NFE_TOKEN=<seu token Focus NFe>
FOCUS_NFE_BASE_URL=https://api.focusnfe.com.br
STORAGE_DRIVER=local
```

> `DATABASE_URL` e `REDIS_URL` são injetados automaticamente pelos addons.

> **Banco:** no primeiro deploy o container roda `prisma db push` (cria as tabelas a partir do schema). Após criar migrations com `npx prisma migrate dev`, troque o CMD do Dockerfile para `npx prisma migrate deploy && node dist/main`.

### 5. Configurar o serviço Frontend

- **Source → Root Directory**: `frontend`
- **Variables** (adicione):

```
VITE_API_URL=https://<url-do-backend>.railway.app/api
```

> `VITE_API_URL` é uma variável de **build-time** — o Vite a embute no bundle. Defina antes do primeiro deploy.

### 6. Deploy

Railway faz o build automaticamente via Dockerfile ao fazer push no GitHub.

- O backend roda `npx prisma migrate deploy && node dist/main` na inicialização
- O frontend serve arquivos estáticos via Nginx na porta 80

---

## Etapas do MVP

- [x] **Etapa 1** — Estrutura do projeto
- [ ] **Etapa 2** — Auth (cadastro, login, JWT)
- [ ] **Etapa 3** — Multiempresa + Onboarding por CNPJ
- [ ] **Etapa 4** — Motor Fiscal MEI
- [x] **Etapa 5** — Emissão NF-e (Focus NFe)
- [x] **Etapa 6** — Emissão NFS-e (padrão nacional)
- [x] **Etapa 7** — Wizard de emissão
- [x] **Etapa 8** — Armazenamento XML
- [x] **Etapa 9** — Trial 14 dias + planos
- [x] **Etapa 10** — Dashboard
- [x] **Etapa 11** — Landing page

## Documentação

Veja [`docs/`](./docs/) para arquitetura, decisões técnicas e guias.

## Licença

Proprietário — MF Contábil.
