import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { AuthProvider, useAuth } from "./auth/AuthContext";

import "./styles/global.css";
import "./styles/layout.css";
import "./styles/hero.css";
import "./styles/port-table.css";
import "./styles/tcp-udp.css";
import "./styles/protocols.css";
import "./styles/osi.css";
import "./styles/theme.css";
import "./styles/auth.css";

function AppRoutes() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleLogin = async (creds) => {
    await login(creds); // guarda la sesión y actualiza el estado global
    navigate("/");
  };

  const handleRegister = async ({ name, username, password }) => {
    await register({ name, username, password });
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onSubmit={handleLogin} />} />
      <Route path="/signup" element={<SignUpPage onSubmit={handleRegister} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
