#!/bin/bash

# Script: gitmoji
# Uso: ./scripts/gitmoji
# Muestra menu interactivo para elegir tipo de commit

echo ""
echo "🏷️  Selecciona tipo de commit:"
echo ""
echo "  1) ✨ feature    - nueva funcionalidad"
echo "  2) 🐛 fix        - correccion de bug"
echo "  3) 🎨 style      - estilos/UI"
echo "  4) ♻️  refactor   - refactorizacion"
echo "  5) ⚡ perf       - performance"
echo "  6) 📝 docs       - documentacion"
echo "  7) 🧪 test       - tests"
echo "  8) 🔧 config     - configuracion"
echo "  9) 📦 build      - build/deps"
echo ""

read -p "Opcion (1-9): " OPTION
read -p "Mensaje corto: " MESSAGE

if [ -z "$MESSAGE" ]; then
  echo "❌ Falta el mensaje"
  exit 1
fi

case $OPTION in
  1) EMOJI="✨" ;;
  2) EMOJI="🐛" ;;
  3) EMOJI="🎨" ;;
  4) EMOJI="♻️" ;;
  5) EMOJI="⚡" ;;
  6) EMOJI="📝" ;;
  7) EMOJI="🧪" ;;
  8) EMOJI="🔧" ;;
  9) EMOJI="📦" ;;
  *) echo "❌ Opcion invalida"; exit 1 ;;
esac

BRANCH=$(git branch --show-current)
FULL_MESSAGE="$EMOJI $MESSAGE"

echo ""
echo "📤 $FULL_MESSAGE"
echo ""

git add .
git commit -m "$FULL_MESSAGE"
git push origin "$BRANCH"

echo "✅ Push a $BRANCH"
