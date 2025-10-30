import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExamSchedule.css";
import { FaFileAlt } from "react-icons/fa";

const examTypes = ["PT Exam", "CAT Exam", "Lab Exam", "End Sem Exam"];

export default function ParentExamSchedule() {
  const [exams, setExams] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const parentData = JSON.parse(localStorage.getItem("parent"));
      const headers = {};
      if (parentData) {
        headers['x-user-role'] = 'parent';
        headers['x-user-email'] = parentData.email;
      }

      const res = await axios.get("http://localhost:5000/api/exams", { headers });
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const renderCards = (type) => {
    const filtered = exams.filter((exam) => exam.examType === type);
    if (filtered.length === 0) {
      return (
        <div className="exam-empty-state">
          <div className="exam-empty-icon">📋</div>
          <p className="exam-empty-text">No exams added yet.</p>
        </div>
      );
    }

    return (
      <div className="exam-cards-list">
        {filtered.map((exam) => (
          <div className="exam-card" key={exam._id}>
            <div className="exam-card-content">
              <div className="exam-card-info">
                <div className="exam-card-title-row">
                  <span className="exam-card-emoji">📄</span>
                  <h3 className="exam-card-title">{exam.examName}</h3>
                </div>
                <div className="exam-card-details">
                  <div className="exam-card-detail">
                    <span className="exam-card-icon exam-card-icon-blue">📅</span>
                    <span><strong>Semester:</strong> {exam.semester}</span>
                  </div>
                  <div className="exam-card-detail">
                    <span className="exam-card-icon exam-card-icon-green">🗓️</span>
                    <span><strong>Start Date:</strong> {new Date(exam.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="exam-card-actions">
                {exam.file && (
                  <button
                    className="exam-action-btn exam-view-btn"
                    onClick={() =>
                      setPdfPreview(`http://localhost:5000${exam.file}`)
                    }
                    title="View PDF"
                  >
                    <FaFileAlt size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="exam-schedule-container">
        <div className="exam-schedule-wrapper">
          <div className="exam-header">
            <div className="exam-header-content">
              <div className="exam-header-left">
                <div className="exam-icon-wrapper">
                  <span className="exam-icon">📅</span>
                </div>
                <div className="exam-title-section">
                  <h1>Exam Schedule</h1>
                  <p>Loading exam schedules...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-schedule-container">
      <div className="exam-schedule-wrapper">
        <div className="exam-header">
          <div className="exam-header-content">
            <div className="exam-header-left">
              <div className="exam-icon-wrapper">
                <span className="exam-icon">📅</span>
              </div>
              <div className="exam-title-section">
                <h1>Exam Schedule</h1>
                <p>View exam schedules uploaded by teachers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="exam-sections-grid">
          {examTypes.map((type, idx) => (
            <div className="exam-section-card" key={idx}>
              <div className={`exam-section-header exam-section-header-${idx === 0 ? 'blue' : idx === 1 ? 'green' : idx === 2 ? 'purple' : 'red'}`}>
                <span className="exam-section-emoji">
                  {idx === 0 ? '📝' : idx === 1 ? '📊' : idx === 2 ? '🧪' : '🎓'}
                </span>
                <h2 className="exam-section-title">{type}</h2>
              </div>
              <div className="exam-section-body">
                {renderCards(type)}
              </div>
            </div>
          ))}
        </div>

        {pdfPreview && (
          <div className="exam-pdf-modal" onClick={() => setPdfPreview(null)}>
            <button className="exam-pdf-close" onClick={() => setPdfPreview(null)}>×</button>
            <iframe
              src={pdfPreview}
              className="exam-pdf-iframe"
              title="PDF Preview"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
