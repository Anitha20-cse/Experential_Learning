import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Attendance.css";

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [monthWiseForm, setMonthWiseForm] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    file: null
  });
  const [consolidatedForm, setConsolidatedForm] = useState({
    file: null
  });
  const [monthWiseMessage, setMonthWiseMessage] = useState("");
  const [consolidatedMessage, setConsolidatedMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (teacherData) {
      setUserRole("teacher");
    } else if (parentData) {
      setUserRole("parent");
    }
    fetchStudents();
  }, []);

  // Fetch students
  const fetchStudents = async () => {
    try {
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
      const res = await axios.get("http://localhost:5000/api/attendance", { headers });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter students by type
  const monthWiseStudents = students.filter(s => s.type === 'month-wise');
  const consolidatedStudents = students.filter(s => s.type === 'consolidated');



  // Handle month-wise file upload
  const handleMonthWiseUpload = async (e) => {
    e.preventDefault();
    if (!monthWiseForm.file) {
      setMonthWiseMessage("Please select a file");
      return;
    }

    try {
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const formDataUpload = new FormData();
      formDataUpload.append('file', monthWiseForm.file);
      formDataUpload.append('type', 'month-wise');
      formDataUpload.append('month', monthWiseForm.month);
      formDataUpload.append('year', monthWiseForm.year);

      const headers = {
        'x-user-email': teacherData.email,
        'Content-Type': 'multipart/form-data'
      };

      const res = await axios.post("http://localhost:5000/api/attendance/upload", formDataUpload, { headers });

      setMonthWiseMessage(res.data.message);
      setMonthWiseForm({
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        file: null
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
      setMonthWiseMessage("Error uploading file");
    }
  };

  // Handle consolidated file upload
  const handleConsolidatedUpload = async (e) => {
    e.preventDefault();
    if (!consolidatedForm.file) {
      setConsolidatedMessage("Please select a file");
      return;
    }

    try {
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const formDataUpload = new FormData();
      formDataUpload.append('file', consolidatedForm.file);
      formDataUpload.append('type', 'consolidated');

      const headers = {
        'x-user-email': teacherData.email,
        'Content-Type': 'multipart/form-data'
      };

      const res = await axios.post("http://localhost:5000/api/attendance/upload", formDataUpload, { headers });

      setConsolidatedMessage(res.data.message);
      setConsolidatedForm({
        file: null
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
      setConsolidatedMessage("Error uploading file");
    }
  };

  // Handle delete all records
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all attendance records? This action cannot be undone.")) {
      return;
    }

    try {
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const headers = {
        'x-user-role': 'teacher',
        'x-user-email': teacherData.email
      };

      const res = await axios.delete("http://localhost:5000/api/attendance", { headers });
      setDeleteMessage(res.data.message);
      fetchStudents();
    } catch (err) {
      console.error(err);
      setDeleteMessage("Error deleting records");
    }
  };

  return (
    <div className="attendance-container">
      <h1>Attendance Management</h1>

      {userRole === "teacher" && (
        <div className="upload-section">
          <h2>Upload Attendance Sheets</h2>
          <div className="upload-container">
            <div className="upload-panel">
              <h3>Month-wise Upload</h3>
              <form onSubmit={handleMonthWiseUpload} className="upload-form">
                <select
                  value={monthWiseForm.month}
                  onChange={(e) => setMonthWiseForm({ ...monthWiseForm, month: e.target.value })}
                  required
                >
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Year"
                  value={monthWiseForm.year}
                  onChange={(e) => setMonthWiseForm({ ...monthWiseForm, year: e.target.value })}
                  required
                />
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setMonthWiseForm({ ...monthWiseForm, file: e.target.files[0] })}
                  required
                />
                <button type="submit">Upload Month-wise Attendance</button>
              </form>
              {monthWiseMessage && <p className="upload-message">{monthWiseMessage}</p>}
            </div>

            <div className="upload-panel">
              <h3>Consolidated Upload</h3>
              <form onSubmit={handleConsolidatedUpload} className="upload-form">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setConsolidatedForm({ ...consolidatedForm, file: e.target.files[0] })}
                  required
                />
                <button type="submit">Upload Consolidated Attendance</button>
              </form>
              {consolidatedMessage && <p className="upload-message">{consolidatedMessage}</p>}
            </div>
          </div>

          <div className="delete-section">
            <h3>Delete All Records</h3>
            <p style={{ color: 'red', fontSize: '14px' }}>Warning: This will permanently delete all attendance records. This action cannot be undone.</p>
            <button
              onClick={handleDeleteAll}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Delete All Attendance Records
            </button>
            {deleteMessage && <p className="delete-message" style={{ color: deleteMessage.includes('Error') ? 'red' : 'green' }}>{deleteMessage}</p>}
          </div>
        </div>
      )}

      <div className="data-container">
        <div className="data-panel">
          <h3>Month-wise Attendance Data</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Name</th>
                  {monthWiseStudents.length > 0 && monthWiseStudents[0].dynamicFields && Object.keys(monthWiseStudents[0].dynamicFields).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthWiseStudents.map((s) => (
                  <tr key={s._id}>
                    <td>{s.rollNo}</td>
                    <td>{s.name}</td>
                    {s.dynamicFields && Object.keys(s.dynamicFields).map(key => (
                      <td key={key}>{s.dynamicFields[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="data-panel">
          <h3>Consolidated Attendance Data</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Name</th>
                  {consolidatedStudents.length > 0 && consolidatedStudents[0].dynamicFields && Object.keys(consolidatedStudents[0].dynamicFields).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {consolidatedStudents.map((s) => (
                  <tr key={s._id}>
                    <td>{s.rollNo}</td>
                    <td>{s.name}</td>
                    {s.dynamicFields && Object.keys(s.dynamicFields).map(key => (
                      <td key={key}>{s.dynamicFields[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
