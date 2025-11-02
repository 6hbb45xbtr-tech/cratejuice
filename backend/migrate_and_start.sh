#!/bin/bash
# Script to run Alembic migrations and start the application

set -e

echo "Running database migrations..."
cd "$(dirname "$0")"

# Run migrations
alembic upgrade head

echo "Migrations complete. Starting application..."

# Start your application here (example)
# python app.py
