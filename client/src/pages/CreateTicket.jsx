import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const CreateTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("MEDIUM");
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user?.role !== "customer") {
    return <p>Only Customers can Raise Tickets</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("priority", priority);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("attachments", files[i]);
      }
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.post(`${API_URL}/api/tickets`, formData);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert(error.response?.data?.message || "Failed to create Ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Raise a New Ticket</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
        <div>
          <label>Title</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>Category</label>
          <br />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Account">Account</option>
            <option value="General">General</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <br />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div>
          <label>Description</label>
          <br />
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          ></textarea>
        </div>
        <div>
          <label>Attachments (Screenshots - Max 3)</label>
          <br />
          {/* File input handling */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;
