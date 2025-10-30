import React, { useState } from "react";
import axios from "axios";

export default function UploadMarks({ onClose, onUploadSuccess }) {
  const [formData, setFormData] = useState({
    examType: "PT",
    semester: 1,
    year: 2024,
    file: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Please select a file");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("examType", formData.examType);
    data.append("semester", formData.semester);
    data.append("year", formData.year);
    data.append("file", formData.file);

    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const headers = {};
    if (teacherData) {
      headers['x-user-role'] = 'teacher';
      headers['x-user-email'] = teacherData.email;
    }

    try {
      await axios.post("https://experential-learning.onrender.com/api/marks/upload", data, { headers });
      alert("Marks uploaded successfully!");
      onUploadSuccess && onUploadSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to upload marks: " + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        padding: "24px",
        borderRadius: "12px",
        width: "400px",
        maxWidth: "90vw"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Upload Marks</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
              Exam Type
            </label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
              required
            >
              <option value="PT">PT Exam</option>
              <option value="CAT">CAT Exam</option>
              <option value="End Sem">End Semester Exam</option>
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
              Semester
            </label>
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              min={1}
              max={8}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min={2020}
              max={2030}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
              Excel File (.xlsx)
            </label>
            <input
              type="file"
              name="file"
              accept=".xlsx"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
              required
            />
            <small style={{ color: "#64748b", fontSize: "12px" }}>
              File format: First column "Roll No", second column "Student Name", following columns are subject names with marks
            </small>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 16px",
                border: "1px solid #d1d5db",
                background: "white",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              style={{
                padding: "8px 16px",
                background: uploading ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: uploading ? "not-allowed" : "pointer"
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
