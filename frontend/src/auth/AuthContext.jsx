import { createContext, useContext, useState } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";

const AuthContext = createContext(null);

function readSession() {
  // El token se guardó en localStorage (Recordarme) o sessionStorage
  for (const storage of [localStorage, sessionStorage]) {
    const token = storage.getItem("token");
    const user = storage.getItem("user");
    if (token && user) {
      try {
        return { token, user: JSON.parse(user) };
      } catch {
        // JSON corrupto: se ignora y se trata como sin sesión
      }
    }
  }
  return null;
}

function clearStoredSession() {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem("token");
    storage.removeItem("user");
  });
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = async ({ username, password, remember }) => {
    const data = await apiLogin({ username, password });
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("token", data.token);
    storage.setItem("user", JSON.stringify(data.user));
    setSession({ token: data.token, user: data.user });
    return data;
  };

  const register = ({ name, username, password }) =>
    apiRegister({ fullName: name, username, password });

  const logout = () => {
    clearStoredSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
