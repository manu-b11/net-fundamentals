# net-fundamentals

Proyecto de **fundamentos de redes** con landing educativa (modelo OSI, TCP/UDP, protocolos y puertos) y un backend de **autenticación (login/registro)** para practicar el flujo completo frontend → API → base de datos.

## Estructura

```
net-fundamentals/
├── frontend/      # UI React + Vite (landing + páginas de auth)
└── login-api/     # Backend .NET 9 (minimal API) + SQL Server
```

## Frontend — `frontend/`

React 19 + Vite + React Router. Incluye:

- Landing educativa: modelo OSI, TCP vs UDP, protocolos, tabla de puertos
- Páginas de autenticación: `Login` y `SignUp` (layout compartido)

```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

Otros scripts: `npm run build`, `npm run preview`, `npm run lint`.
Más detalle: [`frontend/README.md`](frontend/README.md).

## Backend — `login-api/`

ASP.NET Core (.NET 9) minimal API para autenticación, con hash de contraseñas **BCrypt** (`BCrypt.Net-Next`) y base de datos **SQL Server**.

```bash
cd login-api

# 1. Crear la base de datos LoginApiDB (requiere sqlcmd + SQL Server corriendo)
SQLCMD_PASS='TuPass_123!' ./create_db.sh

# 2. Correr la API
cd LoginApi && dotnet run
```

Documentación completa (esquema de BD, seeds, connection string, endpoints implementados): [`login-api/README.md`](login-api/README.md).

## Estado actual

| Módulo | Estado |
|--------|--------|
| Frontend (landing + auth UI) | ✅ Desarrollado y conectado al backend |
| Backend login-api | ✅ Endpoints de registro/login funcionando (JWT + BCrypt) |
| Base de datos | ✅ SQL Server en Docker (`sqlserver`) con BD `LoginApiDB`; flujo probado end-to-end |

## Correr frontend + backend juntos

```bash
# 1. SQL Server: si el contenedor no está corriendo, `docker start sqlserver`
#    (si no existe: docker run ... — ver login-api/README.md)
# 2. Backend en http://localhost:5100
cd login-api/LoginApi && dotnet run
# 3. Frontend en http://localhost:5173 (Vite redirige /api/* al backend)
cd frontend && npm install && npm run dev
```

Entra a http://localhost:5173/login y prueba con el seed admin (`admin`/`admin123`).
Flujo verificado end-to-end el 2026-09-03 (register, login, `/me`).

> Repo con fines académicos. La contraseña del seed admin (`admin`/`admin123`) es solo para desarrollo: cambiarla antes de cualquier despliegue.
