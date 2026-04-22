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
