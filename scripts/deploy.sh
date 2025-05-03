#!/usr/bin/env bash
set -e

# Check if version is provided
if [ -z "$1" ]; then
  echo "Error: Version parameter is required"
  echo "Usage: ./scripts/deploy.sh v1.0.0"
  exit 1
fi

VERSION=$1

# Trigger the GitHub Actions workflow
gh workflow run deploy.yml -f version=$VERSION

echo "✅ Deployment workflow triggered for version $VERSION"
echo "Check the status at: https://github.com/capncrockett/signal-lost-2/actions"
echo "Once deployed, your game will be live at: https://capncrockett.github.io/signal-lost-2/"
