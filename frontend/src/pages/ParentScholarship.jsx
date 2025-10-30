import React, { useState, useEffect } from "react";
import axios from "axios";


export default function ParentScholarship() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParentScholarships = async () => {
      try {
        const parentData = JSON.parse(localStorage.getItem("parent"));
        if (!parentData) {
          setError("Parent data not found. Please login again.");
          setLoading(false);
          return;
        }

        // First get parent's children register numbers
        const studentResponse = await axios.get(
          `http://localhost:5000/api/assigned-students/parent/profile?parentEmail=${parentData.email}`
        );

        if (!studentResponse.data || studentResponse.data.length === 0) {
          setScholarships([]);
          setLoading(false);
          return;
        }

        const studentRegNos = studentResponse.data.map(student => student.regno);

        // Then fetch all scholarships and filter by children's register numbers
        const scholarshipResponse = await axios.get("http://localhost:5000/api/scholarships");

        const filteredScholarships = scholarshipResponse.data.filter(scholarship =>
          studentRegNos.includes(scholarship.regno)
        );

        setScholarships(filteredScholarships);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parent scholarships:", error);
        setError("Failed to load scholarship data. Please try again later.");
        setLoading(false);
      }
    };

    fetchParentScholarships();
  }, []);

  if (loading) {
    return (
      <div className="scholarship-page">
        <div className="scholarship-container">
          <h1>Your Child's Scholarships</h1>
          <div className="loading">Loading scholarship data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scholarship-page">
        <div className="scholarship-container">
          <h1>Your Child's Scholarships</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="scholarship-page">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .scholarship-page {
          min-height: 100vh;
          background: #ffffff;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .scholarship-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .scholarship-container h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #667eea 100%);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          text-align: center;
        }

        .loading, .error-message {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          font-size: 1.2rem;
          color: #6b7280;
        }

        .loading {
          color: #667eea;
          font-weight: 600;
        }

        .error-message {
          color: #ef4444;
          font-weight: 500;
        }

        .scholarship-list {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          overflow-x: auto;
        }

        .scholarship-list h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .empty-msg {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
          font-size: 1.1rem;
          font-style: italic;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        thead {
          background: linear-gradient(135deg, #667eea 0%, #667eea 100%);
          color: white;
        }

        th, td {
          padding: 1rem 0.75rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        th {
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        tbody tr {
          transition: all 0.3s;
        }

        tbody tr:hover {
          background: #f9fafb;
          transform: scale(1.01);
        }

        tbody tr:nth-child(even) {
          background: #f8fafc;
        }

        tbody tr:nth-child(even):hover {
          background: #f1f5f9;
        }

        td {
          color: #374151;
          font-weight: 500;
        }

        .amount-cell {
          font-weight: 700;
          color: #10b981;
        }

        .status-cell {
          text-transform: capitalize;
          font-weight: 600;
        }

        .status-approved {
          color: #10b981;
        }

        .status-pending {
          color: #f59e0b;
        }

        .status-rejected {
          color: #ef4444;
        }

        .regno-cell {
          font-family: 'Monaco', 'Menlo', monospace;
          font-weight: 600;
          color: #667eea;
        }

        .provider-cell {
          font-weight: 600;
          color: #1f2937;
        }

        .type-cell {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          display: inline-block;
          min-width: 80px;
        }

        .year-cell {
          font-weight: 600;
          color: #6b7280;
        }

        .date-cell {
          color: #6b7280;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .scholarship-page {
            padding: 1rem;
          }

          .scholarship-container h1 {
            font-size: 2rem;
            padding: 2rem;
          }

          .scholarship-list {
            padding: 1rem;
          }

          .scholarship-list h2 {
            font-size: 1.5rem;
          }

          table {
            font-size: 0.8rem;
          }

          th, td {
            padding: 0.75rem 0.5rem;
          }

          .type-cell {
            font-size: 0.75rem;
            min-width: 70px;
          }
        }

        @media (max-width: 480px) {
          .scholarship-container h1 {
            font-size: 1.8rem;
            padding: 1.5rem;
          }

          .scholarship-list {
            padding: 0.75rem;
          }

          table {
            font-size: 0.75rem;
          }

          th, td {
            padding: 0.5rem 0.25rem;
          }
        }
      `}</style>
      <div className="scholarship-container">
        <h1>Your Child's Scholarships</h1>

        <div className="scholarship-list">
          <h2>Scholarship Records</h2>
          {scholarships.length === 0 ? (
            <p className="empty-msg">No scholarship records found for your children.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Provider</th>
                  <th>Type</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map((s, index) => (
                  <tr key={index}>
                    <td className="regno-cell">{s.regno}</td>
                    <td className="provider-cell">{s.provider}</td>
                    <td><span className="type-cell">{s.type}</span></td>
                    <td className="year-cell">{s.year}</td>
                    <td className={`status-cell status-${s.status.toLowerCase()}`}>{s.status}</td>
                    <td className="date-cell">{s.appliedDate}</td>
                    <td className="amount-cell">₹{s.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}