import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaBuilding, 
  FaCalendarAlt, 
  FaFilter, 
  FaPlus,
  FaUserGraduate,
  FaImage,
  FaTimes
} from "react-icons/fa";
import "./DriveDetails.css";

export default function DriveDetails() {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [drives, setDrives] = useState([]);
  const [filterDept, setFilterDept] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const departmentOptions = ["CSE", "ECE", "EEE", "IT", "AIDS", "CIVIL", "ALL STREAMS"];

  const deptColors = {
    "CSE": "#4e7dff",
    "ECE": "#ff6b6b",
    "EEE": "#ffd93d",
    "IT": "#6bcf7f",
    "AIDS": "#a855f7",
    "CIVIL": "#ff9f43",
    "ALL STREAMS": "#38bdf8"
  };

  useEffect(() => {
    fetchDrives();
  }, [filterDept]);

  const fetchDrives = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/drives?department=${filterDept}`
      );
      setDrives(res.data);
    } catch (err) {
      console.error("Error fetching drives:", err);
    }
  };

  const handleDepartmentChange = (dept) => {
    if (departments.includes(dept)) {
      setDepartments(departments.filter((d) => d !== dept));
    } else {
      setDepartments([...departments, dept]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !date || !departments.length || !file) {
      alert("Please fill all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("departments", departments.join(","));
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/drives", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDrives([res.data, ...drives]);
      setName("");
      setDate("");
      setFile(null);
      setFileName("");
      setDepartments([]);
      document.getElementById('file-input').value = '';
    } catch (err) {
      console.error("Error adding drive:", err);
      alert("Failed to add drive. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="drive-page">
      {/* Header Section */}
      <div className="drive-header">
        <div className="header-content">
          <div className="header-icon">📁</div>
          <div className="header-text">
            <h1>Drive Details</h1>
            <p>Manage and track placement drives</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <div className="stat-value">{drives.length}</div>
            <div className="stat-label">Total Drives</div>
          </div>
        </div>
      </div>

      {/* Add Drive Form */}
      <div className="drive-form-container">
        <div className="form-header">
          <FaPlus className="form-icon" />
          <h2>Add New Drive</h2>
        </div>
        
        <form className="drive-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FaBuilding className="label-icon" />
                Company Name
              </label>
              <input
                type="text"
                placeholder="Enter company name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaCalendarAlt className="label-icon" />
                Drive Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaUserGraduate className="label-icon" />
              Select Departments
            </label>
            <div className="dept-checkboxes">
              {departmentOptions.map((dept) => (
                <label 
                  key={dept} 
                  className={`dept-chip ${departments.includes(dept) ? 'selected' : ''}`}
                  style={{
                    borderColor: departments.includes(dept) ? deptColors[dept] : '#e2e8f0',
                    background: departments.includes(dept) ? `${deptColors[dept]}15` : 'white'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={departments.includes(dept)}
                    onChange={() => handleDepartmentChange(dept)}
                  />
                  <span style={{ color: departments.includes(dept) ? deptColors[dept] : '#64748b' }}>
                    {dept}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaImage className="label-icon" />
              Upload Image
            </label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="file-input" className="file-upload-label">
                {fileName || 'Choose an image'}
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            <FaPlus /> Add Drive
          </button>
        </form>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-content">
          <FaFilter className="filter-icon" />
          <label>Filter by Department:</label>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Departments</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div className="results-count">
          Showing {drives.length} {drives.length === 1 ? 'drive' : 'drives'}
        </div>
      </div>

      {/* Drive Cards */}
      <div className="drive-list">
        {drives.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No drives found</h3>
            <p>Add a new drive to get started</p>
          </div>
        ) : (
          drives.map((drive, index) => (
            <div 
              key={drive._id} 
              className="drive-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header">
                <h3>{drive.name}</h3>
                <div className="card-date">
                  <FaCalendarAlt />
                  <span>{formatDate(drive.date)}</span>
                </div>
              </div>

              <div className="card-departments">
                {drive.departments.map((dept) => (
                  <span 
                    key={dept} 
                    className="dept-badge"
                    style={{ 
                      background: `${deptColors[dept]}15`,
                      color: deptColors[dept],
                      borderColor: deptColors[dept]
                    }}
                  >
                    {dept}
                  </span>
                ))}
              </div>

              {drive.file && (
                <div className="card-image" onClick={() => setSelectedImage(`http://localhost:5000${drive.file}`)}>
                  <img 
                    src={`http://localhost:5000${drive.file}`} 
                    alt={drive.name}
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <span>Click to view full size</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              <FaTimes />
            </button>
            <img src={selectedImage} alt="Drive Preview" />
          </div>
        </div>
      )}
    </div>
  );
}