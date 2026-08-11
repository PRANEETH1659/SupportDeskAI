import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Headset } from "lucide-react";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import AiChatWidget from "./components/AiChatWidget";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <Headset size={22} />
            <h2>SupportDesk AI</h2>
          </div>
        </nav>

        {/* AI assistant is a customer-facing feature only */}
        {user?.role === "customer" && <AiChatWidget />}

        <main className="page-content">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/ticket/:id" element={<TicketDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
