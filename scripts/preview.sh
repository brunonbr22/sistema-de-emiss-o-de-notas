#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "[preview] .env criado a partir de .env.example"
fi

echo "[preview] subindo PostgreSQL e Redis..."
docker compose up -d postgres redis

echo "[preview] instalando dependências..."
npm install

echo "[preview] iniciando API e Web em paralelo..."
npm run dev
