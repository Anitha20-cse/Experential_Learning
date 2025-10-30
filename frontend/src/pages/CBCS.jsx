import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CBCS.css";

const CBCSPage = () => {
  const [file, setFile] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [teacherId, setTeacherId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    if (teacherData && teacherData.email) {
      fetchTeacherProfile(teacherData.email);
      loadAssignedStudents(teacherData.email);
    } else {
      setError("Teacher not logged in. Please login first.");
    }
  }, []);

  const fetchTeacherProfile = async (email) => {
    try {
      const res = await axios.get(`https://experential-learning.onrender.com/api/teachers/profile/${email}`);
      setTeacherId(res.data._id);
    } catch (err) {
      console.error("Error fetching teacher profile:", err);
      setError("Failed to load teacher information.");
    }
  };

  const loadAssignedStudents = async (teacherEmail) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://experential-learning.onrender.com/api/cbcs/teacher?teacherEmail=${teacherEmail}`);
      setStudents(res.data);
      if (res.data.length > 0 && res.data[0].subjects) {
        const subjectNames = [
          res.data[0].subjects.s1,
          res.data[0].subjects.s2,
          res.data[0].subjects.s3,
          res.data[0].subjects.s4,
          res.data[0].subjects.s5
        ];
        setSubjects(subjectNames);
      } else {
        setSubjects([
          'Theory of Computation',
          'Object Oriented Analysis and Design',
          'DevOps and Agile Methodology',
          'Modern Web Technologies',
          'Artificial Intelligence'
        ]);
      }
    } catch (err) {
      console.error("Error loading assigned students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an Excel file.");
      return;
    }
    if (!teacherId) {
      setError("Teacher information not loaded. Please refresh the page.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("teacherEmail", teacherData.email);

      const token = localStorage.getItem("token");
      const res = await axios.post("https://experential-learning.onrender.com/api/cbcs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      const teacherRes = await axios.get(`https://experential-learning.onrender.com/api/cbcs/teacher?teacherEmail=${teacherData.email}`);

      setStudents(teacherRes.data);
      if (teacherRes.data.length > 0 && teacherRes.data[0].subjects) {
        const subjectNames = [
          teacherRes.data[0].subjects.s1,
          teacherRes.data[0].subjects.s2,
          teacherRes.data[0].subjects.s3,
          teacherRes.data[0].subjects.s4,
          teacherRes.data[0].subjects.s5
        ];
        setSubjects(subjectNames);
      } else {
        setSubjects([
          'Theory of Computation',
          'Object Oriented Analysis and Design',
          'DevOps and Agile Methodology',
          'Modern Web Technologies',
          'Artificial Intelligence'
        ]);
      }
      setMessage("Data uploaded and processed successfully! Only your assigned students were stored.");
      setFile(null);
    } catch (err) {
      console.error(err);
      setError("Upload/fetch failed. Check Excel format or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(`https://experential-learning.onrender.com/api/cbcs/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      loadAssignedStudents(teacherData.email);
      setMessage("Record deleted successfully!");
    } catch (err) {
      console.error("Error deleting record:", err);
      setError("Failed to delete record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL CBCS records for your assigned students? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const token = localStorage.getItem("token");

      await axios.delete(`https://experential-learning.onrender.com/api/cbcs/teacher/all?teacherEmail=${teacherData.email}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      setStudents([]);
      setMessage("All CBCS records deleted successfully!");
    } catch (err) {
      console.error("Error deleting all records:", err);
      setError("Failed to delete all records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cbcs-container">
      <div className="cbcs-header">
        <h1>CBCS Teacher Dashboard</h1>
        <p className="subtitle">Manage student subject allocations and faculty assignments</p>
      </div>

      <div className="upload-card">
        <div className="card-header">
          <h2>Upload Excel File</h2>
          <p>Upload an Excel file containing multiple subject sheets to view and manage student assignments</p>
        </div>
        
        <form onSubmit={handleUpload} className="cbcs-form">
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              required
              id="file-upload"
              className="file-input"
            />
            <label htmlFor="file-upload" className="file-label">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {file ? file.name : "Choose Excel file"}
            </label>
          </div>
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Processing..." : "Upload & Process"}
          </button>
        </form>

        {message && (
          <div className="alert alert-success">
            <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {message}
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {students.length > 0 && (
        <div className="data-section">
          <div className="data-header">
            <div>
              <h2>Student Subject Allocations</h2>
              <p className="data-count">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
            </div>
            <button onClick={handleDeleteAll} className="delete-all-btn" disabled={loading}>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete All Records
            </button>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  {subjects.map((subject) => (
                    <th key={subject}>{subject}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu, index) => (
                  <tr key={stu.regno}>
                    <td>{index + 1}</td>
                    <td className="student-name">{stu.name}</td>
                    <td className="roll-no">{stu.regno}</td>
                    {subjects.map((sub, subIndex) => {
                      const subjectKey = `s${subIndex + 1}`;
                      return <td key={sub}>{stu[subjectKey] || "-"}</td>;
                    })}
                    <td>
                      <button
                        onClick={() => handleDelete(stu._id)}
                        className="delete-btn"
                        disabled={loading}
                        title="Delete Record"
                      >
                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
};

export default CBCSPage;