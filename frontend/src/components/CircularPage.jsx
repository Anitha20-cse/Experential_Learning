import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileAlt, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import "./CircularPage.css";

const categories = ["Leave", "Celebration", "Competition", "Others"];

export default function CircularPage() {
  const [circulars, setCirculars] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Leave");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Leave",
    file: null,
  });

  useEffect(() => { fetchCirculars(); }, []);

  const fetchCirculars = async () => {
    try {
      const res = await axios.get("https://experential-learning.onrender.com/api/circulars");
      setCirculars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") setFormData({ ...formData, file: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.file) data.append("file", formData.file);

    try {
      await axios.post("https://experential-learning.onrender.com/api/circulars", data);
      setFormData({ title: "", description: "", category: "Leave", file: null });
      setShowForm(false);
      fetchCirculars();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add circular");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://experential-learning.onrender.com/api/circulars/${id}`);
      fetchCirculars();
    } catch (err) { console.error(err); }
  };

  const filteredCirculars = circulars.filter(c => c.category === activeCategory);

  const categoryColors = {
    Leave: "linear-gradient(135deg, #ff9f43, #ffd666)",
    Celebration: "linear-gradient(135deg, #4e7dff, #a0c4ff)",
    Competition: "linear-gradient(135deg, #a855f7, #fbb6ce)",
    Others: "linear-gradient(135deg, #38bdf8, #81e6d9)"
  };

  return (
    <div className="circular-page">
      <h1>📢 Circulars</h1>

      {/* Category Tabs */}
      <div className="tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`tab ${activeCategory === cat ? "active" : ""}`}
            style={{ borderBottom: activeCategory === cat ? "4px solid #4e7dff" : "none" }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Circular Cards */}
      <div className="card-grid">
        {filteredCirculars.length === 0 && <p className="no-data">No circulars found.</p>}
        {filteredCirculars.map(c => (
          <div className="card" key={c._id} style={{ background: categoryColors[c.category] }}>
            <div className="card-info">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
            </div>
            <div className="card-actions">
              {c.file && (
                <button 
                  className="pdf-btn" 
                  onClick={() => setPdfPreview(`https://experential-learning.onrender.com${c.file}`)}
                >
                  <FaFileAlt />
                </button>
              )}
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(c._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button className="fab" onClick={() => setShowForm(true)}>
        <FaPlus />
      </button>

      {/* Add Circular Form Modal */}
      {showForm && (
        <div className="modal" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Circular</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input 
                name="title" 
                placeholder="Title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
              <textarea 
                name="description" 
                placeholder="Description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
              <input 
                type="file" 
                name="file" 
                accept="application/pdf" 
                onChange={handleChange} 
                required 
              />
              <button type="submit">Add Circular</button>
            </form>
          </div>
        </div>
      )}

      {/* PDF Preview */}
      {pdfPreview && (
        <div className="pdf-overlay" onClick={() => setPdfPreview(null)}>
          <div className="pdf-container" onClick={e => e.stopPropagation()}>
            <button className="pdf-close" onClick={() => setPdfPreview(null)}>
              <FaTimes />
            </button>
            <iframe src={pdfPreview} title="PDF Preview" className="pdf-fixed"></iframe>
          </div>
        </div>
      )}
    </div>
  );
}