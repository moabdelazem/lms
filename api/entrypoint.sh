#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push --url "$DATABASE_URL"

echo "Starting server..."
exec node dist/server.js
