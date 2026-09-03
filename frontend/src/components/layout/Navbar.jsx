import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

function Navbar() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName =
    session?.user?.fullName || session?.user?.username || "Usuario";

  return (
    <header>
      <nav>
        <div className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <circle cx="18" cy="18" r="16" fill="#17303A" />
              <path
                d="M9 23.5h5.5V12.5H9m12.5 0h5.5v11h-5.5M14.5 18h7"
                stroke="#4FD1A5"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="18" r="2.2" fill="#FF7A50" />
              <circle cx="24" cy="18" r="2.2" fill="#4FD1A5" />
            </svg>
          </span>
          NetFundamentals
        </div>
        <div className="nav-links">
          <a href="#puertos">Puertos</a>
          <a href="#protocolos">Protocolos</a>
          <a href="#osi">Modelo OSI</a>
        </div>
        <div className="nav-auth">
          {session ? (
            <>
              <span className="nav-user" title={session.user.email || ""}>
                👤 {displayName}
              </span>
              <button
                type="button"
                className="nav-btn"
                onClick={handleLogout}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">
                Iniciar sesión
              </Link>
              <Link to="/signup" className="nav-btn nav-btn-primary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
