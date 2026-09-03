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
  ├── email (UNIQUE, opcional)
  ├── full_name (opcional)
  ├── password_hash      → hash BCrypt
  ├── role               → 'Admin' | 'User'
  ├── is_active
  ├── last_login
  └── created_at / updated_at

refresh_tokens        (tabla reservada: el API aún no emite refresh tokens)
  ├── id (PK, IDENTITY)
  ├── user_id (FK → users, ON DELETE CASCADE)
  ├── token_hash         → SHA-256 del token (nunca el token crudo)
  ├── expires_at
  ├── revoked_at
  └── created_at
```

El `schema.sql` es **re-ejecutable** e incluye la migración de bases creadas
con el esquema v1 (agrega `full_name` y deja el email opcional).

### 1. Levantar SQL Server (Docker)

```bash
docker run -d --name sqlserver --restart unless-stopped \
  -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=TuPass_123!" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

> En Apple Silicon la imagen corre emulada (linux/amd64); tarda unos segundos en quedar lista.

### 2. Crear la base de datos

**Opción A** — `sqlcmd` local (`brew install sqlcmd`):

```bash
SQLCMD_PASS='TuPass_123!' ./create_db.sh
# con otros datos de conexión:
SQLCMD_SERVER='localhost,1433' SQLCMD_USER='sa' SQLCMD_PASS='TuPass_123!' ./create_db.sh
```

El script es **idempotente**: crea `LoginApiDB` y las tablas solo si no existen,
e inserta datos faltantes. No borra nada.

**Opción B** — sin instalar nada: el cliente `sqlcmd` ya viene dentro del contenedor
(`/opt/mssql-tools18/bin/sqlcmd`):

```bash
docker cp schema.sql sqlserver:/tmp/schema.sql
docker exec sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'TuPass_123!' -C -i /tmp/schema.sql
```

### Datos iniciales

| Usuario | Password | Rol   | Email              |
|---------|----------|-------|--------------------|
| `admin` | `admin123` | Admin | admin@login.local |

> ⚠️ Credenciales solo de desarrollo: el hash del seed (en `schema.sql`) corresponde
> a `admin123` y fue generado con `EnhancedHashPassword` de BCrypt.Net-Next (revisión `$2a$`,
> que es la que `EnhancedVerify` acepta). Cambiarlo antes de producción.

## Verificación end-to-end (2026-09-03)

Probado en vivo contra SQL Server en Docker (`sqlserver`):

- `POST /api/auth/register` → 201 con el usuario creado
- `POST /api/auth/login` con `admin`/`admin123` y con un usuario registrado → 200 con token JWT
- `GET /api/auth/me` con el Bearer token → devuelve el usuario correcto (`id` real)
- Login con contraseña incorrecta → 401 · Registro duplicado → 409

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

Pendiente (roadmap): `POST /api/auth/refresh` y `POST /api/auth/logout` usando la tabla `refresh_tokens`.

## Notas

- `password_hash` guarda **solo el hash BCrypt**; nunca la contraseña en texto plano.
- `refresh_tokens.token_hash` guarda el SHA-256 del token: si la BD se filtra,
  los tokens no son reutilizables.
- Los `updated_at` se mantienen desde la aplicación (el esquema no usa triggers).
