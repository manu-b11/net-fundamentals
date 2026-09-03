# Frontend — NetFundamentals

Landing educativa de **fundamentos de redes** (modelo OSI, TCP vs UDP, protocolos y puertos) con páginas de **autenticación** conectadas al backend `login-api` (.NET 9).

## Stack

- **React 19** + **Vite** + **React Router 7**
- CSS plano por hoja de estilos (`src/styles/`)

## Estructura

```
frontend/
├── src/
│   ├── pages/             # LandingPage, LoginPage, SignUpPage
│   ├── components/
│   │   ├── landing/       # Hero, OsiModel, PorTable, Protocols, TcpUdp
│   │   └── layout/        # Navbar, AuthLayout
│   ├── api/auth.js        # Cliente HTTP del backend (login/register/me)
│   ├── App.jsx            # Rutas + handlers de login/registro
│   └── styles/
└── vite.config.js         # Proxy de desarrollo: /api → http://localhost:5100
```

## Autenticación (flujo integrado)

| Página | Ruta | Llamada al backend | En éxito |
|--------|------|--------------------|----------|
| Login | `/login` | `POST /api/auth/login` | Guarda `token` + `user` y va a `/` |
| SignUp | `/signup` | `POST /api/auth/register` | Va a `/login` |

- El token se guarda en **`localStorage`** si el usuario marcó "Recordarme"; si no, en `sessionStorage`.
- El backend devuelve los errores como `{ message }` y se muestran bajo el formulario (`auth-error`).
- Endpoints consumidos: `/api/auth/login`, `/api/auth/register`, `/api/auth/me` (ver `login-api/README.md`).

## Correr

**Requisito:** backend arriba en `http://localhost:5100` (ver `../login-api/README.md`).

```bash
npm install
npm run dev    # → http://localhost:5173
```

En desarrollo, Vite redirige las llamadas `/api/*` al backend (proxy en `vite.config.js`),
así que no hay CORS ni URLs hardcodeadas.

Otros scripts: `npm run build`, `npm run preview`, `npm run lint`.
