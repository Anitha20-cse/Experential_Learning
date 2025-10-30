import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, FileText, MessageSquare, CheckCircle, XCircle, Clock, Edit, User, Mail } from "lucide-react";
import "./LeaveRequests.css";

export default function TeacherLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [comments, setComments] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    if (teacherData) {
      setTeacherEmail(teacherData.email);
      fetchLeaveRequests(teacherData.email);
    }
  }, []);

  const fetchLeaveRequests = async (email) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/leave-requests/teacher/${email}`);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/leave-requests/${id}`, {
        status,
        teacherComments: comments,
      });
      setEditingRequest(null);
      setComments("");
      fetchLeaveRequests(teacherEmail);
    } catch (error) {
      console.error("Error updating leave request:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={20} />;
      case "rejected":
        return <XCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const statusCounts = {
    all: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === "pending").length,
    approved: leaveRequests.filter(r => r.status === "approved").length,
    rejected: leaveRequests.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="teacher-leave-page">
      <div className="teacher-leave-container">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Leave Requests Management</h1>
            <p className="page-subtitle">Review and manage student leave applications</p>
          </div>
          <div className="header-stats">
            <div className="stat-card stat-total">
              <span className="stat-number">{statusCounts.all}</span>
              <span className="stat-label">Total Requests</span>
            </div>
            <div className="stat-card stat-pending">
              <span className="stat-number">{statusCounts.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({statusCounts.all})
          </button>
          <button 
            className={`filter-tab ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({statusCounts.pending})
          </button>
          <button 
            className={`filter-tab ${filter === "approved" ? "active" : ""}`}
            onClick={() => setFilter("approved")}
          >
            Approved ({statusCounts.approved})
          </button>
          <button 
            className={`filter-tab ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected ({statusCounts.rejected})
          </button>
        </div>

        {/* Leave Requests List */}
        <div className="requests-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="empty-state">
              <Calendar size={64} className="empty-icon" />
              <p className="empty-title">No Leave Requests</p>
              <p className="empty-text">
                {filter === "all" 
                  ? "No leave requests to review at this time" 
                  : `No ${filter} requests found`}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request._id} className="request-card-enhanced">
                <div className="card-ribbon">
                  <div className={`status-badge-enhanced status-${request.status}`}>
                    {getStatusIcon(request.status)}
                    <span>{request.status}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="student-header">
                    <div className="student-avatar">
                      <User size={24} />
                    </div>
                    <div className="student-details">
                      <h3 className="student-name">{request.studentName}</h3>
                      <div className="student-meta">
                        <span className="roll-number">Roll: {request.studentRollNo}</span>
                        <span className="meta-divider">•</span>
                        <span className="leave-type-badge">{request.leaveType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-divider"></div>

                  <div className="request-info">
                    <div className="info-row">
                      <div className="info-icon">
                        <Calendar size={18} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Duration</span>
                        <span className="info-value">
                          {new Date(request.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })} - {new Date(request.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-icon">
                        <FileText size={18} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Reason</span>
                        <span className="info-value">{request.reason}</span>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-icon">
                        <Mail size={18} />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Parent Contact</span>
                        <span className="info-value">{request.parentEmail}</span>
                      </div>
                    </div>
                  </div>

                  {request.teacherComments && (
                    <div className="teacher-comments-enhanced">
                      <div className="comments-header-enhanced">
                        <MessageSquare size={18} />
                        <span>Your Comments</span>
                      </div>
                      <p className="comments-text-enhanced">{request.teacherComments}</p>
                    </div>
                  )}

                  <div className="card-footer">
                    <div className="footer-info">
                      <Clock size={14} />
                      <span>Submitted on {new Date(request.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="review-section-enhanced">
                      {editingRequest === request._id ? (
                        <div className="review-form">
                          <label className="form-label-enhanced">Add Comments (Optional)</label>
                          <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Provide feedback or additional information..."
                            rows={4}
                            className="comments-input-enhanced"
                          />
                          <div className="action-buttons-enhanced">
                            <button
                              onClick={() => handleStatusUpdate(request._id, "approved")}
                              className="btn-approve"
                              disabled={loading}
                            >
                              <CheckCircle size={18} />
                              <span>Approve Request</span>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request._id, "rejected")}
                              className="btn-reject"
                              disabled={loading}
                            >
                              <XCircle size={18} />
                              <span>Reject Request</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingRequest(null);
                                setComments("");
                              }}
                              className="btn-cancel"
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingRequest(request._id)}
                          className="btn-review"
                        >
                          <Edit size={18} />
                          <span>Review Request</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}