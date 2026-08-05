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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Dashboard ({user?.role})</h2>
        <div>
          {/* Only customers should see the Raise Ticket button */}
          {user?.role === "customer" && (
            <Link
              to="/create-ticket"
              style={{
                marginRight: "15px",
                padding: "8px 16px",
                background: "#4CAF50",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              + Raise Ticket
            </Link>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gap: "15px" }}>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              style={{
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 10px 0" }}>
                  <Link
                    to={`/ticket/${ticket._id}`}
                    style={{ textDecoration: "none", color: "#333" }}
                  >
                    {ticket.title}
                  </Link>
                </h3>
                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                  Priority: <strong>{ticket.priority}</strong> | Status:{" "}
                  <strong>{ticket.status}</strong>
                </p>
                {user?.role === "agent" && (
                  <p
                    style={{
                      margin: "5px 0 0 0",
                      fontSize: "13px",
                      color: "#888",
                    }}
                  >
                    Customer: {ticket.customer?.name}
                  </p>
                )}
              </div>
              <Link
                to={`/ticket/${ticket._id}`}
                style={{
                  padding: "8px 16px",
                  background: "#2196F3",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
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
