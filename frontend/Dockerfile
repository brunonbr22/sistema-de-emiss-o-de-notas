FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base AS development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS builder
# VITE_API_URL é necessário em build-time para o Vite injetar a URL da API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
