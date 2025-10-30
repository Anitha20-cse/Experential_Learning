import React, { useState, useEffect } from "react";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsersCog,
  FaBullhorn,
  FaSchool,
  FaUserCheck,
  FaBell,
  FaSignOutAlt,
  FaChartLine,
  FaCalendarAlt,
  FaCog,
  FaTrophy,
  FaBookOpen,
  FaClipboardList,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  
  FaExclamationCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [activeCard, setActiveCard] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock admin data
  const [adminData] = useState({
    name: "Dr.D.Venkatkumar",
    email: "venkat.123@gmail.com",
    id: "ADM-2024-001",
    phone: "9385473990",
    role: "System Administrator",
    department: "Administration",
    joinDate: "Jan 2020",
    lastLogin: "Today, 9:30 AM",
  });

  const [stats] = useState({
    totalStudents: 93,
    totalTeachers: 9,
    activeClasses: 12,
    pendingApprovals: 5,
    studentGrowth: "+12%",
    teacherGrowth: "+5%",
    classGrowth: "+8%",
    approvalGrowth: "-15%",
  });

  const [recentActivities] = useState([
    { id: 1, action: "New student enrolled", time: "5 mins ago", type: "success" },
    { id: 2, action: "Teacher assignment updated", time: "15 mins ago", type: "info" },
    { id: 3, action: "Circular published", time: "1 hour ago", type: "warning" },
    { id: 4, action: "Achievement added", time: "2 hours ago", type: "success" },
  ]);

  

  const adminItems = [
    {
      title: "Add Teachers",
      icon: <FaChalkboardTeacher />,
      color: "blue",
      path: "/admin/add-teachers",
      description: "Register and manage teaching staff",
    },
    {
      title: "Add Students",
      icon: <FaUserGraduate />,
      color: "green",
      path: "/admin/add-students",
      description: "Enroll new students to the system",
    },
    {
      title: "Assign Students",
      icon: <FaUserCheck />,
      color: "red",
      path: "/admin/assign-students",
      description: "Allocate students to classes",
    },
    {
      title: "Achievements",
      icon: <FaTrophy />,
      color: "purple",
      path: "/admin/achievements",
      description: "Track and celebrate milestones",
    },
    {
      title: "Circular",
      icon: <FaBullhorn />,
      color: "orange",
      path: "/admin/circulars",
      description: "Publish important announcements",
    },
    {
      title: "Drive Details",
      icon: <FaSchool />,
      color: "teal",
      path: "/admin/drives",
      description: "Manage placement drives",
    },
  ];

  const handleCardClick = (path, index) => {
    setActiveCard(index);
    setTimeout(() => {
      if (path) navigate(path);
    }, 200);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("admin");
    localStorage.removeItem("teacher");
    localStorage.removeItem("parent");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="admin-dashboard-container">
      {/* Animated Background */}
      <div className="admin-background-animation">
        <div className="admin-bg-circle admin-bg-circle-1"></div>
        <div className="admin-bg-circle admin-bg-circle-2"></div>
        <div className="admin-bg-circle admin-bg-circle-3"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="admin-top-bar">
        <div className="admin-logo">
          <div className="admin-logo-icon-wrapper">
            <FaSchool className="admin-logo-icon" />
          </div>
          <div className="admin-logo-content">
            <span className="admin-logo-text">NEC Admin Portal</span>
            <span className="admin-logo-subtitle">Management System</span>
          </div>
        </div>
        
        <div className="admin-time-display">
          <div className="admin-date">{formatDate(currentTime)}</div>
          <div className="admin-time">{formatTime(currentTime)}</div>
        </div>

        <div className="admin-top-bar-right">
          <button className="admin-icon-button" title="Notifications">
            <FaBell />
            {notifications > 0 && (
              <span className="admin-notification-badge">{notifications}</span>
            )}
          </button>
          <button className="admin-icon-button" title="Settings">
            <FaCog />
          </button>
          <button className="admin-logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="admin-logout-icon" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Welcome Banner */}
        <div className="admin-welcome-banner">
          <div className="admin-welcome-content">
            <h1 className="admin-welcome-title">Welcome back,Venkatkumar {adminData.name.split('.')[1]}! 👋</h1>

          </div>
          <div className="admin-welcome-decoration">
            <div className="admin-floating-icon admin-float-1">📚</div>
            <div className="admin-floating-icon admin-float-2">🎓</div>
            <div className="admin-floating-icon admin-float-3">✨</div>
          </div>
        </div>

        <div className="admin-dashboard-grid">
          {/* Left Column */}
          <div className="admin-left-column">
            {/* Admin Profile Card */}
            <div className="admin-profile-card">
              <div className="admin-profile-header">
                <div className="admin-profile-avatar">
                  <img src="/venkat sir.png" alt="Admin Photo" />
                  <div className="admin-status-indicator"></div>
                </div>
                <div className="admin-profile-badge">ADMIN</div>
              </div>
              <div className="admin-profile-info">
                <h2 className="admin-profile-name">{adminData.name}</h2>
                <p className="admin-profile-role">{adminData.role}</p>
                <div className="admin-profile-details">
                  <div className="admin-profile-detail-item">
                    <span className="admin-detail-label">ID</span>
                    <span className="admin-detail-value">{adminData.id}</span>
                  </div>
                  <div className="admin-profile-detail-item">
                    <span className="admin-detail-label">Email</span>
                    <span className="admin-detail-value">{adminData.email}</span>
                  </div>
                  <div className="admin-profile-detail-item">
                    <span className="admin-detail-label">Phone</span>
                    <span className="admin-detail-value">{adminData.phone}</span>
                  </div>
                  <div className="admin-profile-detail-item">
                    <span className="admin-detail-label">Department</span>
                    <span className="admin-detail-value">{adminData.department}</span>
                  </div>
                  <div className="admin-profile-detail-item">
                    <span className="admin-detail-label">Joined</span>
                    <span className="admin-detail-value">{adminData.joinDate}</span>
                  </div>
                  <div className="admin-profile-detail-item">
                    <span className="admin-detail-label">Last Login</span>
                    <span className="admin-detail-value">{adminData.lastLogin}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card admin-stat-primary">
                <div className="admin-stat-header">
                  <FaUserGraduate className="admin-stat-icon color-green" />
                  <span className={`admin-stat-trend trend-up`}>
                    <FaArrowUp /> {stats.studentGrowth}
                  </span>
                </div>
                <div className="admin-stat-info">
                  <p className="admin-stat-value">{stats.totalStudents}</p>
                  <p className="admin-stat-label">Total Students</p>
                </div>
                <div className="admin-stat-progress">
                  <div className="admin-progress-bar" style={{width: '75%', background: '#22c55e'}}></div>
                </div>
              </div>

              <div className="admin-stat-card admin-stat-primary">
                <div className="admin-stat-header">
                  <FaChalkboardTeacher className="admin-stat-icon color-blue" />
                  <span className={`admin-stat-trend trend-up`}>
                    <FaArrowUp /> {stats.teacherGrowth}
                  </span>
                </div>
                <div className="admin-stat-info">
                  <p className="admin-stat-value">{stats.totalTeachers}</p>
                  <p className="admin-stat-label">Total Teachers</p>
                </div>
                <div className="admin-stat-progress">
                  <div className="admin-progress-bar" style={{width: '60%', background: '#4e7dff'}}></div>
                </div>
              </div>

              <div className="admin-stat-card admin-stat-primary">
                <div className="admin-stat-header">
                  <FaBookOpen className="admin-stat-icon color-purple" />
                  <span className={`admin-stat-trend trend-up`}>
                    <FaArrowUp /> {stats.classGrowth}
                  </span>
                </div>
                <div className="admin-stat-info">
                  <p className="admin-stat-value">{stats.activeClasses}</p>
                  <p className="admin-stat-label">Active Classes</p>
                </div>
                <div className="admin-stat-progress">
                  <div className="admin-progress-bar" style={{width: '85%', background: '#a855f7'}}></div>
                </div>
              </div>

              <div className="admin-stat-card admin-stat-primary">
                <div className="admin-stat-header">
                  <FaExclamationCircle className="admin-stat-icon color-orange" />
                  <span className={`admin-stat-trend trend-down`}>
                    <FaArrowDown /> {stats.approvalGrowth}
                  </span>
                </div>
                <div className="admin-stat-info">
                  <p className="admin-stat-value">{stats.pendingApprovals}</p>
                  <p className="admin-stat-label">Pending Approvals</p>
                </div>
                <div className="admin-stat-progress">
                  <div className="admin-progress-bar" style={{width: '30%', background: '#f59e0b'}}></div>
                </div>
              </div>
            </div>

            
          </div>

          {/* Right Column */}
          <div className="admin-right-column">
            {/* Management Section */}
            <div className="admin-management-section">
              <div className="admin-section-header">
                <h2 className="admin-section-title">
                  <span className="admin-title-icon">🎯</span>
                  Management Portal
                </h2>
                <p className="admin-section-subtitle">Quick access to all administrative functions</p>
              </div>
              <div className="admin-cards-grid">
                {adminItems.map((item, index) => (
                  <div
                    key={index}
                    className={`admin-management-card border-${item.color} ${activeCard === index ? 'admin-card-active' : ''}`}
                    onClick={() => handleCardClick(item.path, index)}
                  >
                    <div className="admin-card-glow"></div>
                    <div className={`admin-card-icon-wrapper color-${item.color}`}>
                      <div className="admin-card-icon">{item.icon}</div>
                    </div>
                    <div className="admin-card-content">
                      <h3 className="admin-card-title">{item.title}</h3>
                      <p className="admin-card-description">{item.description}</p>
                    </div>
                    <div className="admin-card-arrow">→</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="admin-activities-section">
              <div className="admin-section-header">
                <h3 className="admin-activities-title">
                  <FaClock className="admin-activity-icon" />
                  Recent Activities
                </h3>
              </div>
              <div className="admin-activities-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={`admin-activity-item activity-${activity.type}`}>
                    <div className="admin-activity-indicator"></div>
                    <div className="admin-activity-content">
                      <p className="admin-activity-action">{activity.action}</p>
                      <p className="admin-activity-time">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;