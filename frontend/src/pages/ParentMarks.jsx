import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ParentMarks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamType, setSelectedExamType] = useState("all");

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const parentData = JSON.parse(localStorage.getItem("parent"));
      const headers = {};
      if (parentData) {
        headers['x-user-role'] = 'parent';
        headers['x-user-email'] = parentData.email;
      }

      const res = await axios.get("http://localhost:5000/api/marks/child-marks", { headers });
      setMarks(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filteredMarks = selectedExamType === "all"
    ? marks
    : marks.filter(mark => mark.examType === selectedExamType);

  const groupedMarks = filteredMarks.reduce((acc, mark) => {
    const key = `${mark.studentName} - ${mark.examType}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(mark);
    return acc;
  }, {});

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#1e293b", marginBottom: "20px" }}>📊 Your Child's Marks</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "500" }}>Filter by Exam Type:</label>
        <select
          value={selectedExamType}
          onChange={(e) => setSelectedExamType(e.target.value)}
          style={{
            padding: "8px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px"
          }}
        >
          <option value="all">All Exams</option>
          <option value="PT">PT Exam</option>
          <option value="CAT">CAT Exam</option>
          <option value="End Sem">End Semester Exam</option>
        </select>
      </div>

      {Object.keys(groupedMarks).length === 0 ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>No marks data available</p>
      ) : (
        Object.entries(groupedMarks).map(([key, studentMarks]) => (
          <div key={key} style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{ color: "#1e293b", marginBottom: "16px" }}>{key}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {studentMarks.map((mark, index) => (
                <div key={index} style={{
                  background: "#f8fafc",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0"
                }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#374151" }}>{mark.subject}</h4>
                  <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold", color: "#1e293b" }}>
                    {mark.marks} marks
                  </p>
                  <small style={{ color: "#64748b" }}>
                    Semester {mark.semester}, Year {mark.year}
                  </small>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: "16px",
              padding: "12px",
              background: "#eff6ff",
              borderRadius: "8px",
              border: "1px solid #bfdbfe"
            }}>
              <strong>Average: </strong>
              {(studentMarks.reduce((sum, mark) => sum + mark.marks, 0) / studentMarks.length).toFixed(2)} marks
            </div>
          </div>
        ))
      )}
    </div>
  );
}
