import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000";

function Login() {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      // -----------------------------
      // LOGIN API
      // -----------------------------

      const response = await fetch(
        `${API_URL}/user/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // -----------------------------
      // READ RESPONSE
      // -----------------------------

      const contentType =
        response.headers.get("content-type") || "";

      const data =
        contentType.includes("application/json")
          ? await response.json()
          : {};

      // -----------------------------
      // ERROR
      // -----------------------------

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // -----------------------------
      // GET USER
      // -----------------------------

      const loggedUser =
        data.user ||
        data.data?.user ||
        data.data ||
        data;

      // -----------------------------
      // GET JWT TOKEN
      // -----------------------------

      const jwtToken =
        data.token ||
        data.data?.token;

      if (!jwtToken) {
        throw new Error(
          "Login successful, but token was not received."
        );
      }

      // -----------------------------
      // SAVE USER + TOKEN
      // -----------------------------

      loginUser(
        loggedUser,
        jwtToken
      );

      // -----------------------------
      // GO HOME
      // -----------------------------

      navigate("/");

    } catch (error) {
      setError(
        error.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <span className="auth-label">
          WELCOME BACK
        </span>

        <h1>Login</h1>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter email"
          />

          {/* PASSWORD */}

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Enter password"
          />

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* REGISTER LINK */}

        <p className="auth-bottom">
          Don't have an account?{" "}

          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;