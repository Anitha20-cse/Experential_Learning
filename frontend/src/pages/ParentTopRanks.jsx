import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TopRanks.css";

export default function ParentTopRanks() {
  const [top3, setTop3] = useState({ ptTop3: [], catTop3: [], endSemTop3: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parentData = JSON.parse(localStorage.getItem("parent"));
    const headers = {};
    if (parentData) {
      headers['x-user-role'] = 'parent';
      headers['x-user-email'] = parentData.email;
    }

    axios
      .get("http://localhost:5000/api/dashboard/top3", { headers })
      .then((res) => setTop3(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="topranks-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="topranks-title">🏆 Top Students 🏆</h1>
        <button
          onClick={() => window.location.href = '/parent/marks'}
          style={{
            padding: "10px 20px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500"
          }}
        >
          View Your Child's Marks
        </button>
      </div>

      {renderTopStudents(top3.ptTop3 || [], "PT Exam Top 3")}
      {renderTopStudents(top3.catTop3 || [], "CAT Exam Top 3")}
      {renderTopStudents(top3.endSemTop3 || [], "End Semester Exam Top 3")}
    </div>
  );
}
