import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import "../TeacherDashBoard.css";

export default function ParentStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (!parentData) {
      navigate("/");
      return;
    }
    fetchStudentsForParent(parentData.email);
  }, [navigate]);

  const fetchStudentsForParent = async (parentEmail) => {
    try {
      const res = await axios.get(`https://experential-learning.onrender.com/api/students/parent/${parentEmail}`);
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students for parent:", err);
      setError("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>Loading students...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h1>Error: {error}</h1>
        <button onClick={() => navigate(-1)} className="dashboard-btn">
          <ArrowLeft size={20} /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <button
        className="sidebar-toggle"
        onClick={() => navigate(-1)}
        style={{ position: "absolute", top: "20px", left: "20px" }}
      >
        <ArrowLeft size={24} />
      </button>

      <h1 className="dashboard-title">Your Children</h1>

      {students.length === 0 ? (
        <p>No children found.</p>
      ) : (
        <div className="students-list">
          {students.map((student) => (
            <div key={student._id} className="student-card">
              <div className="student-icon">
                <User size={40} />
              </div>
              <div className="student-info">
                <h3>{student.firstName} {student.lastName}</h3>
                <p><strong>Email:</strong> {student.emailId}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Year:</strong> {student.year}</p>
                <p><strong>Phone:</strong> {student.phoneNumber}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
