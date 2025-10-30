import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaCalendarAlt, 
  FaUpload, 
  FaTrash, 
  FaEdit, 
  FaEye,
  FaPlus,
  FaTimes,
  FaImage,
  FaClock
} from "react-icons/fa";
import "./Timetable.css";

export default function Timetable() {
  const [timetables, setTimetables] = useState([]);
  const [semester, setSemester] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [timetableType, setTimetableType] = useState("regular");
  const [viewType, setViewType] = useState("regular");
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const teacher = JSON.parse(localStorage.getItem("teacher"));
    const parent = JSON.parse(localStorage.getItem("parent"));
    if (teacher) setUserRole("teacher");
    else if (parent) setUserRole("parent");
    fetchTimetables();
  }, []);

  useEffect(() => {
    if (userRole === "teacher") {
      fetchTimetables(timetableType);
    }
  }, [timetableType]);

  const getHeaders = () => {
    const teacher = JSON.parse(localStorage.getItem("teacher"));
    const parent = JSON.parse(localStorage.getItem("parent"));
    const headers = {};
    if (teacher) {
      headers["x-user-role"] = "teacher";
      headers["x-user-email"] = teacher.email;
    } else if (parent) {
      headers["x-user-role"] = "parent";
      headers["x-user-email"] = parent.email;
    }
    return headers;
  };

  const fetchTimetables = async (selectedType = timetableType) => {
    try {
      const res = await axios.get("http://localhost:5000/api/timetable", {
        headers: { ...getHeaders(), "x-timetable-type": selectedType },
      });
      setTimetables(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation based on timetable type
    if (timetableType === 'regular' && !semester) {
      return alert("Please enter semester name!");
    }
    
    if (timetableType === 'saturday' && !selectedDate) {
      return alert("Please select a date for Saturday timetable!");
    }
    
    if (!file && !editMode) {
      return alert("Please select an image!");
    }

    const formData = new FormData();
    
    // Add semester or date based on type
    if (timetableType === 'regular') {
      formData.append("semester", semester);
    } else {
      formData.append("semester", formatDate(selectedDate)); // Use formatted date as semester for display
      formData.append("date", selectedDate); // Store actual date
    }
    
    if (file) {
      formData.append("file", file);
    }
    formData.append("type", timetableType);

    try {
      if (editMode && editId) {
        await axios.put(`http://localhost:5000/api/timetable/${editId}`, formData, {
          headers: { ...getHeaders(), "Content-Type": "multipart/form-data" },
        });
        setEditMode(false);
        setEditId(null);
      } else {
        await axios.post("http://localhost:5000/api/timetable", formData, {
          headers: { ...getHeaders(), "Content-Type": "multipart/form-data" },
        });
      }
      setSemester("");
      setSelectedDate("");
      setFile(null);
      setFileName("");
      document.getElementById('file-input').value = '';
      fetchTimetables();
    } catch (err) {
      console.error(err);
      alert("Error uploading timetable");
    }
  };

  const handleEdit = (timetable) => {
    if (timetable.type === 'saturday' && timetable.date) {
      setSelectedDate(timetable.date);
      setSemester("");
    } else {
      setSemester(timetable.semester);
      setSelectedDate("");
    }
    setEditMode(true);
    setEditId(timetable._id);
    setTimetableType(timetable.type || 'regular');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setSemester("");
    setSelectedDate("");
    setFile(null);
    setFileName("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this timetable?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/timetable/${id}`, {
        headers: getHeaders(),
      });
      fetchTimetables();
    } catch (err) {
      console.error(err);
      alert("Error deleting timetable");
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all timetables?")) {
      try {
        await axios.delete("http://localhost:5000/api/timetable", {
          headers: getHeaders(),
        });
        fetchTimetables();
      } catch (err) {
        console.error(err);
        alert("Error deleting timetables");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading timetables...</p>
      </div>
    );
  }

  const regularTimetables = timetables.filter(t => !t.type || t.type === 'regular');
  const saturdayTimetables = timetables.filter(t => t.type === 'saturday');

  return (
    <div className="timetable-container">
      {/* Header Section */}
      <div className="timetable-header">
        <div className="header-content">
          <div className="header-icon">📅</div>
          <div className="header-text">
            <h1>
              {userRole === "parent" ? "View Timetables" : "Manage Timetables"}
            </h1>
            <p>
              {userRole === "parent" 
                ? "Access your class schedules and timing" 
                : "Upload and manage class timetables"}
            </p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <div className="stat-value">{timetables.length}</div>
            <div className="stat-label">Total Timetables</div>
          </div>
        </div>
      </div>

      {/* Teacher Form Section */}
      {userRole === "teacher" && (
        <div className="form-container">
          <div className="form-header">
            {editMode ? (
              <>
                <FaEdit className="form-icon" />
                <h2>Edit Timetable</h2>
              </>
            ) : (
              <>
                <FaPlus className="form-icon" />
                <h2>Add New Timetable</h2>
              </>
            )}
          </div>

          <div className="type-selector">
            <label>
              <FaClock className="label-icon" />
              Timetable Type
            </label>
            <div className="type-buttons">
              <button
                type="button"
                className={`type-btn ${timetableType === 'regular' ? 'active' : ''}`}
                onClick={() => {
                  setTimetableType('regular');
                  setSelectedDate("");
                }}
              >
                📚 Regular Timetable
              </button>
              <button
                type="button"
                className={`type-btn ${timetableType === 'saturday' ? 'active' : ''}`}
                onClick={() => {
                  setTimetableType('saturday');
                  setSemester("");
                }}
              >
                🗓️ Saturday Timetable
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="timetable-form">
            {/* Conditional Input based on Timetable Type */}
            <div className="form-group">
              <label>
                <FaCalendarAlt className="label-icon" />
                {timetableType === 'regular' ? 'Semester Name' : 'Select Date'}
              </label>
              {timetableType === 'regular' ? (
                <input
                  type="text"
                  placeholder="e.g., Semester 1, Year 2024"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                />
              ) : (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label>
                <FaImage className="label-icon" />
                Upload Timetable Image
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!editMode}
                />
                <label htmlFor="file-input" className="file-upload-label">
                  {fileName || (editMode ? '📎 Change image (optional)' : '📎 Choose an image file')}
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editMode ? (
                  <>
                    <FaEdit /> Update Timetable
                  </>
                ) : (
                  <>
                    <FaUpload /> Upload Timetable
                  </>
                )}
              </button>
              {editMode && (
                <button type="button" onClick={cancelEdit} className="cancel-btn">
                  <FaTimes /> Cancel
                </button>
              )}
              {!editMode && (
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="delete-all-btn"
                >
                  <FaTrash /> Delete All
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Parent View Toggle */}
      {userRole === "parent" && (
        <div className="view-toggle-container">
          <label>
            <FaEye className="label-icon" />
            Select View
          </label>
          <div className="view-buttons">
            <button
              className={`view-btn ${viewType === 'regular' ? 'active' : ''}`}
              onClick={() => setViewType('regular')}
            >
              📚 Regular Timetables
            </button>
            <button
              className={`view-btn ${viewType === 'saturday' ? 'active' : ''}`}
              onClick={() => setViewType('saturday')}
            >
              🗓️ Saturday Timetables
            </button>
          </div>
        </div>
      )}

      {/* Timetables Display */}
      <div className="timetable-gallery">
        {/* Regular Timetables */}
        {(userRole === "teacher" || viewType === "regular") && regularTimetables.length > 0 && (
          <div className="timetable-section">
            <div className="section-header">
              <h2>📚 Regular Timetables</h2>
              <span className="count-badge">{regularTimetables.length}</span>
            </div>
            <div className="timetable-grid">
              {regularTimetables.map((t, index) => (
                <div 
                  key={t._id} 
                  className="timetable-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-header">
                    <h3>{t.semester}</h3>
                    {userRole === "teacher" && (
                      <div className="card-actions">
                        <button
                          onClick={() => handleEdit(t)}
                          className="action-btn edit-btn"
                          title="Edit timetable"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="action-btn delete-btn"
                          title="Delete timetable"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <div 
                    className="card-image"
                    onClick={() => setSelectedImage(`http://localhost:5000${t.imageUrl}`)}
                  >
                    <img
                      src={`http://localhost:5000${t.imageUrl}`}
                      alt={t.semester}
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <FaEye className="view-icon" />
                      <span>Click to view full size</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saturday Timetables */}
        {(userRole === "teacher" || viewType === "saturday") && saturdayTimetables.length > 0 && (
          <div className="timetable-section">
            <div className="section-header">
              <h2>🗓️ Saturday Timetables</h2>
              <span className="count-badge">{saturdayTimetables.length}</span>
            </div>
            <div className="timetable-grid">
              {saturdayTimetables.map((t, index) => (
                <div 
                  key={t._id} 
                  className="timetable-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-header">
                    <h3>{t.semester}</h3>
                    {userRole === "teacher" && (
                      <div className="card-actions">
                        <button
                          onClick={() => handleEdit(t)}
                          className="action-btn edit-btn"
                          title="Edit timetable"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="action-btn delete-btn"
                          title="Delete timetable"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                  <div 
                    className="card-image"
                    onClick={() => setSelectedImage(`http://localhost:5000${t.imageUrl}`)}
                  >
                    <img
                      src={`http://localhost:5000${t.imageUrl}`}
                      alt={t.semester}
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <FaEye className="view-icon" />
                      <span>Click to view full size</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {timetables.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No timetables found</h3>
            <p>
              {userRole === "teacher" 
                ? "Start by uploading your first timetable using the form above" 
                : "No timetables are available at the moment. Please check back later."}
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              <FaTimes />
            </button>
            <img src={selectedImage} alt="Timetable Preview" />
          </div>
        </div>
      )}
    </div>
  );
}