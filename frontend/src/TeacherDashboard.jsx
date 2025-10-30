import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Trophy,
  Activity,
  Medal,
  BarChart3,
  Megaphone,
  FileText,
  Menu,
  X,
  LogOut,
  User,
  BookOpen,
  Bell,
  Settings,
  ChevronRight,
  Users,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherDashBoard.css";
export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    if (teacherData) {
      setTeacherName(teacherData.name);
      setTeacherProfile({
        name: teacherData.name,
        email: teacherData.email,
        specialization: teacherData.specialization || "Computer Science",
        year: teacherData.year || "3",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    localStorage.removeItem("admin");
    localStorage.removeItem("parent");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const sections = [
    {
      title: "Timetable",
      icon: CalendarDays,
      desc: "View and update class timetables",
      path: "/admin/timetable",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Top 3 Ranks",
      icon: Trophy,
      desc: "Highlight top academic performers",
      path: "/admin/top-ranks",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Student Activities",
      icon: Activity,
      desc: "Track and share activities",
      path: "/admin/activities",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "SkillRack Medals",
      icon: Medal,
      desc: "Update coding medal counts",
      path: "/admin/skillrack",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      title: "Attendance",
      icon: BarChart3,
      desc: "Upload monthly and consolidated attendance reports",
      path: "/admin/attendance",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      title: "Announcements",
      icon: Megaphone,
      desc: "Send messages to parents",
      path: "/admin/announcements",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
    {
      title: "Exam Schedule",
      icon: FileText,
      desc: "View and upload exam schedules",
      path: "/admin/exam-schedule",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
      title: "View Your Students",
      icon: Users,
      desc: "View students assigned to you",
      path: "/teacher/students",
      gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    },
    {
      title: "CBCS System",
      icon: BookOpen,
      desc: "Manage CBCS curriculum and assessments",
      path: "/teacher/cbcs",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
    {
      title: "Leave Requests",
      icon: ClipboardList,
      desc: "Review and manage student leave requests",
      path: "/teacher/leave-requests",
      gradient: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    },
    {
      title: "Scholarship",
      icon: FileText,
      desc: "Manage scholarship information",
      path: "/teacher/scholarship",
    },
  ];

  const stats = [
    { label: "Total Students", value: "20", icon: User, color: "#667eea" },
    
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", fontFamily: "'Poppins', sans-serif" }}>
      {/* Top Navigation */}
      <nav style={{
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 40,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Menu size={24} color="#475569" />
            </button>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
                Teacher Portal
              </h1>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                National Engineering College
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              position: "relative"
            }}>
              <Bell size={20} color="#64748b" />
              <span style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "8px",
                height: "8px",
                background: "#ef4444",
                borderRadius: "50%"
              }}></span>
            </button>
            <button style={{
              padding: "8px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              cursor: "pointer"
            }}>
              <Settings size={20} color="#64748b" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1e293b", marginBottom: "8px" }}>
            Welcome back, {teacherName || "Teacher"}! 👋
          </h2>
          <p style={{ color: "#64748b", margin: 0 }}>Here's what's happening with your classes today.</p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
          marginBottom: "32px"
        }}>
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{
                    background: stat.color,
                    padding: "12px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <IconComponent size={20} color="white" />
                  </div>
                  <span style={{ fontSize: "28px", fontWeight: "bold", color: "#1e293b" }}>
                    {stat.value}
                  </span>
                </div>
                <p style={{ fontSize: "14px", color: "#64748b", fontWeight: "500", margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dashboard Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {sections.map((section, idx) => {
            const IconComponent = section.icon;
            return (
              <div
                key={idx}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: hoveredCard === idx ? "0 20px 40px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  transform: hoveredCard === idx ? "translateY(-8px)" : "translateY(0)"
                }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(section.path)}
              >
                <div style={{ height: "8px", background: section.gradient }}></div>
                <div style={{ padding: "24px" }}>
                  <div style={{
                    display: "inline-flex",
                    padding: "12px",
                    borderRadius: "12px",
                    background: section.gradient,
                    marginBottom: "16px"
                  }}>
                    <IconComponent size={24} color="white" />
                  </div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "8px",
                    margin: "0 0 8px 0"
                  }}>
                    {section.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px", margin: "0 0 16px 0" }}>
                    {section.desc}
                  </p>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#3b82f6",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}>
                    <span>Open</span>
                    <ChevronRight size={16} style={{ marginLeft: "4px" }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 50,
            animation: "fadeIn 0.2s"
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              height: "100%",
              width: "320px",
              background: "white",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              animation: "slideIn 0.3s"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Header */}
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "24px",
              color: "white"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>Teacher Profile</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    padding: "4px",
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <X size={24} color="white" />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "64px",
                  height: "64px",
                  background: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {teacherProfile?.photo ? (
                    <img
                      src={`https://experential-learning.onrender.com/uploads/${teacherProfile.photo}`}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <User size={32} color="#667eea" />
                  )}
                </div>
                <div>
                  <h3 style={{ fontWeight: "600", fontSize: "18px", margin: 0 }}>
                    {teacherProfile?.name || "Teacher"}
                  </h3>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {teacherProfile?.specialization || "Computer Science"}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div style={{ padding: "24px", paddingBottom: "100px", overflowY: "auto", height: "calc(100% - 200px)" }}>
              <div style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "24px"
              }}>
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", marginBottom: "4px", margin: "0 0 4px 0" }}>
                    Email Address
                  </p>
                  <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                    {teacherProfile?.email || "N/A"}
                  </p>
                </div>
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", marginBottom: "12px" }}>
                  <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", marginBottom: "4px", margin: "0 0 4px 0" }}>
                    Specialization
                  </p>
                  <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                    {teacherProfile?.specialization || "Computer Science"}
                  </p>
                </div>
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
                  <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", marginBottom: "4px", margin: "0 0 4px 0" }}>
                    Year
                  </p>
                  <p style={{ fontSize: "14px", color: "#1e293b", margin: 0 }}>
                    {teacherProfile?.year || "3"}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Quick Links
                </h3>
                {sections.map((section, idx) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        navigate(section.path);
                        setSidebarOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        textAlign: "left"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <IconComponent size={20} color="#64748b" />
                      <span style={{ fontSize: "14px", color: "#1e293b", fontWeight: "500" }}>
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "16px 24px",
              background: "white",
              borderTop: "1px solid #e2e8f0",
              boxShadow: "0 -4px 6px rgba(0,0,0,0.05)"
            }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}