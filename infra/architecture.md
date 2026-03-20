# Arquitetura do MVP

## Decisões principais
- Monólito modular com NestJS para acelerar MVP e manter fronteiras prontas para extração futura.
- PostgreSQL + Prisma para modelo transacional.
- Redis + BullMQ para filas de emissão, callbacks e armazenamento temporário.
- Cloudflare R2 para XMLs autorizados e cancelados.
- Focus NFe para NF-e e cliente dedicado para NFS-e padrão nacional.

## Módulos da API
- `auth`: cadastro, login, JWT e hash de senha.
- `users`: perfil e relacionamento multiempresa.
- `companies`: empresas, vínculo OWNER e trial.
- `onboarding`: busca por CNPJ, CNAE, município/UF e criação automática da empresa.
- `invoices`: wizard, emissão NF-e/NFS-e, XML, status e histórico.
- `billing`: trial grátis de 14 dias e cálculo de saldo de trial.
- `audit`: trilha de auditoria.
- `queues`: filas BullMQ para emissão/consulta.
- `storage`: upload/download dos XMLs.

## Fluxo de emissão simplificada
1. Usuário cria conta.
2. Informa apenas o CNPJ.
3. O onboarding busca razão social, município, UF, CNAE principal e perfil da atividade.
4. A empresa é criada no sistema, o usuário vira OWNER e o trial de 14 dias é ativado.
5. No dashboard, o usuário vê boas-vindas, trial restante e botão “Emitir nota”.
6. O wizard roda em 4 etapas: destinatário, item/operação, revisão e emissão.
7. A API valida payload, aplica motor fiscal MEI e enfileira a emissão.
8. XML, status e histórico ficam disponíveis no pós-emissão.
