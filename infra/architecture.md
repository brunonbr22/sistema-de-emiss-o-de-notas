# Arquitetura do MVP

## Decisões principais
- Monólito modular com NestJS para acelerar MVP e manter fronteiras prontas para extração futura.
- PostgreSQL + Prisma para modelo transacional.
- Redis + BullMQ para filas de emissão, callbacks e armazenamento temporário.
- Cloudflare R2 para XMLs autorizados e cancelados.
- Focus NFe para NF-e e padrão nacional para NFS-e.
- BrasilAPI para onboarding inicial por CNPJ.

## Módulos da API
- `modules/auth`: cadastro, login, access token, refresh token e autenticação HTTP.
- `modules/users`: gestão do usuário.
- `modules/empresas`: vínculo usuário-empresa com papel OWNER.
- `modules/onboarding`: busca por CNPJ via BrasilAPI, CNAE, município/UF, natureza jurídica e criação automática da empresa.
- `modules/fiscal-engine`: decisões fiscais automáticas de documento, natureza, CFOP, município, validações e observações MEI.
- `modules/focus`: integração NF-e com Focus NFe, mapper, consulta e webhook.
- `modules/nfse`: integração NFS-e padrão nacional com builder, mapper, assinatura e consulta.
- `invoices`: wizard, emissão NF-e/NFS-e, XML, status e histórico.
- `billing`: trial grátis de 14 dias e cálculo de saldo de trial.
- `audit`: trilha de auditoria.
- `queues`: filas BullMQ para emissão/consulta.
- `storage`: upload/download dos XMLs.

## Fluxo de emissão simplificada
1. Usuário cria conta.
2. Informa apenas o CNPJ.
3. O onboarding consulta BrasilAPI, identifica razão social, fantasia, município, UF, CNAE principal e natureza jurídica.
4. A empresa é criada no sistema, o usuário vira OWNER e o trial de 14 dias é ativado.
5. No dashboard, o usuário vê boas-vindas, trial restante e botão “Emitir nota”.
6. O wizard roda em 4 etapas: destinatário, item/operação, revisão e emissão.
7. O motor fiscal decide NF-e/NFS-e, natureza, CFOP, município e observações MEI.
8. NF-e segue para Focus NFe; NFS-e segue para o módulo padrão nacional.
9. XML, chave de acesso, protocolo, status e histórico ficam disponíveis no pós-emissão.

## Fiscal engine MEI
- `cnae-classifier.ts`: classifica atividade principal como comércio, serviço ou mista.
- `cfop-resolver.ts`: aplica 5102 dentro do estado e 6102 fora do estado.
- `natureza-resolver.ts`: retorna “Venda de mercadoria” ou “Prestação de serviços”.
- `municipio-resolver.ts`: resolve município da prestação quando a nota for NFS-e.
- `mei-rules.ts`: aplica regra de não destacar tributos e validações mínimas do MVP.
- `fiscal-engine.service.ts`: orquestra as decisões fiscais automáticas usadas pelo wizard e pela emissão.
