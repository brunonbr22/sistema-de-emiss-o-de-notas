FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --ignore-scripts

FROM base AS development
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM base AS builder
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copia node_modules completo do builder (inclui prisma CLI para migrate)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && node dist/main"]
