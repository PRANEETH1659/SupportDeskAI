import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

  if (loading) return <p style={{ padding: "20px" }}> Loading TIckets....</p>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Dashboard ({user?.role})</h2>
        <div>
          {/* Only customers should see the Raise Ticket button */}
          {user?.role === "customer" && (
            <Link
              to="/create-ticket"
              className="btn btn-success"
              style={{ marginRight: "10px" }}
            >
              + Raise Ticket
            </Link>
          )}
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
      <div className="ticket-list">
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket._id} className="card ticket-row">
              <div>
                <h3>
                  <Link to={`/ticket/${ticket._id}`}>{ticket.title}</Link>
                </h3>
                <p className="ticket-meta">
                  Priority: <strong>{ticket.priority}</strong> | Status:{" "}
                  <span className="badge">{ticket.status}</span>
                </p>
                {user?.role === "agent" && (
                  <p className="ticket-meta">
                    Customer: {ticket.customer?.name}
                  </p>
                )}
              </div>
              <Link to={`/ticket/${ticket._id}`} className="btn btn-info">
                View
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
