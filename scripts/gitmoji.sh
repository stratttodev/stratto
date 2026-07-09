#!/bin/bash

# Script: gitmoji
# Uso: ./scripts/gitmoji "✨ update navbar"
# Hace: git add . + commit + push a la rama actual

MESSAGE="$1"

if [ -z "$MESSAGE" ]; then
  echo "❌ Falta el mensaje de commit"
  echo "Uso: ./scripts/gitmoji \"✨ update navbar\""
  exit 1
fi

BRANCH=$(git branch --show-current)

git add .
git commit -m "$MESSAGE"
git push origin "$BRANCH"

echo "✅ Push a $BRANCH: $MESSAGE"
