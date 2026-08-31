import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

function LoginPage({ onSubmit }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Completa usuario y contraseña.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit?.({ username, password, remember });
    } catch (err) {
      setError(
        err?.message || "No pudimos iniciar tu sesión. Intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Accede para continuar donde lo dejaste."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/signup")}
          >
            Crear cuenta
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className={`auth-field ${error ? "auth-field-error" : ""}`}>
          <label htmlFor="login-username">Usuario</label>
          <input
            id="login-username"
            type="text"
            placeholder="tu.usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className={`auth-field ${error ? "auth-field-error" : ""}`}>
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="auth-error">{error}</p>}
        </div>

        <div className="auth-row">
          <label className="auth-check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Recordarme
          </label>
          <button type="button" className="auth-link">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
