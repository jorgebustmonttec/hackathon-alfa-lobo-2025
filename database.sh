#!/bin/sh
# start-db.sh

echo "🚀 Starting the database service in the background..."
docker compose up  database

echo "⏳ Waiting for the database to be healthy..."
# The 'up' command with '--wait' will ensure migrations only run when the DB is ready.
# This is more robust than a simple 'sleep'.
docker compose up --wait migrations

echo "✅ Database is running and migrations have been applied."
