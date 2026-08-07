import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      login(response.data, response.data.token);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed . Please Try Again...",
      );
    }
  };

  return (
    <div className="auth-shell card">
      <h2>Login</h2>

      {error && <p className="form-error">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="input-group-btn"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-info btn-block">
          Login
        </button>
      </form>

      <p style={{ margin: "15px 0 0", textAlign: "center" }}>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
