# Despliegue en Windows Server + IIS (net-fundamentals)

Un solo sitio IIS sirve la **UI** (React/Vite) y la **API** (`login-api`, .NET 9): el build del
frontend se copia a `LoginApi/wwwroot` y el backend sirve estáticos + fallback SPA (`/login`,
`/signup`, … → `index.html`). Sin CORS, sin proxy inverso.

## Requisitos

| Dónde | Qué |
|---|---|
| Servidor Windows | IIS habilitado + **ASP.NET Core Hosting Bundle 9.x** (https://dotnet.microsoft.com/download/dotnet/9.0). La instalación reinicia IIS. |
| Servidor Windows | SQL Server (Express basta) — la BD `LoginApiDB` se crea con `login-api/schema.sql` |
| Máquina de build | .NET SDK 9 + Node 20+ (puede ser distinta del servidor) |

## 1. Construir

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File deploy/build.ps1
```

macOS/Linux:

```bash
./deploy/build.sh
```

Genera `publish/` con: `LoginApi.dll` + `web.config` (módulo AspNetCoreModuleV2, `hostingModel="inprocess"`) + `wwwroot/` (UI).

Equivalente manual:

```bash
cd frontend && npm ci && npm run build          # 1. dist/
cp -R frontend/dist/. login-api/LoginApi/wwwroot/  # 2. estáticos al backend
dotnet publish login-api/LoginApi/LoginApi.csproj -c Release -o publish  # 3. publicación
```

El `web.config` lo genera `dotnet publish`; no hace falta crearlo a mano. Como es
framework-dependent, el servidor solo necesita el Hosting Bundle (el runtime va incluido en él).

## 2. Base de datos

Crear `LoginApiDB` en el SQL Server destino (usa `-I` o confía en el `SET QUOTED_IDENTIFIER ON`
ya incluido en el script, necesario por el índice filtrado de `email`):

```powershell
sqlcmd -S SERVIDOR -U sa -P '****' -i login-api\schema.sql
```

⚠ El seed `admin`/`admin123` es solo de desarrollo → cambiarlo/eliminarlo en producción.

## 3. Configuración de producción

Copiar `deploy/appsettings.Production.example.json` → `publish/appsettings.Production.json`
y completar:

```json
{
  "ConnectionStrings": {
    "Default": "Server=SERVIDOR;Database=LoginApiDB;User Id=sa;Password=****;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "clave-aleatoria-de-32+-caracteres",
    "Issuer": "LoginApi",
    "Audience": "LoginApiFront"
  }
}
```

Alternativa sin archivos con secretos: variables de entorno en el App Pool / sitio IIS
(`ConnectionStrings__Default`, `Jwt__Key`) con `ASPNETCORE_ENVIRONMENT=Production`.

## 4. Crear el sitio en IIS

1. **App Pool**: nuevo → .NET CLR version = **"Sin código administrado" (No Managed Code)**, pipeline Integrated.
2. **Sitio web**: ruta física = carpeta `publish/`, App Pool del paso 1, binding HTTP (y HTTPS con certificado).
3. Permisos NTFS: lectura para `IIS_IUSRS` sobre la carpeta.
4. Arrancar el sitio.

## 5. Verificar

| URL | Esperado |
|---|---|
| `http://servidor/` | Landing (index.html) |
| `http://servidor/login` | Formulario de login (fallback SPA) |
| `http://servidor/api/health` | `{"status":"ok",...}` |
| `POST /api/auth/login` con seed | `{"token":...}` |
| `GET /api/lo-que-sea` | 404 JSON (no cae al SPA) |

## Troubleshooting

- **502.5 / 500.30** → Hosting Bundle no instalado, App Pool con managed code, o falta el runtime. Revisar Event Viewer.
- **404 en `/login`** → `wwwroot/index.html` ausente en `publish/` (no se copió el dist) o fallback roto.
- **Ver logs del proceso**: en `publish/web.config` poner `stdoutLogEnabled="true"` y revisar `logs/stdout_*.log`.
- **Msg 1934 al correr schema.sql** → hace falta `SET QUOTED_IDENTIFIER ON` (usar `sqlcmd -I`).
