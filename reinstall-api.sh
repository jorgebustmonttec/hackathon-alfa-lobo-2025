#!/bin/sh
# re-install-api.sh

echo "📦 Re-running npm install in the 'api' container..."
docker compose exec api npm install
echo "✅ Done."