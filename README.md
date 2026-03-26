# Sistema emitir nota mais simples do Brasil

MVP beta nacional de um SaaS desktop web para emissão simplificada de NF-e e NFS-e com foco em MEI.

## Stack
- Backend: Node.js, NestJS, Prisma, PostgreSQL, Redis, BullMQ, JWT, bcrypt.
- Frontend: React, Vite, React Router, React Hook Form, Zod, Axios.
- Infra: Docker Compose, Cloudflare R2 (compatível S3), Focus NFe, padrão nacional NFS-e, BrasilAPI.

## Estrutura
- `apps/api`: API REST modular monolith preparada para escalar.
  - `modules/auth`, `modules/users`, `modules/empresas`
  - `modules/onboarding` com BrasilAPI
  - `modules/focus` para NF-e
  - `modules/nfse` para NFS-e padrão nacional
  - `modules/fiscal-engine` para regras MEI
- `apps/web`: landing page e aplicação desktop web.
- `infra`: arquivos de infraestrutura e apoio ao deploy.

## MVP incluído
- Cadastro/login.
- Multiempresa.
- Onboarding por CNPJ com criação automática da empresa.
- Identificação de razão social, município, UF, CNAE principal e perfil de atividade.
- Emissão de NF-e e NFS-e padrão nacional.
- Wizard de emissão em 4 etapas.
- Motor fiscal inteligente para MEI com decisão automática de NF-e/NFS-e, natureza, CFOP, município e observações padrão.
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

## Como visualizar o projeto (modo local)
1. Execute o script de preview:
   ```bash
   ./scripts/preview.sh
   ```
2. Acesse:
   - Frontend: `http://localhost:5173`
   - API health: `http://localhost:3000/api/health`

### Alternativa manual
```bash
cp .env.example .env
docker compose up -d postgres redis
npm install
npm run dev
```

### Observação
Se houver bloqueio de rede no ambiente (ex.: erro 403 no npm registry), rode localmente na sua máquina com internet liberada para baixar dependências.

## Motor fiscal inteligente do MVP
- Decide automaticamente se a emissão será NF-e ou NFS-e.
- Define natureza da operação para comércio ou serviço.
- Resolve CFOP padrão 5102/6102 para NF-e.
- Resolve município da prestação para NFS-e.
- Executa validações fiscais mínimas do MVP.
- Inclui observações fiscais padrão para MEI sem destaque de tributos.

## Integrações fiscais do MVP
- NF-e via gateway Focus NFe com mapeamento, envio, consulta e webhook.
- NFS-e somente padrão nacional com builders, mappers, assinatura e consulta estruturados.
- Onboarding por CNPJ via BrasilAPI com razão social, fantasia, município, UF, CNAE e natureza jurídica.
- Autenticação com access token, refresh token e guard HTTP.
