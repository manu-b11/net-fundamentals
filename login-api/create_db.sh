#!/usr/bin/env bash
# =============================================================
# create_db.sh — Crea la base de datos LoginApiDB en SQL Server
# Proyecto: LoginApi (.NET 9 minimal API de autenticación)
#
# Requisitos:
#   - sqlcmd (mssql-tools18):  brew install sqlcmd
#   - SQL Server accesible (local o Docker)
#
# Uso:
#   SQLCMD_PASS='TuPass' ./create_db.sh
#   SQLCMD_SERVER='localhost,1433' SQLCMD_USER='sa' SQLCMD_PASS='...' ./create_db.sh
#   ./create_db.sh --help
#
# Variables de entorno:
#   SQLCMD_SERVER  servidor,puerto  (default: localhost,1433)
#   SQLCMD_USER    usuario          (default: sa)
#   SQLCMD_PASS    contraseña       (obligatoria)
#
# El script es idempotente: si la BD/tablas ya existen, las deja
# como están y solo inserta lo que falte. No borra nada.
# =============================================================
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER="${SQLCMD_SERVER:-localhost,1433}"
USERNAME="${SQLCMD_USER:-sa}"
PASSWORD="${SQLCMD_PASS:-}"

case "${1:-}" in
  -h|--help)
    sed -n 's/^# \{0,1\}//p' "$0" | sed -n '5,18p'
    exit 0
    ;;
esac

if [[ -z "$PASSWORD" ]]; then
  echo "Error: define SQLCMD_PASS con la contraseña de '$USERNAME'." >&2
  echo "Ejemplo: SQLCMD_PASS='MiPass' $0" >&2
  exit 1
fi

if ! command -v sqlcmd >/dev/null 2>&1; then
  echo "Error: sqlcmd no está instalado. Instálalo con: brew install sqlcmd" >&2
  exit 1
fi

if [[ ! -f "$DIR/schema.sql" ]]; then
  echo "Error: no existe schema.sql en $DIR" >&2
  exit 1
fi

echo "▶ Ejecutando schema.sql contra $SERVER (usuario: $USERNAME)..."
sqlcmd -S "$SERVER" -U "$USERNAME" -P "$PASSWORD" -C -b -i "$DIR/schema.sql"

echo "✔ Base de datos LoginApiDB creada/verificada."
