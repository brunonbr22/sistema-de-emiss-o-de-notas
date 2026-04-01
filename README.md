# Financeiro MEI Simples

Fase 1 (fundação): estrutura completa de projeto para um sistema web simples de controle financeiro para MEI.

## Objetivo desta entrega

Esta versão foca na **base sólida** do projeto:

- Estrutura de pastas backend/frontend
- Arquitetura de módulos
- Schema PostgreSQL
- Arquivos base para API e interface
- Rotas iniciais de autenticação e financeiro

> Sem integrações externas profundas nesta etapa.

## Stack

- **Frontend:** React + Vite + CSS puro (mobile-first)
- **Backend:** Node.js + Express
- **Banco:** PostgreSQL
- **Auth:** JWT + bcryptjs

## Estrutura de pastas

```bash
.
├── backend/
│   ├── sql/
│   │   └── schema.sql
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── database/
│   │   │   └── pool.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── auth.controller.js
│   │       │   ├── auth.routes.js
│   │       │   └── auth.service.js
│   │       └── finance/
│   │           ├── finance.controller.js
│   │           ├── finance.routes.js
│   │           └── finance.service.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── app/App.jsx
│       ├── features/
│       │   ├── auth/AuthPage.jsx
│       │   ├── dashboard/DashboardPage.jsx
│       │   └── movements/MovementsPage.jsx
│       ├── services/api.js
│       └── styles/base.css
├── package.json
└── README.md
```

## Banco de dados (schema)

Arquivo: `backend/sql/schema.sql`

- Tabela `users`
- Tabela `movements`
- Constraints para tipo/valor
- Índice por usuário e data

## Como rodar local

### 1) Criar banco

```sql
CREATE DATABASE financeiro_mei;
```

### 2) Aplicar schema

```bash
psql -U postgres -d financeiro_mei -f backend/sql/schema.sql
```

### 3) Configurar ambiente

```bash
cp backend/.env.example backend/.env
```

### 4) Instalar dependências

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 5) Executar

```bash
npm run dev
```

- API: `http://localhost:3001`
- Web: `http://localhost:5173`

## Próximos passos (Fase 2)

- Persistir token no frontend
- Consumir dashboard real na interface
- Fluxo completo de movimentações (listar e salvar)
- Ajustes de UX para uso 100% mobile
