#!/usr/bin/env bash
# build.sh

# Stop on first error
set -e

echo "🚀 Building and starting the gategroup-hackathon dev environment..."

# Build all images that have changed
docker compose build

# Start the containers and attach to the logs.
# --remove-orphans cleans up any old containers.
docker compose up --remove-orphans

# Note: This will not exit, it will stream logs.
# Press Ctrl+C to stop.