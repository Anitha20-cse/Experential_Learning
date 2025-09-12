import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import necLogo from "./nec-logo.png";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState(""); // admin/teacher username
  const [password, setPassword] = useState(""); // admin/teacher password
  const [regNo, setRegNo] = useState(""); // student regNo
  const [dob, setDob] = useState("");     // student DOB

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === "admin") {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/admin/login", {
          email: username,
          password:password
        });
        console.log("Request Sent");
        console.log(res);
        alert(res.data.message);
        navigate("/admin-dashboard");
      } catch (err) {
        alert(err.response?.data?.message || "Admin login failed");
      }
    } else if (role === "teacher") {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/teacher/login", {
          email: username,
          password:password
        });
        console.log("Request Sent");
        console.log(res);
        alert(res.data.message);
        navigate("/teacher-dashboard");
      } catch (err) {
        alert(err.response?.data?.message || "Teacher login failed");
      }
    } else if (role === "student") {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/student/register", {
          regNo,
          dob,
        });
        alert(res.data.message);
        navigate("/teacher-dashboard");
      } catch (err) {
        alert(err.response?.data?.message || "Student registration failed");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="logo-section">
            <div className="logo-placeholder">
              <img src={necLogo} alt="NEC Logo" className="logo-image" />
            </div>
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
              className={`role-btn ${role === "student" ? "active" : ""}`}
              onClick={() => setRole("student")}
            >
              👨‍🎓 Student Portal
            </button>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="form-section">
          <div className="form-header">
            <h2 className="form-title">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
            <p className="form-subtitle">Enter your credentials to access your dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {(role === "admin" || role === "teacher") && (
              <>
                <div className="input-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Enter your username"
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

            {role === "student" && (
              <>
                <div className="input-group">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    placeholder="Enter your registration number"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="login-btn">
              Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
