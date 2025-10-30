import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Trophy,
  Award,
  Activity,
  Medal,
  BarChart3,
  Megaphone,
  FileText,
  Menu,
  X,
  LogOut,
  User,
  Users,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ParentDashboard.css";

import { useTranslation } from "react-i18next";
import logo from "./national-logo.png";
import axios from "axios";
import i18n from "./i18n";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [parentProfile, setParentProfile] = useState(null);
  const [parentName, setParentName] = useState("");
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (parentData) {
      setParentName(parentData.name);
      setParentProfile({
        name: parentData.name,
        email: parentData.email,
      });

      // Fetch student profiles including assigned teachers
      axios
        .get(`http://localhost:5000/api/assigned-students/parent/profile?parentEmail=${parentData.email}`)
        .then((response) => {
          setStudentProfiles(response.data);
        })
        .catch((error) => {
          console.error("Error fetching student profiles:", error);
          setStudentProfiles([]);
        });
         // Fetch latest 3 announcements
      const headers = {
        'x-user-role': 'parent',
        'x-user-email': parentData.email,
      };
      axios
        .get("http://localhost:5000/api/announcements", { headers })
        .then((response) => {
          setAnnouncements(response.data.slice(0, 3)); // Get top 3
        })
        .catch((error) => {
          console.error("Error fetching announcements:", error);
          setAnnouncements([]);
        });
    }
  }, []);

  // Remove the cycling effect since we're using scrolling animation

  const handleLogout = () => {
    localStorage.removeItem("parent");
    localStorage.removeItem("teacher");
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate("/login");
  };
    const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };
    const sections = [
    {
      title: t("timetable"),
      icon: <CalendarDays size={40} />,
      desc: t("viewTimetables"),
      path: "/parent/timetable",
    },
    {
      title: t("viewChildMarks"),
      icon: <Trophy size={40} />,
      desc: t("viewChildMarksDesc"),
      path: "/parent/top-ranks",
    },
    {
      title: t("studentActivities"),
      icon: <Activity size={40} />,
      desc: t("viewStudentActivities"),
      path: "/parent/activities",
    },
    {
      title: t("skillrackMedals"),
      icon: <Medal size={40} />,
      desc: t("viewCodingMedals"),
      path: "/parent/skillrack",
    },
    {
      title: t("attendance"),
      icon: <BarChart3 size={40} />,
      desc: t("viewAttendanceReports"),
      path: "/parent/attendance",
    },
    {
      title: t("announcements"),
      icon: <Megaphone size={40} />,
      desc: t("viewMessages"),
      path: "/parent/announcements",
    },
    {
      title: t("examSchedule"),
      icon: <FileText size={40} />,
      desc: t("viewExamSchedules"),
      path: "/parent/exam-schedule",
    },
    {
      title: t("cbcs"),
      icon: <BookOpen size={40} />,
      desc: t("viewCBCS"),
      path: "/parent/cbcs",
    },
    {
      title: t("leaveRequests"),
      icon: <ClipboardList size={40} />,
      desc: t("submitLeaveRequests"),
      path: "/parent/leave-requests",
    },
    {
      title: t("scholarship"),
      icon: <Award size={40} />,
      desc: t("viewScholarship"),
      path: "/parent/scholarship",
    },
    {
      title: t("studentAchievements"),
      icon: <Trophy size={40} />,
      desc: t("viewAchievements"),
      path: "/parent/achievements",
    },
    {
      title: t("circularsAnnouncements"),
      icon: <FileText size={40} />,
      desc: t("stayUpdated"),
      path: "/parent/circulars",
    },
    {
      title: t("placementDrives"),
      icon: <BarChart3 size={40} />,
      desc: t("viewPlacementOpportunities"),
      path: "/parent/drives",
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
        {t("welcome")} {parentName || t("parent")}
      </h1>
  {/* Flash News Announcements */}

      {/* Flash News Announcements */}
      {announcements.length > 0 && (
        <div className="announcements-bar">
          <div className="announcements-label">📢 Flash News</div>
          <div className="announcements-scroll">
            <div className="scroll-text">
              {[...announcements, ...announcements].map((announcement, index) => (
                <span key={index} className="announcement-item">
                  <img src="/images/new.gif"  className="new-icon" />
                  {announcement.title}: {announcement.content}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}



      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h2>{t("parentProfile")}</h2>
              <button
                className="sidebar-close"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            {/* Language Selector */}
            <div className="language-selector">
              <label>{t("language")}: </label>
              <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
            {parentProfile && (
              <div className="profile-section">
                <div className="profile-photo">
                  {parentProfile.photo ? (
                    <img
                      src={`http://localhost:5000/uploads/${parentProfile.photo}`}
                      alt="Profile"
                    />
                  ) : (
                    <User size={60} />
                  )}
                </div>
                <div className="profile-info">
                  <p><strong>{t("parentName")}:</strong> {parentProfile.name}</p>
                  <p><strong>{t("parentEmail")}:</strong> {parentProfile.email}</p>
                  <hr />
                  <h4>{t("studentDetails")}:</h4>
                  {studentProfiles.length > 0 ? (
                    studentProfiles.map((profile, index) => (
                      <div key={index} className="student-profile">
                        <p><strong>{t("studentName")}:</strong> {profile.studentName}</p>
                        <p><strong>{t("studentEmail")}:</strong> {profile.studentEmail}</p>
                        <p><strong>{t("year")}:</strong> {profile.year}</p>
                        <p><strong>{t("assignedTeacher")}:</strong> {profile.teacherName || t("notAssigned")}</p>
                        <p><strong>{t("teacherEmail")}:</strong> {profile.teacherEmail || t("na")}</p>
                        {index < studentProfiles.length - 1 && <hr />}
                      </div>
                    ))
                  ) : (
                    <p>{t("noStudentInfo")}</p>
                  )}
                </div>
              </div>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              {t("logout")}
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
            <button className="dashboard-btn">{t("view")}</button>
          </div>
        ))}
      </div>
    </div>
  );
}