import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

function SignUpPage({ onSubmit, onGoToLogin }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !username || !password || !confirm) {
      setError("Completa todos los campos.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit?.({ name, username, password });
    } catch (err) {
      setError(err?.message || "No pudimos crear tu cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a usar la plataforma en un par de minutos."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="signup-name">Nombre completo</label>
          <input
            id="signup-name"
            type="text"
            placeholder="Ana Martínez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="signup-username">Usuario</label>
          <input
            id="signup-username"
            type="text"
            placeholder="tu.usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className={`auth-field ${error ? "auth-field-error" : ""}`}>
          <label htmlFor="signup-password">Contraseña</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className={`auth-field ${error ? "auth-field-error" : ""}`}>
          <label htmlFor="signup-confirm">Confirmar contraseña</label>
          <input
            id="signup-confirm"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          {error && <p className="auth-error">{error}</p>}
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default SignUpPage;
