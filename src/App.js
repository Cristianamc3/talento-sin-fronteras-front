import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProjectForm from "./pages/ProjectForm";
import LanguageSwitcher from "./components/LanguageSwitcher";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <LanguageSwitcher />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/project-form" element={<ProjectForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

