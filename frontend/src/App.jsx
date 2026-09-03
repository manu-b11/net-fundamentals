import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { login, register } from "./api/auth";

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

  const handleLogin = async ({ username, password, remember }) => {
    const data = await login({ username, password });

    // Guardar sesión: localStorage si marcó "Recordarme", si no sessionStorage
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("token", data.token);
    storage.setItem("user", JSON.stringify(data.user));

    navigate("/");
  };

  const handleRegister = async ({ name, username, password }) => {
    await register({ fullName: name, username, password });
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
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
