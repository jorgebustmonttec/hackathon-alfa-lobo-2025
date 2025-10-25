#!/bin/sh
# re-install-app.sh

echo "📦 Re-running npm install in the 'app' container..."
docker compose exec app npm install
echo "✅ Done."