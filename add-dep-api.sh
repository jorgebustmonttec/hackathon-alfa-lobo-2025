#!/bin/sh
# add-api-dep.sh

if [ -z "$1" ]; then
  echo "Usage: sh add-api-dep.sh <package-name>"
  exit 1
fi

echo "📦 Installing new package '$1' into the 'api' container..."
docker compose exec api npm install $1
echo "✅ Done."