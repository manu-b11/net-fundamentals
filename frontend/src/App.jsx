import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

import "./styles/global.css";
import "./styles/layout.css";
import "./styles/hero.css";
import "./styles/port-table.css";
import "./styles/tcp-udp.css";
import "./styles/protocols.css";
import "./styles/osi.css";
import "./styles/theme.css";
import "./styles/auth.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
