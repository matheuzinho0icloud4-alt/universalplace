#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR=$(dirname "$0")
cd "$ROOT_DIR"

echo "Starting PostgreSQL via docker-compose..."
docker-compose up -d db

echo "Waiting for Postgres to become ready..."
# wait-for-postgres
until docker exec up-postgres pg_isready -U postgres; do
  echo "Waiting for postgres..."
  sleep 1
done

echo "Postgres is ready. Starting backend and frontend dev servers..."

# start backend in a new terminal (Linux/macOS)
(cd backend && CORS_ORIGIN=http://localhost:3000 JWT_SECRET=devsecret DATABASE_URL=postgresql://postgres:postgres@localhost:5432/universalplace NODE_ENV=development npm run dev) &

# start frontend
npm run dev
