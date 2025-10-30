import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import necLogo from "./nec-logo.png";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("teacher");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // ✅ Normal Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (role === "admin") {
        res = await axios.post("https://experential-learning.onrender.com/api/auth/admin/login", {
          email: username,
          password,
        });
      } else if (role === "teacher") {
        res = await axios.post("https://experential-learning.onrender.com/api/auth/teacher/login", {
          email: username,
          password,
        });
      } else if (role === "parent") {
        res = await axios.post("https://experential-learning.onrender.com/api/auth/parent/login", {
          email,
          password,
        });
      }

      alert(res.data.message);
      localStorage.setItem("token", res.data.token);

      // Store user data in localStorage
      if (role === "admin") {
        localStorage.setItem("admin", JSON.stringify(res.data.teacher));
        navigate("/admin-dashboard");
      } else if (role === "teacher") {
        localStorage.setItem("teacher", JSON.stringify(res.data.teacher));
        if (res.data.teacher?.year === "4") navigate("/teacher-dashboard-year4");
        else navigate("/teacher-dashboard");
      } else if (role === "parent") {
        localStorage.setItem("parent", JSON.stringify(res.data.parent));
        navigate("/parent-dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || `${role} login failed`);
    }
  };

  // ✅ Google OAuth Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const token = credentialResponse.credential;

      const res = await axios.post("https://experential-learning.onrender.com/api/auth/google/login", {
        token,
        role,
      });

      alert(res.data.message);
      localStorage.setItem("token", res.data.token);

      // Store user data in localStorage
      localStorage.setItem(role, JSON.stringify(res.data.user));

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "teacher") navigate("/teacher-dashboard");
      else navigate("/parent-dashboard");
    } catch (error) {
      console.error(error);
      alert("Google Sign-in failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo-section">
            <img src={necLogo} alt="NEC Logo" className="logo-image" />
            <h2 className="welcome-text">Welcome Back</h2>
            <p className="subtitle">Choose your portal to continue</p>
          </div>
          <div className="role-buttons">
            <button
              className={`role-btn ${role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              👨‍💼 Admin Portal
            </button>
            <button
              className={`role-btn ${role === "teacher" ? "active" : ""}`}
              onClick={() => setRole("teacher")}
            >
              👨‍🏫 Teacher Portal
            </button>
            <button
              className={`role-btn ${role === "parent" ? "active" : ""}`}
              onClick={() => setRole("parent")}
            >
              🎓Parent Portal
            </button>
          </div>
        </div>

        {/* Right Form */}
        <div className="form-section">
          <div className="form-header">
            <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
            <p>Enter your credentials to access your dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {(role === "admin" || role === "teacher") && (
              <>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {role === "parent" && (
              <>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="login-btn">
              Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Portal
            </button>
          </form>

          {/* ✅ Google OAuth Login Button */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Sign-in failed")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}