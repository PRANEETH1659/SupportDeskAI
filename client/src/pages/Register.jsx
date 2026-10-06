import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserPlus, Eye, EyeOff, Headset } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      //THis is backedn register endpoint
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });

      login(response.data, response.data.token);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed.Please try again.",
      );
    }
  };

  return (
    <div className="auth-shell card">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
        <Headset size={32} color="var(--brand)" />
      </div>
      <h2 style={{ textAlign: "center" }}>Register for SupportDesk</h2>
      {error && <p className="form-error">{error}</p>}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="input-group-btn"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-control"
          >
            <option value="customer">Customer</option>
            <option value="agent">Support Agent</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success btn-block">
          <UserPlus size={16} /> Register
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
