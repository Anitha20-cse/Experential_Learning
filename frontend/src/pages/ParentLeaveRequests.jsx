import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, FileText, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";


export default function ParentLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    reason: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [parentEmail, setParentEmail] = useState("");

  useEffect(() => {
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (parentData) {
      setParentEmail(parentData.email);
      fetchLeaveRequests(parentData.email);
    }
  }, []);

  const fetchLeaveRequests = async (email) => {
    try {
      const response = await axios.get(`https://experential-learning.onrender.com/api/leave-requests/parent/${email}`);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://experential-learning.onrender.com/api/leave-requests", {
        ...formData,
        parentEmail,
      });
      setShowForm(false);
      setFormData({
        leaveType: "",
        reason: "",
        startDate: "",
        endDate: "",
      });
      fetchLeaveRequests(parentEmail);
    } catch (error) {
      console.error("Error submitting leave request:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={20} color="#10b981" />;
      case "rejected":
        return <XCircle size={20} color="#ef4444" />;
      default:
        return <Clock size={20} color="#f59e0b" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  return (
    <div className="parent-leave-requests">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .parent-leave-requests {
          min-height: 100vh;
          background: #ffffff;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .parent-leave-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .parent-leave-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #667eea 100%);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          color: white;
        }

        .parent-leave-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .new-request-btn {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .new-request-btn:hover {
          background: white;
          color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .leave-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
        }

        .form-select,
        .form-textarea,
        .form-input {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .form-select:focus,
        .form-textarea:focus,
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .submit-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-btn:hover {
          background: #5568d3;
          transform: translateY(-2px);
        }

        .submit-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border-radius: 16px;
          color: #6b7280;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .empty-text {
          font-size: 1.2rem;
          font-weight: 500;
        }

        .request-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
          border-left: 4px solid #667eea;
        }

        .request-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .student-info h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .student-info p {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: capitalize;
        }

        .status-approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .request-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4b5563;
        }

        .detail-icon {
          color: #667eea;
        }

        .detail-text {
          font-size: 0.9rem;
        }

        .teacher-comments {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .comments-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .comments-icon {
          color: #667eea;
        }

        .comments-title {
          font-weight: 600;
          color: #374151;
          font-size: 0.9rem;
        }

        .comments-text {
          color: #4b5563;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .request-footer {
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: right;
        }

        @media (max-width: 768px) {
          .parent-leave-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .parent-leave-title {
            font-size: 2rem;
          }

          .new-request-btn {
            width: 100%;
          }

          .modal-content {
            width: 95%;
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-btn,
          .submit-btn {
            width: 100%;
          }

          .request-header {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
      <div className="parent-leave-container">
        <div className="parent-leave-header">
          <h1 className="parent-leave-title">Leave Requests</h1>
          <button
            onClick={() => setShowForm(true)}
            className="new-request-btn"
          >
            New Leave Request
          </button>
        </div>

        {/* Leave Request Form Modal */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Submit Leave Request</h2>
              <form onSubmit={handleSubmit} className="leave-form">
                <div className="form-group">
                  <label className="form-label">
                    Leave Type
                  </label>
                  <select
                    required
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Reason
                  </label>
                  <textarea
                    required
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    className="form-textarea"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Leave Requests List */}
        <div className="requests-list">
          {leaveRequests.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} className="empty-icon" />
              <p className="empty-text">No leave requests found</p>
            </div>
          ) : (
            leaveRequests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <div className="student-info">
                    <h3>
                      {request.studentName} ({request.studentRollNo})
                    </h3>
                    <p>{request.leaveType}</p>
                  </div>
                  <div className={`status-badge ${request.status === 'approved' ? 'status-approved' : request.status === 'rejected' ? 'status-rejected' : 'status-pending'}`}>
                    {getStatusIcon(request.status)}
                    <span className="capitalize">{request.status}</span>
                  </div>
                </div>

                <div className="request-details">
                  <div className="detail-item">
                    <Calendar size={16} className="detail-icon" />
                    <span className="detail-text">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FileText size={16} className="detail-icon" />
                    <span className="detail-text">{request.reason}</span>
                  </div>
                </div>

                {request.teacherComments && (
                  <div className="teacher-comments">
                    <div className="comments-header">
                      <MessageSquare size={16} className="comments-icon" />
                      <p className="comments-title">Teacher Comments:</p>
                    </div>
                    <p className="comments-text">{request.teacherComments}</p>
                  </div>
                )}

                <div className="request-footer">
                  Submitted on {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}