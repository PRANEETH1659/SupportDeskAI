import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav
          style={{
            padding: "1rem",
            background: "#333",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2>SupportDesk AI</h2>
        </nav>

        <main style={{ padding: "2rem" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-ticket" element={<CreateTicket />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
