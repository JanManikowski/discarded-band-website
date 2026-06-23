import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { commonTitleStyle } from "../styles/constants";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, skip the login form entirely.
  React.useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || "/admin";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Login error:", err.code);
      // Keep the message generic so we don't reveal whether the
      // email exists in the system.
      setError("Incorrect email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundColor: "#0A060D",
        color: "white",
        minHeight: "100vh",
        padding: "120px 20px",
      }}
    >
      <h1 style={commonTitleStyle}>Admin Login</h1>

      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-3 shadow-lg w-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          maxWidth: "420px",
        }}
      >
        {error && (
          <div
            className="mb-3 p-2 text-center rounded-2"
            style={{ backgroundColor: "rgba(182, 28, 28, 0.25)", border: "1px solid #b61c1c", color: "#ff9b9b" }}
          >
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            autoComplete="username"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "0",
            }}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-100"
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            fontWeight: "bold",
            color: "#ff4d4d",
            padding: "15px 20px",
            textTransform: "uppercase",
            opacity: submitting ? 0.6 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;