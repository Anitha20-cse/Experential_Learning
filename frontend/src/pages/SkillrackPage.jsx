import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // 👈 added
import "./Skillrack.css";

const SkillrackPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [showTopCoders, setShowTopCoders] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [topCoders, setTopCoders] = useState([
    { rollNo: "", name: "", medals: "" },
    { rollNo: "", name: "", medals: "" },
    { rollNo: "", name: "", medals: "" },
  ]);
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // 👈 track which month is being edited

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (teacherData) setUserRole("teacher");
    else if (parentData) setUserRole("parent");
    fetchData();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file first!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const headers = { "Content-Type": "multipart/form-data" };
      if (teacherData && teacherData._id) {
        headers['x-user-id'] = teacherData._id;
      }

      const res = await axios.post("https://experential-learning.onrender.com/api/skillrack/upload", formData, {
        headers,
      });
      setMessage(res.data.message);
      fetchData();
      setFile(null);
    } catch (err) {
      setMessage("Upload failed: " + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("https://experential-learning.onrender.com/api/skillrack");
      setMessage("All skillrack data deleted ❌");
      setData([]);
    } catch (err) {
      setMessage("Delete failed: " + err.message);
    }
  };

  const fetchData = async () => {
    try {
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const parentData = JSON.parse(localStorage.getItem("parent"));
      const headers = {};
      if (teacherData) {
        headers["x-user-role"] = "teacher";
        headers["x-user-email"] = teacherData.email;
      } else if (parentData) {
        headers["x-user-role"] = "parent";
        headers["x-user-email"] = parentData.email;
      }
      const res = await axios.get("https://experential-learning.onrender.com/api/skillrack", { headers });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleCoderChange = (index, field, value) => {
    const updated = [...topCoders];
    updated[index][field] = value;
    setTopCoders(updated);
  };

  const handleSubmitCoders = () => {
    if (!selectedMonth) {
      alert("Please select a month first!");
      return;
    }

    const entry = { month: selectedMonth, coders: topCoders };

    if (editIndex !== null) {
      // 👇 Editing existing month
      const updated = [...submittedData];
      updated[editIndex] = entry;
      setSubmittedData(updated);
      setEditIndex(null);
      alert(`Updated top 3 coders for ${selectedMonth}!`);
    } else {
      // 👇 Adding new entry
      setSubmittedData((prev) => [...prev, entry]);
      alert(`Top 3 coders for ${selectedMonth} submitted successfully!`);
    }

    setSelectedMonth("");
    setTopCoders([
      { rollNo: "", name: "", medals: "" },
      { rollNo: "", name: "", medals: "" },
      { rollNo: "", name: "", medals: "" },
    ]);
    setShowTopCoders(false);
  };

  // 🗑 Delete Month Card
  const handleDeleteMonth = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this month’s entry?");
    if (confirmDelete) {
      setSubmittedData(submittedData.filter((_, i) => i !== index));
    }
  };

  // ✏ Edit Month Card
  const handleEditMonth = (index) => {
    const monthData = submittedData[index];
    setSelectedMonth(monthData.month);
    setTopCoders(monthData.coders);
    setEditIndex(index);
    setShowTopCoders(true);
  };

  return (
    <div className="skillrack-container">
      <h1>Skillrack Data</h1>

      {userRole && (
        <div className="action-buttons">
          <input type="file" onChange={handleFileChange} />
          <button className="btn green" onClick={handleUpload}>Upload</button>
          <button className="btn orange" onClick={handleDelete}>Delete All</button>
          <button className="btn blue" onClick={() => setShowTopCoders(true)}>🏆 Top 3 Coders</button>
        </div>
      )}

      {message && <p className="message">{message}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).filter(k => k !== "_id" && k !== "createdAt" && k !== "updatedAt" && k !== "teacher" && k !== "__v").map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((d) => (
                <tr key={d._id}>
                  {Object.keys(d).filter(k => k !== "_id" && k !== "createdAt" && k !== "updatedAt" && k !== "teacher" && k !== "__v").map(header => (
                    <td key={header}>{d[header]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "10px" }}>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🏅 Top Coders Summary */}
      {submittedData.length > 0 && (
        <div className="top-coders-section">
          <h2>🏅 Top Coders Summary</h2>
          <div className="month-summary-container">
            {submittedData.map((entry, idx) => (
              <div className="month-card" key={idx}>
                <div className="month-header">
                  <h3>{entry.month}</h3>
                  <div className="icon-group">
                    <FaEdit className="icon edit" onClick={() => handleEditMonth(idx)} />
                    <FaTrash className="icon delete" onClick={() => handleDeleteMonth(idx)} />
                  </div>
                </div>
                {entry.coders.map((coder, i) => (
                  <div key={i} className="coder-card">
                    <p><strong>Roll No:</strong> {coder.rollNo || "-"}</p>
                    <p><strong>Name:</strong> {coder.name || "-"}</p>
                    <p><strong>Medals:</strong> 🥇 {coder.medals || 0}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup */}
      {showTopCoders && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>🏆 Top 3 Coders</h2>

            {!selectedMonth ? (
              <div>
                <p>Select Month:</p>
                <div className="month-grid">
                  {months.map((m) => (
                    <button key={m} onClick={() => setSelectedMonth(m)} className="month-btn">
                      {m}
                    </button>
                  ))}
                </div>
                <button className="btn red" onClick={() => setShowTopCoders(false)}>Close</button>
              </div>
            ) : (
              <div>
                <h3>Enter Top 3 Students for {selectedMonth}</h3>
                {topCoders.map((coder, index) => (
                  <div className="coder-box" key={index}>
                    <input
                      type="text"
                      placeholder="Roll No"
                      value={coder.rollNo}
                      onChange={(e) => handleCoderChange(index, "rollNo", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={coder.name}
                      onChange={(e) => handleCoderChange(index, "name", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Medal Count"
                      value={coder.medals}
                      onChange={(e) => handleCoderChange(index, "medals", e.target.value)}
                    />
                  </div>
                ))}
                <div className="popup-actions">
                  <button className="btn blue" onClick={handleSubmitCoders}>
                    {editIndex !== null ? "Update" : "Submit"}
                  </button>
                  <button className="btn red" onClick={() => setSelectedMonth("")}>Back</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillrackPage;