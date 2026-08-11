import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, LogOut, Eye, Loader2, Inbox, User } from "lucide-react";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchTickets();
  }, [user, navigate]);

  const fetchTickets = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.get(`${API_URL}/api/tickets`);
      setTickets(response.data.tickets);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching tickets:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading)
    return (
      <p style={{ padding: "20px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Loader2 size={18} className="spin" /> Loading tickets...
      </p>
    );

  return (
    <div>
      <div className="dashboard-header">
        <h2>Dashboard ({user?.role})</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Only customers should see the Raise Ticket button */}
          {user?.role === "customer" && (
            <Link to="/create-ticket" className="btn btn-success">
              <Plus size={16} /> Raise Ticket
            </Link>
          )}
          <button onClick={handleLogout} className="btn btn-danger">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
      <div className="ticket-list">
        {tickets.length === 0 ? (
          <div className="card empty-state">
            <Inbox size={32} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
            <p>No tickets found.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket._id} className="card ticket-row">
              <div>
                <h3>
                  <Link to={`/ticket/${ticket._id}`}>{ticket.title}</Link>
                </h3>
                <p className="ticket-meta">
                  <span className={`badge priority-${ticket.priority.toLowerCase()}`}>
                    <span className="badge-dot" /> {ticket.priority}
                  </span>
                  <span className={`badge status-${ticket.status.toLowerCase()}`}>
                    <span className="badge-dot" /> {ticket.status.replace("_", " ")}
                  </span>
                </p>
                {user?.role === "agent" && (
                  <p className="ticket-meta">
                    <User size={13} /> {ticket.customer?.name}
                  </p>
                )}
              </div>
              <Link to={`/ticket/${ticket._id}`} className="btn btn-info">
                <Eye size={16} /> View
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
