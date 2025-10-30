import React, { useEffect, useState } from "react";

const ParentAttendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Your actual axios API call - keep this exactly as is
      const parentData = JSON.parse(localStorage.getItem("parent"));
      const headers = {};
      if (parentData) {
        headers['x-user-role'] = 'parent';
        headers['x-user-email'] = parentData.email;
      }
      
      // Replace with: const res = await axios.get("https://experential-learning.onrender.com/api/attendance", { headers });
      // For demo, using fetch:
      const res = await fetch("https://experential-learning.onrender.com/api/attendance", { headers });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Group students by rollNo and type
  const groupStudentsByRollNo = () => {
    const grouped = {};
    students.forEach(record => {
      const key = `${record.rollNo}-${record.type}`;
      if (!grouped[key]) {
        grouped[key] = {
          rollNo: record.rollNo,
          name: record.name,
          type: record.type,
          month: record.month,
          year: record.year,
          records: []
        };
      }
      grouped[key].records.push(record);
    });
    return Object.values(grouped);
  };

  const getAttendanceColor = (percentage) => {
    const value = parseFloat(percentage);
    if (value >= 90) return '#10b981';
    if (value >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const getAttendanceEmoji = (percentage) => {
    const value = parseFloat(percentage);
    if (value >= 90) return '🌟';
    if (value >= 75) return '👍';
    return '⚠️';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading attendance records...</p>
      </div>
    );
  }

  const groupedStudents = groupStudentsByRollNo();

  return (
    <div className="attendance-container">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <div className="icon-large">📊</div>
            <div>
              <h1 className="page-title">Children's Attendance Reports</h1>
              <p className="page-subtitle">View attendance records uploaded by teachers</p>
            </div>
          </div>
        </div>
      </div>

      {groupedStudents.length === 0 ? (
        <div className="no-data">
          <div className="no-data-icon">📅</div>
          <h3>No Attendance Records</h3>
          <p>Teachers haven't uploaded any attendance data yet</p>
        </div>
      ) : (
        <div className="attendance-grid">
          {groupedStudents.map((group, index) => (
            <div 
              key={`${group.rollNo}-${group.type}`} 
              className="attendance-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header">
                <div className="student-info">
                  <div className="student-avatar">
                    {group.name ? group.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h3 className="student-name">{group.name || 'Unknown'}</h3>
                    <p className="student-roll">Roll No: {group.rollNo}</p>
                  </div>
                </div>
                <div className="report-badge">
                  {group.type === 'month-wise' ? '📅 Monthly' : '📈 Consolidate'}
                </div>
              </div>

              {group.type === 'month-wise' && group.month && (
                <div className="period-info">
                  <span className="period-icon">🗓️</span>
                  <span className="period-text">{group.month} {group.year}</span>
                </div>
              )}

              {group.type === 'consolidated' && group.year && (
                <div className="period-info consolidated">
                  <span className="period-icon">📊</span>
                  <span className="period-text">Full Year {group.year}</span>
                </div>
              )}

              <div className="attendance-details">
                {group.records.length > 0 && group.records[0].dynamicFields && (
                  <div className="dynamic-fields">
                    {Object.keys(group.records[0].dynamicFields).map(key => {
                      const value = group.records.find(record => 
                        record.dynamicFields && record.dynamicFields[key] !== undefined
                      )?.dynamicFields[key] || 'N/A';
                      
                      const isPercentage = key.toLowerCase().includes('percentage');
                      const percentageValue = isPercentage ? value : null;

                      return (
                        <div key={key} className="field-item">
                          <div className="field-header">
                            <span className="field-label">{key}</span>
                            {isPercentage && percentageValue && (
                              <span className="emoji-indicator">
                                {getAttendanceEmoji(percentageValue)}
                              </span>
                            )}
                          </div>
                          <div 
                            className="field-value"
                            style={isPercentage && percentageValue ? {
                              color: getAttendanceColor(percentageValue),
                              fontWeight: '700',
                              fontSize: '1.5rem'
                            } : {}}
                          >
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="card-footer">
                <span className="uploaded-by">📤 Uploaded by Teacher</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .attendance-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: #475569;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .page-header {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-large {
          font-size: 3.5rem;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 0.95rem;
        }

        .no-data {
          background: white;
          border-radius: 16px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }

        .no-data-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-data h3 {
          color: #334155;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .no-data p {
          color: #64748b;
          font-size: 1rem;
        }

        .attendance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
        }

        .attendance-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .attendance-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .student-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }

        .student-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .student-roll {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .report-badge {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .period-info {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }

        .period-info.consolidated {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
        }

        .period-icon {
          font-size: 1.2rem;
        }

        .period-text {
          color: #1e40af;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .consolidated .period-text {
          color: #9f1239;
        }

        .attendance-details {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .dynamic-fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1.25rem;
        }

        .field-item {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 1.25rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          border-left: 4px solid #667eea;
        }

        .field-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .field-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .field-label {
          color: #475569;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .emoji-indicator {
          font-size: 1.2rem;
        }

        .field-value {
          color: #1e293b;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .card-footer {
          padding-top: 1rem;
          margin-top: 1rem;
          border-top: 2px solid #f1f5f9;
        }

        .uploaded-by {
          color: #94a3b8;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 1024px) {
          .attendance-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .attendance-container {
            padding: 1rem;
          }

          .page-header {
            padding: 1.5rem;
          }

          .title-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .icon-large {
            font-size: 2.5rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .attendance-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .report-badge {
            align-self: flex-start;
          }

          .dynamic-fields {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .student-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .field-value {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ParentAttendance;