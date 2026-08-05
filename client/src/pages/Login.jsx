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
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Login</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <div style={{ display: "flex" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                padding: "0 10px",
                background: "#eee",
                border: "1px solid #ccc",
                borderLeft: "none",
                cursor: "pointer",
                borderRadius: "0 4px 4px 0",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>

      <p style={{ margin: "15px", textAlign: "center" }}>
        Don't have an account <Link to="/register">Sign up Here ..</Link>
      </p>
    </div>
  );
};

export default Login;
