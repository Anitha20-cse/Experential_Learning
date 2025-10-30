import React, { useEffect, useState } from "react";

export default function ParentTimetable() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("regular");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchTimetables();
  }, [viewType]);

  const fetchTimetables = () => {
    const parentData = JSON.parse(localStorage.getItem("parent"));
    const headers = {};
    if (parentData) {
      headers["x-user-role"] = "parent";
      headers["x-user-email"] = parentData.email;
      headers["x-timetable-type"] = viewType;
    }

    fetch("http://localhost:5000/api/timetable", { headers })
      .then((res) => res.json())
      .then((data) => {
        setTimetables(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTopColor: 'blue',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{fontSize: '1.2rem', color: '#667eea', fontWeight: '600'}}>Loading Timetables...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .timetable-header {
          background: linear-gradient(135deg, #667eea 0%,#667eea 100%);
          border-radius: 16px;
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          color: white;
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .view-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          max-width: 400px;
        }

        .view-toggle label {
          font-weight: 600;
          color: white;
          font-size: 1.1rem;
        }

        .view-toggle select {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.95);
          font-size: 1rem;
          font-weight: 600;
          color:blue;
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-toggle select:hover {
          background: white;
          border-color: white;
        }

        .view-toggle select:focus {
          outline: none;
          background: white;
          border-color: white;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }

        .stats-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          border-left: 4px solid blue;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: blue;
        }

        .timetable-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 2rem;
        }

        .timetable-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
        }

        .timetable-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.25);
        }

        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #667eea 100%);
          padding: 1.5rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .card-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .semester-heading {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .image-container {
          position: relative;
          overflow: hidden;
          background: #f3f4f6;
        }

        .timetable-image {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.4s ease;
        }

        .timetable-card:hover .timetable-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 2rem;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .timetable-card:hover .image-overlay {
          opacity: 1;
        }

        .enlarge-btn {
          background: white;
          color: #667eea;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .enlarge-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
          background: #667eea;
          color: white;
        }

        .card-footer {
          padding: 1rem 1.5rem;
          background: #f9fafb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #e5e7eb;
        }

        .view-count {
          font-size: 0.9rem;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .download-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .download-btn:hover {
          background: #5568d3;
          transform: translateY(-2px);
        }

        .no-timetable {
          grid-column: 1 / -1;
          text-align: center;
          padding: 5rem 2rem;
          background: white;
          border-radius: 16px;
          color: #6b7280;
          font-size: 1.2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .no-timetable-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.3s;
          cursor: zoom-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          position: relative;
          max-width: 95vw;
          max-height: 95vh;
          animation: zoomIn 0.3s;
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-header {
          position: absolute;
          top: -60px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          z-index: 10;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          font-size: 1.5rem;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg) scale(1.1);
        }

        .modal-image {
          max-width: 100%;
          max-height: 90vh;
          width: auto;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 768px) {
          .main-title {
            font-size: 1.8rem;
          }

          .timetable-gallery {
            grid-template-columns: 1fr;
          }

          .modal-header {
            position: static;
            margin-bottom: 1rem;
          }
        }
      `}</style>

      <div className="timetable-header">
        <h1 className="main-title">
          📅 Class Timetables
        </h1>
        <p className="subtitle">View your child's class schedule and timings</p>

        <div className="view-toggle">
          <label htmlFor="view-type">📋 View:</label>
          <select
            id="view-type"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="regular">Regular Timetables</option>
            <option value="saturday">Saturday Timetables</option>
          </select>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-label">Total Timetables</div>
          <div className="stat-value">{timetables.length}</div>
        </div>
        <div className="stat-card" style={{borderLeftColor: '#764ba2'}}>
          <div className="stat-label">Current View</div>
          <div className="stat-value" style={{color: '#764ba2', fontSize: '1.3rem'}}>
            {viewType === "regular" ? "Regular" : "Saturday"}
          </div>
        </div>
        <div className="stat-card" style={{borderLeftColor: '#10b981'}}>
          <div className="stat-label">Status</div>
          <div className="stat-value" style={{color: '#10b981', fontSize: '1.3rem'}}>Active</div>
        </div>
      </div>

      <div className="timetable-gallery">
        {timetables.length > 0 ? (
          timetables.map((t) => (
            <div className="timetable-card" key={t._id} onClick={() => setSelectedImage(t)}>
              <div className="card-header">
                <h2 className="semester-heading">
                  📖 {t.semester}
                </h2>
              </div>
              <div className="image-container">
                <img
                  src={`http://localhost:5000${t.imageUrl}`}
                  alt={t.semester}
                  className="timetable-image"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
                <div className="image-overlay">
                  
                </div>
              </div>
              <div className="card-footer">
                <span className="view-count">
                  👁️ Click to view full size
                </span>
                <button className="download-btn" onClick={(e) => {
                  e.stopPropagation();
                  console.log('Download', t.semester);
                }}>
                  ⬇️ Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-timetable">
            <div className="no-timetable-icon">📚</div>
            <p>No {viewType === "regular" ? "Regular" : "Saturday"} timetables found.</p>
            <p style={{fontSize: '1rem', marginTop: '0.5rem'}}>Please check back later or contact your teacher.</p>
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedImage.semester}</h2>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>
                ✕
              </button>
            </div>
            <img
              src={`http://localhost:5000${selectedImage.imageUrl}`}
              alt={selectedImage.semester}
              className="modal-image"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}