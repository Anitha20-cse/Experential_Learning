import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TopRanks.css";
import UploadMarks from "../components/UploadMarks";

export default function TopRanks() {
  const [top3, setTop3] = useState({ ptTop3: [], catTop3: [], endSemTop3: [] });
  const [userRole, setUserRole] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (teacherData) {
      setUserRole("teacher");
    } else if (parentData) {
      setUserRole("parent");
    }

    const headers = {};
    if (teacherData) {
      headers['x-user-role'] = 'teacher';
      headers['x-user-email'] = teacherData.email;
    } else if (parentData) {
      headers['x-user-role'] = 'parent';
      headers['x-user-email'] = parentData.email;
    }

    axios
      .get("https://experential-learning.onrender.com/api/dashboard/top3", { headers })
      .then((res) => setTop3(res.data))
      .catch((err) => console.error(err));

    // Confetti animation only for teachers
    if (userRole === 'teacher') {
      const confettiContainer = document.getElementById("confetti-container");
      const colors = ["#f44336", "#2196f3", "#4caf50", "#ffeb3b", "#ff9800"];
      for (let i = 0; i < 120; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti-piece");
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.animationDuration = 2 + Math.random() * 3 + "s";
        confetti.style.animationDelay = Math.random() * 2 + "s";
        confettiContainer?.appendChild(confetti);
      }
    }
  }, [userRole]);

  const refreshData = () => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const parentData = JSON.parse(localStorage.getItem("parent"));
    const headers = {};
    if (teacherData) {
      headers['x-user-role'] = 'teacher';
      headers['x-user-email'] = teacherData.email;
    } else if (parentData) {
      headers['x-user-role'] = 'parent';
      headers['x-user-email'] = parentData.email;
    }

    axios
      .get("https://experential-learning.onrender.com/api/dashboard/top3", { headers })
      .then((res) => setTop3(res.data))
      .catch((err) => console.error(err));
  };

  const renderTopStudents = (students, title) => (
    <div className="exam-section" style={{ marginBottom: "32px" }}>
      <h2 style={{ color: "#1e293b", marginBottom: "16px" }}>{title}</h2>
      <div className="topranks-grid">
        {students.map((student, index) => (
          <div key={student._id || index} className={`rank-card rank-${index + 1}`}>
            <div className="rank-badge">{index + 1}</div>
            <div className="glitter">✨</div>
            <h2>{student.studentName}</h2>
            <p>Roll No: {student.rollNo}</p>
            <p>Average Marks: {student.marks}</p>
          </div>
        ))}
      </div>
      {students.length === 0 && <p style={{ textAlign: "center", color: "#64748b" }}>No data available</p>}
    </div>
  );

  return (
    <div className="topranks-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="topranks-title">🏆 Top Students 🏆</h1>
        {userRole === 'teacher' && (
          <button
            onClick={() => setShowUpload(true)}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Upload Marks
          </button>
        )}
      </div>

      {renderTopStudents(top3.ptTop3 || [], "PT Exam Top 3")}
      {renderTopStudents(top3.catTop3 || [], "CAT Exam Top 3")}
      {renderTopStudents(top3.endSemTop3 || [], "End Semester Exam Top 3")}

      <div id="confetti-container" className="confetti"></div>

      {showUpload && (
        <UploadMarks
          onClose={() => setShowUpload(false)}
          onUploadSuccess={refreshData}
        />
      )}
    </div>
  );
}
