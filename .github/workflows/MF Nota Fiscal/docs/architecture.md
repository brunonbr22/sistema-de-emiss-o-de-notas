# Arquitetura — MF Mei

## Visão Geral

```
┌──────────────┐     HTTPS      ┌──────────────────────────────────────────┐
│   Browser    │ ─────────────► │              Nginx (produção)             │
│  React/Vite  │                └────────────┬─────────────────────────────┘
└──────────────┘                             │
                                   ┌─────────┴──────────┐
                                   ▼                    ▼
                           ┌──────────────┐    ┌──────────────┐
                           │   Frontend   │    │   Backend    │
                           │ React (SPA)  │    │  NestJS API  │
                           └──────────────┘    └──────┬───────┘
                                                      │
                              ┌────────────┬──────────┴──────────┐
                              ▼            ▼                     ▼
                       ┌──────────┐ ┌──────────┐         ┌──────────────┐
                       │PostgreSQL│ │  Redis   │         │ Serviços ext.│
                       │ (Prisma) │ │ (BullMQ) │         │ Focus / NFS-e│
                       └──────────┘ └──────────┘         └──────────────┘
```

## Módulos do Backend

| Módulo            | Responsabilidade                              |
|-------------------|-----------------------------------------------|
| `AuthModule`      | Cadastro, login, JWT, refresh token           |
| `UsersModule`     | Perfil do usuário                             |
| `CompaniesModule` | Multiempresa, onboarding por CNPJ             |
| `InvoicesModule`  | CRUD de notas fiscais, wizard                 |
| `FiscalModule`    | Motor fiscal MEI (regras, validações)         |
| `NfeModule`       | Emissão NF-e via Focus NFe                    |
| `NfseModule`      | Emissão NFS-e (múltiplos provedores)          |
| `StorageModule`   | Armazenamento de XMLs (local / S3)            |
| `QueueModule`     | Filas BullMQ para emissões assíncronas        |
| `TrialModule`     | Controle de trial 14 dias e planos            |

## Fluxo de Emissão

```
Usuário
  │
  ▼
Wizard (frontend)
  │  dados do tomador + serviço
  ▼
Motor Fiscal MEI
  │  valida limites MEI, CNAE, município
  ▼
NF-e  ──► Focus NFe API ──► SEFAZ
  ou
NFS-e ──► Provedor municipal ──► Prefeitura
  │
  ▼
Salva XML + atualiza status
  │
  ▼
E-mail para tomador (opcional)
```

## Multitenancy

- Cada **usuário** pode pertencer a múltiplas **empresas** (`CompanyMember`)
- Toda query de dados é filtrada por `companyId`
- O frontend mantém a empresa ativa em contexto (`activeCompanyId`)

## Segurança

- Senhas com **bcrypt** (cost 12)
- Tokens **JWT** com expiração curta (7d padrão)
- Rate limiting global via `ThrottlerModule`
- Headers de segurança via **Helmet**
- CORS restrito ao domínio do frontend
- Certificados digitais criptografados antes de armazenar

## Decisões Técnicas

| Decisão | Motivo |
|---------|--------|
| NestJS | DI, modularidade, Swagger nativo |
| Prisma | Type-safety, migrations versionadas |
| BullMQ | Emissões assíncronas sem bloquear a API |
| Zod no frontend | Validação no cliente antes de enviar |
| Vite | Build rápido, HMR, ideal para SPA |
| Nginx SPA | Fallback para React Router funcionar em produção |
