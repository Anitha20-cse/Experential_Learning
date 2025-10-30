import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Trophy,
  Activity,
  Medal,
  BarChart3,
  Megaphone,
  FileText,
  School,
  Menu,
  X,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";
import axios from "axios";

export default function TeacherDashboardYear4() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [teacherName, setTeacherName] = useState("");

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    if (teacherData) {
      setTeacherName(teacherData.name);
      // Fetch full teacher profile
      fetchTeacherProfile(teacherData.email);
    }
  }, []);

  const fetchTeacherProfile = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/teachers/profile/${email}`);
      setTeacherProfile(res.data);
    } catch (err) {
      console.error("Error fetching teacher profile:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    navigate("/");
  };

  const sections = [
    {
      title: "Timetable",
      icon: <CalendarDays size={40} />,
      desc: "View and update class timetables",
      path: "/admin/timetable",
    },
    {
      title: "Top 3 Ranks",
      icon: <Trophy size={40} />,
      desc: "Highlight top academic performers",
      path: "/admin/top-ranks",
    },
    {
      title: "Student Activities",
      icon: <Activity size={40} />,
      desc: "Track and share activities",
      path: "/admin/activities",
    },
    {
      title: "SkillRack Medals",
      icon: <Medal size={40} />,
      desc: "Update coding medal counts",
      path: "/admin/skillrack",
    },
    {
      title: "Attendance",
      icon: <BarChart3 size={40} />,
      desc: "Upload daily attendance reports",
      path: "/admin/attendance",
    },
    {
      title: "Announcements",
      icon: <Megaphone size={40} />,
      desc: "Send messages to parents",
      path: "/admin/announcements",
    },
    {
      title: "Exam Schedule",
      icon: <FileText size={40} />,
      desc: "View and upload exam schedules",
      path: "/admin/exam-schedule",
    },
    {
      title: "Drive Details",
      icon: <School size={40} />,
      desc: "Add and manage drive details",
      path: "/admin/drives",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Welcome Message */}
      <h1 className="dashboard-title">
        Welcome {teacherName || "Teacher"}
      </h1>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h2>Teacher Profile</h2>
              <button
                className="sidebar-close"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {teacherProfile && (
              <div className="profile-section">
                <div className="profile-photo">
                  {teacherProfile.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/${teacherProfile.photo}`}
                      alt="Profile"
                    />
                  ) : (
                    <User size={60} />
                  )}
                </div>
                <div className="profile-info">
                  <p><strong>Name:</strong> {teacherProfile.name}</p>
                  <p><strong>Email:</strong> {teacherProfile.email}</p>
                  <p><strong>Specialisation:</strong> {teacherProfile.specialisation}</p>
                  <p><strong>Year:</strong> {teacherProfile.year}</p>
                </div>
              </div>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {sections.map((s, i) => (
          <div
            key={i}
            className="dashboard-card"
            onClick={() => navigate(s.path)}
          >
            <div className="dashboard-icon">{s.icon}</div>
            <h2>{s.title}</h2>
            <p>{s.desc}</p>
            <button className="dashboard-btn">Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}
