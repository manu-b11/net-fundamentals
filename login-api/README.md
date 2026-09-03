# LoginApi

API de autenticación (login/registro) construida con **ASP.NET Core (.NET 9) — Minimal API**.
El hash de contraseñas usa **BCrypt** (paquete `BCrypt.Net-Next`).

## Stack

- **Framework:** .NET 9 (Minimal API, OpenAPI)
- **Hash de contraseñas:** BCrypt.Net-Next
- **Base de datos:** SQL Server (T-SQL)

## Estructura

```
login-api/
├── LoginApi/            # Proyecto .NET 9 (Program.cs, appsettings.json)
├── schema.sql           # Creación de la BD: LoginApiDB + tablas + seeds
├── create_db.sh         # Script que ejecuta schema.sql vía sqlcmd
└── README.md
```

## Base de datos

**Motor:** SQL Server. **Base:** `LoginApiDB`.

### Esquema

```
users
  ├── id (PK, IDENTITY)
  ├── username (UNIQUE)
  ├── email (UNIQUE)
  ├── password_hash      → hash BCrypt
  ├── role               → 'Admin' | 'User'
  ├── is_active
  ├── last_login
  └── created_at / updated_at

refresh_tokens
  ├── id (PK, IDENTITY)
  ├── user_id (FK → users, ON DELETE CASCADE)
  ├── token_hash         → SHA-256 del token (nunca el token crudo)
  ├── expires_at
  ├── revoked_at
  └── created_at
```

### 1. Levantar SQL Server (Docker, opcional)

```bash
docker run -d --name sqlserver \
  -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=TuPass_123!" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

### 2. Crear la base de datos

**Requisito:** `sqlcmd` (`brew install sqlcmd`).

```bash
SQLCMD_PASS='TuPass_123!' ./create_db.sh
# con otros datos de conexión:
SQLCMD_SERVER='localhost,1433' SQLCMD_USER='sa' SQLCMD_PASS='TuPass_123!' ./create_db.sh
```

El script es **idempotente**: crea `LoginApiDB` y las tablas solo si no existen,
e inserta datos faltantes. No borra nada. Ejecución manual equivalente:

```bash
sqlcmd -S localhost,1433 -U sa -P 'TuPass_123!' -C -i schema.sql
```

### Datos iniciales

| Usuario | Password | Rol   | Email              |
|---------|----------|-------|--------------------|
| `admin` | `admin123` | Admin | admin@login.local |

> ⚠️ Cambiar la contraseña del admin en producción (el hash está en `schema.sql`).

## Conectar desde la API

Connection string de ejemplo para `LoginApi/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost,1433;Database=LoginApiDB;User Id=sa;Password=TuPass_123!;TrustServerCertificate=True;Encrypt=True"
  }
}
```

## API (implementada)

- `GET /api/health` — estado del servicio
- `POST /api/auth/register` — crear cuenta `{ fullName, username, password, email? }` → 201 + usuario
- `POST /api/auth/login` — `{ username, password }` → `{ token, expiresAt, user }` (JWT HS256, 8 h)
- `GET /api/auth/me` — usuario del Bearer token (requiere `Authorization: Bearer <token>`)

El frontend (`frontend/`) consume estas rutas vía el proxy de Vite (`/api` → `http://localhost:5100`) y guarda el token en `localStorage`/`sessionStorage` según la opción “Recordarme”.

## Notas

- `password_hash` guarda **solo el hash BCrypt**; nunca la contraseña en texto plano.
- `refresh_tokens.token_hash` guarda el SHA-256 del token: si la BD se filtra,
  los tokens no son reutilizables.
- Los `updated_at` se mantienen desde la aplicación (el esquema no usa triggers).
