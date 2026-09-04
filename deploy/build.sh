#!/usr/bin/env bash
# Construye frontend + publica LoginApi (para IIS o ejecución local)
# Uso: ./deploy/build.sh   (desde la raíz del repo)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="$ROOT/frontend"
API_DIR="$ROOT/login-api/LoginApi"
WWWROOT="$API_DIR/wwwroot"
PUBLISH="$ROOT/publish"

echo "[1/4] Build frontend (Vite)..."
(cd "$FRONTEND" && npm ci && npm run build)

echo "[2/4] Copiando frontend/dist a LoginApi/wwwroot..."
rm -rf "$WWWROOT"
mkdir -p "$WWWROOT"
cp -R "$FRONTEND/dist/." "$WWWROOT/"

echo "[3/4] Publicando LoginApi (Release)..."
dotnet publish "$API_DIR/LoginApi.csproj" -c Release -o "$PUBLISH"

echo "[4/4] Listo."
echo "  Publicación: $PUBLISH"
echo "  En IIS: sitio web -> esa carpeta, App Pool 'Sin código administrado'."
echo "  Pasos completos: deploy/README.md"
