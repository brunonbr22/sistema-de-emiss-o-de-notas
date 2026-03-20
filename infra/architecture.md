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
- `companies`: empresas, certificado/ambiente futuro e trial.
- `onboarding`: busca por CNPJ, CNAE, prefeitura e regras iniciais.
- `invoices`: wizard, emissão NF-e/NFS-e, XML e status.
- `billing`: trial grátis de 14 dias e prontidão para assinatura futura.
- `audit`: trilha de auditoria.
- `queues`: filas BullMQ para emissão/consulta.
- `storage`: upload/download dos XMLs.

## Fluxo de emissão simplificada
1. Usuário cria conta.
2. Cadastra empresa por CNPJ.
3. Motor fiscal monta sugestões de natureza, CFOP, NBS/CNAE e campos mínimos.
4. Wizard em etapas reduz complexidade.
5. API valida payload e enfileira emissão.
6. Integração externa retorna XML/recibo/status.
7. XML é salvo no R2 e evento auditado.
