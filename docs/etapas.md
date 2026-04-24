# Etapas do MVP — MF Mei

## Etapa 1 — Estrutura ✅
- Monorepo: `backend/`, `frontend/`, `infra/`, `docs/`
- docker-compose com PostgreSQL, Redis, Backend, Frontend
- Schema Prisma inicial (User, Company, Invoice)
- Configuração base NestJS (Helmet, CORS, Throttle, Swagger)
- Configuração base React + Vite (React Router, Axios)
- README e documentação de arquitetura

## Etapa 2 — Autenticação
- `POST /auth/register` — cadastro com e-mail + senha
- `POST /auth/login` — retorna JWT
- `POST /auth/refresh` — renova token
- `POST /auth/logout`
- Guard JWT global
- Página de cadastro
- Página de login
- Contexto de autenticação no frontend

## Etapa 3 — Multiempresa + Onboarding
- `POST /companies` — cria empresa
- `GET /companies` — lista empresas do usuário
- Busca automática de dados por CNPJ (ReceitaWS)
- Seleção de empresa ativa no frontend
- Tela de onboarding step-by-step

## Etapa 4 — Motor Fiscal MEI ✅
- Validação de limite anual MEI (R$ 81.000)
- Validação de CNAE permitido para MEI
- Determinação do tipo de nota (NF-e ou NFS-e)
- Cálculo de ISS por município
- Regras de retenção

## Etapa 5 — Emissão NF-e ✅
- Integração Focus NFe (homologação e produção via `FOCUS_NFE_ENV`)
- `POST /invoices/nfe/companies/:companyId` — emite NF-e
- `GET  /invoices/nfe/companies/:companyId` — lista NF-e da empresa
- `GET  /invoices/nfe/:id` — consulta status (sincroniza com Focus NFe)
- `POST /invoices/nfe/:id/cancel` — cancelamento
- `GET  /invoices/nfe/:id/xml` — download XML assinado
- `GET  /invoices/nfe/:id/danfe` — download DANFE (PDF)
- Token Focus NFe por empresa (`focusNfeToken`) com fallback para `FOCUS_NFE_TOKEN` do env

## Etapa 6 — Emissão NFS-e ✅
- Integração Focus NFe padrão ABRASF (homologação e produção)
- `PUT  /invoices/nfse-config/companies/:companyId` — cadastra/atualiza config por município (inscrição municipal, item lista serviços)
- `GET  /invoices/nfse-config/companies/:companyId` — lista configurações
- `POST /invoices/nfse/companies/:companyId` — emite NFS-e (valida motor fiscal + ISS automático)
- `GET  /invoices/nfse/companies/:companyId` — lista NFS-e da empresa
- `GET  /invoices/nfse/:id` — consulta status (sincroniza com Focus NFe)
- `POST /invoices/nfse/:id/cancel` — cancelamento
- `GET  /invoices/nfse/:id/xml` — download XML
- `GET  /invoices/nfse/:id/pdf` — download PDF

## Etapa 7 — Wizard de Emissão ✅
- Rota `/emitir` com botão de acesso rápido no Dashboard
- Step 1: CNAE + valor → fiscal check automático (tipo NF-e ou NFS-e, ISS, limite MEI)
- Step 2: Dados do tomador (CPF/CNPJ, nome, e-mail, endereço opcional)
- Step 3: Dados do serviço (CFOP + natureza para NF-e; inscrição municipal + item lista para NFS-e)
- Step 4: Revisão completa antes de emitir
- StepFeedback: polling de status a cada 4 s, download XML/DANFE/PDF

## Etapa 8 — Armazenamento XML ✅
- `StorageService` com backend local (filesystem) configurável via `STORAGE_PATH`
- XML salvo automaticamente após autorização em `storage/invoices/{companyId}/{type}-{id}.xml`
- PDF/DANFE cacheado no primeiro download em `storage/invoices/{companyId}/{type}-{id}.pdf`
- Downloads de XML e PDF servidos do cache local; fallback para Focus NFe se ainda não cacheado
- `xmlPath` gravado na invoice após persistência para auditar o arquivo armazenado
- Estrutura preparada para troca de backend (S3) via `STORAGE_DRIVER` sem alterar o serviço

## Etapa 9 — Trial + Planos ✅
- Guard `assertPlanActive` em `emitNfe` e `emitNfse`: bloqueia com 403 se trial expirado e sem plano
- `GET /v1/plans` — lista planos disponíveis (Mensal R$29,90 · Anual R$16,90/mês)
- `POST /v1/payments/webhook` — estrutura de webhook com `X-Webhook-Secret`; ativa/cancela `planId` na Company
- Frontend `/planos` — cards de plano com preços e features; marca "Plano atual"
- `TrialBanner` atualizado: mostra dias restantes, estado expirado e link direto para `/planos`
- Botão "Emitir nota" substituído por "Assinar plano" no Dashboard quando trial expirado

## Etapa 10 — Dashboard ✅
- `GET /v1/dashboard/companies/:companyId` — agrega em uma chamada: totais mês/ano, limite MEI, últimas 6 notas, status plano/trial
- 4 stat cards: emitido no mês · emitido no ano · disponível MEI · status do plano
- Barra de progresso do limite anual MEI com alertas visuais (amarelo ≥80%, vermelho se excedido)
- Tabela das últimas notas com tipo (NF-e/NFS-e), tomador, valor, status e data
- Botão "Emitir nota" condicionado ao `isPlanActive`; substitui por "Assinar plano" quando bloqueado
- `TrialBanner` integrado com dias restantes e link para `/planos`

## Etapa 11 — Landing Page ✅
- Rota pública `/` — redireciona para `/dashboard` se autenticado
- **Navbar** sticky com links de âncora (Funcionalidades, Preços) e CTAs (Entrar / Começar grátis)
- **Hero** — headline, sub, métricas de credibilidade (< 1 min · R$ 81k · 100% SEFAZ) e dois botões
- **Funcionalidades** — 6 cards: emissão rápida, motor fiscal, NF-e/NFS-e, XML/DANFE, limite MEI, segurança
- **Como funciona** — 3 passos numerados: Crie conta → CNPJ → Emita
- **Preços** — 2 cards (Mensal R$29,90 · Anual R$16,90/mês) com badge "Mais popular"
- **FAQ** — 4 perguntas com `<details>` nativo (sem JS extra)
- **CTA final** — fundo azul com botão de cadastro
- **Footer** — copyright + links utilitários
