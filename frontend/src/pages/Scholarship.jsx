import React, { useState, useEffect } from "react";
import axios from "axios";
import { Award, Edit2, Trash2, Plus, Calendar, DollarSign, FileText, User, Building, CheckCircle, Clock, XCircle } from "lucide-react";
import "./Scholarship.css";

export default function Scholarship() {
  const [scholarships, setScholarships] = useState([]);
  const [formData, setFormData] = useState({
    regno: "",
    provider: "",
    name: "",
    type: "",
    year: "",
    status: "",
    appliedDate: "",
    amount: "",
    description: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://experential-learning.onrender.com/api/scholarships");
      setScholarships(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setError("Failed to load scholarships. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!formData.regno || !formData.provider || !formData.name || !formData.type || !formData.year || !formData.status || !formData.appliedDate || !formData.amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editIndex !== null) {
        const scholarshipId = scholarships[editIndex]._id;
        await axios.put(`https://experential-learning.onrender.com/api/scholarships/${scholarshipId}`, formData);
        await fetchScholarships();
        setEditIndex(null);
      } else {
        await axios.post("https://experential-learning.onrender.com/api/scholarships", formData);
        await fetchScholarships();
      }

      setFormData({
        regno: "",
        provider: "",
        name: "",
        type: "",
        year: "",
        status: "",
        appliedDate: "",
        amount: "",
        description: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving scholarship:", error);
      alert("Error saving scholarship. Please try again.");
    }
  };

  const handleEdit = (index) => {
    setFormData(scholarships[index]);
    setEditIndex(index);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      try {
        const scholarshipId = scholarships[index]._id;
        await axios.delete(`https://experential-learning.onrender.com/api/scholarships/${scholarshipId}`);
        await fetchScholarships();
      } catch (error) {
        console.error("Error deleting scholarship:", error);
        alert("Error deleting scholarship. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      regno: "",
      provider: "",
      name: "",
      type: "",
      year: "",
      status: "",
      appliedDate: "",
      amount: "",
      description: "",
    });
    setEditIndex(null);
    setShowForm(false);
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('granted')) {
      return <CheckCircle size={18} />;
    } else if (statusLower.includes('pending')) {
      return <Clock size={18} />;
    } else if (statusLower.includes('rejected')) {
      return <XCircle size={18} />;
    }
    return <FileText size={18} />;
  };

  const getStatusClass = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('granted')) {
      return 'status-approved';
    } else if (statusLower.includes('pending')) {
      return 'status-pending';
    } else if (statusLower.includes('rejected')) {
      return 'status-rejected';
    }
    return 'status-default';
  };

  const totalAmount = scholarships.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const pendingCount = scholarships.filter(s => s.status.toLowerCase().includes('pending')).length;

  return (
    <div className="scholarship-page">
      <div className="scholarship-container">
        {/* Header Section */}
        <div className="page-header-scholarship">
          <div className="header-content-scholarship">
            <div className="header-icon">
              <Award size={40} />
            </div>
            <div>
              <h1 className="page-title-scholarship">Scholarship Management</h1>
              <p className="page-subtitle-scholarship">Track and manage scholarship applications</p>
            </div>
          </div>
          <button 
            className="new-scholarship-btn" 
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={20} />
            <span>{showForm ? 'Close Form' : 'New Scholarship'}</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card-scholarship stat-total">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{scholarships.length}</span>
              <span className="stat-label">Total Scholarships</span>
            </div>
          </div>
          <div className="stat-card-scholarship stat-pending">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{pendingCount}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-card-scholarship stat-amount">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">₹{totalAmount.toLocaleString()}</span>
              <span className="stat-label">Total Amount</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="form-section">
            <div className="form-header">
              <h2>{editIndex !== null ? 'Edit Scholarship' : 'Add New Scholarship'}</h2>
              <p>Fill in the details below to {editIndex !== null ? 'update' : 'add'} a scholarship record</p>
            </div>
            
            <div className="scholarship-form">
              <div className="form-group-scholarship">
                <label>
                  <User size={16} />
                  Register Number *
                </label>
                <input
                  type="text"
                  name="regno"
                  value={formData.regno}
                  onChange={handleChange}
                  placeholder="Enter Register Number"
                  className="form-input-scholarship"
                />
              </div>

              <div className="form-group-scholarship">
                <label>
                  <Building size={16} />
                  Provider Name *
                </label>
                <input
                  type="text"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  placeholder="Enter Provider Name"
                  className="form-input-scholarship"
                />
              </div>

              <div className="form-group-scholarship">
                <label>
                  <Award size={16} />
                  Scholarship Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Scholarship Name"
                  className="form-input-scholarship"
                />
              </div>

              <div className="form-group-scholarship">
                <label>
                  <FileText size={16} />
                  Scholarship Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-input-scholarship"
                >
                  <option value="">Select Type</option>
                  <option value="Merit-Based">Merit-Based</option>
                  <option value="Need-Based">Need-Based</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Institution">Institution</option>
                </select>
              </div>

              <div className="form-group-scholarship">
                <label>
                  <Calendar size={16} />
                  Academic Year *
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2024-2025"
                  className="form-input-scholarship"
                />
              </div>

              <div className="form-group-scholarship">
                <label>
                  <FileText size={16} />
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input-scholarship"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Granted">Granted</option>
                </select>
              </div>

              <div className="form-group-scholarship">
                <label>
                  <Calendar size={16} />
                  Applied Date *
                </label>
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className="form-input-scholarship"
                />
              </div>

              <div className="form-group-scholarship">
                <label>
                  <DollarSign size={16} />
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter Amount"
                  className="form-input-scholarship"
                />
              </div>

              <div className="form-group-scholarship form-full-width">
                <label>
                  <FileText size={16} />
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Additional details about the scholarship..."
                  className="form-textarea-scholarship"
                  rows={3}
                />
              </div>

              <div className="form-actions-scholarship">
                <button className="btn-cancel-scholarship" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn-submit-scholarship" onClick={handleAdd}>
                  {editIndex !== null ? 'Update Scholarship' : 'Add Scholarship'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scholarships List */}
        <div className="scholarships-list-section">
          <div className="list-header">
            <h2>Scholarship Records</h2>
            <span className="record-count">{scholarships.length} record{scholarships.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="loading-state-scholarship">
              <div className="spinner-scholarship"></div>
              <p>Loading scholarships...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <XCircle size={48} />
              <p>{error}</p>
            </div>
          ) : scholarships.length === 0 ? (
            <div className="empty-state-scholarship">
              <Award size={64} />
              <h3>No Scholarships Yet</h3>
              <p>Click "New Scholarship" to add your first scholarship record</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="scholarship-table">
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Provider</th>
                    <th>Scholarship Name</th>
                    <th>Type</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships.map((s, index) => (
                    <tr key={s._id || index}>
                      <td className="td-regno">{s.regno}</td>
                      <td className="td-provider">{s.provider}</td>
                      <td className="td-name">{s.name}</td>
                      <td>
                        <span className="type-badge">{s.type}</span>
                      </td>
                      <td>{s.year}</td>
                      <td>
                        <span className={`status-badge-scholarship ${getStatusClass(s.status)}`}>
                          {getStatusIcon(s.status)}
                          {s.status}
                        </span>
                      </td>
                      <td>{new Date(s.appliedDate).toLocaleDateString()}</td>
                      <td className="td-amount">₹{Number(s.amount).toLocaleString()}</td>
                      <td className="td-actions">
                        <button 
                          className="btn-edit-scholarship" 
                          onClick={() => handleEdit(index)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn-delete-scholarship" 
                          onClick={() => handleDelete(index)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}