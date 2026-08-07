import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { socket } from "../socket";
import axios from "axios";

const TicketDetails = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTicket();

    socket.emit("join_ticket", id);

    socket.on("comment_added", (data) => {
      if (data.ticketId === id) {
        setTicket((prev) => ({ ...prev, comments: data.comments }));
      }
    });

    socket.on("ticket_updated", (updateTicket) => {
      if (updateTicket._id === id) {
        setTicket(updateTicket);
      }
    });

    return () => {
      socket.emit("leave_ticket", id);
      socket.off("comment_added");
      socket.off("ticket_updated");
    };
  }, [id]);

  const fetchTicket = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await axios.get(`${API_URL}/api/tickets/${id}`);
      setTicket(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.put(`${API_URL}/api/tickets/${id}`, { status: newStatus });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.post(`${API_URL}/api/tickets/${id}/comments`, {
        message: commentText,
      });

      setCommentText("");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading Ticket...</p>;
  if (!ticket) return <p style={{ padding: "20px" }}>Ticket not Found .</p>;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="ticket-detail-shell">
      <Link to="/dashboard" className="btn btn-ghost" style={{ marginBottom: "15px" }}>
        &larr; Back to Dashboard
      </Link>
      {/* 1. Ticket Header Data */}
      <div className="card" style={{ padding: "20px" }}>
        <h2>{ticket.title}</h2>
        <p>
          <strong>Status:</strong> <span className="badge">{ticket.status}</span>{" "}
          | <strong>Priority:</strong> {ticket.priority}
        </p>
        <p
          style={{
            background: "var(--surface-muted)",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          {ticket.description}
        </p>

        {/* 2. Render Multer Attachments */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <h4>Attachments:</h4>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {ticket.attachments.map((imgUrl, idx) => (
                <a
                  key={idx}
                  href={`${API_URL}${imgUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={`${API_URL}${imgUrl}`}
                    alt="Attachment"
                    className="attachment-thumb"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        {/* 3. Agent Controls (Only visible to Agents) */}
        {user?.role === "agent" && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "var(--surface-muted)",
              borderRadius: "5px",
            }}
          >
            <strong>Agent Controls:</strong> Update Status:{" "}
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="form-control"
              style={{ display: "inline-block", width: "auto" }}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        )}
      </div>
      {/* 4. Socket.io Live Chat System */}
      <div style={{ marginTop: "20px" }}>
        <h3>Discussion Thread</h3>
        <div className="discussion-thread card">
          {ticket.comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            ticket.comments.map((c, i) => (
              <div
                key={i}
                className={`comment-bubble ${c.user === user?._id ? "mine" : "theirs"}`}
              >
                <strong>
                  {c.senderName} ({c.senderRole})
                </strong>
                <p style={{ margin: "5px 0" }}>{c.message}</p>
              </div>
            ))
          )}
        </div>
        <form
          onSubmit={handleAddComment}
          style={{ display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type a message..."
            className="form-control"
          />
          <button type="submit" className="btn btn-info">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;
