// Cliente HTTP para el backend LoginApi (.NET)
// En dev las llamadas van por el proxy de Vite (ver vite.config.js)

const BASE = "/api/auth";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // respuesta sin cuerpo JSON
  }

  if (!res.ok) {
    const message =
      data?.message || data?.title || `Error del servidor (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export function login({ username, password }) {
  return request("/login", { method: "POST", body: { username, password } });
}

export function register({ fullName, username, password }) {
  return request("/register", {
    method: "POST",
    body: { fullName, username, password },
  });
}

export function me(token) {
  return request("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
