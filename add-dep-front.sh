#!/bin/sh
# add-app-dep.sh

if [ -z "$1" ]; then
  echo "Usage: sh add-app-dep.sh <package-name>"
  exit 1
fi

echo "📦 Installing new package '$1' into the 'app' container..."
docker compose exec app npm install $1
echo "✅ Done."