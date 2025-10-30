import React, { useState, useEffect } from "react";
import axios from "axios";
import { Building, Calendar, Users, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ParentDrives.css";

export default function ParentDrives() {
  const { t } = useTranslation();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState("All");

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const parentData = JSON.parse(localStorage.getItem("parent"));
      const headers = {
        'x-user-role': 'parent',
        'x-user-email': parentData.email,
      };
      const res = await axios.get(
        `http://localhost:5000/api/drives?department=${filterDept}`,
        { headers }
      );
      setDrives(res.data);
    } catch (err) {
      console.error("Error fetching drives:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [filterDept]);

  const departments = ["All", "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading placement drives...</p>
      </div>
    );
  }

  return (
    <div className="parent-drives-container">
      <div className="drives-header">
        <div className="header-icon">
          <Building size={40} />
        </div>
        <div className="header-content">
          <h1>{t('placementDrives')}</h1>
          <p>{t('viewPlacementOpportunities')}</p>
        </div>
      </div>

      <div className="drives-stats">
        <div className="stat-card">
          <Building className="stat-icon" />
          <div className="stat-info">
            <div className="stat-value">{drives.length}</div>
            <div className="stat-label">{t('totalDrives')}</div>
          </div>
        </div>
      </div>

      <div className="department-filters">
        {departments.map(dept => (
          <button
            key={dept}
            className={`dept-btn ${filterDept === dept ? 'active' : ''}`}
            onClick={() => setFilterDept(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="drives-grid">
        {drives.length === 0 ? (
          <div className="empty-state">
            <Building className="empty-icon" />
            <h3>{t('noDrivesFound')}</h3>
            <p>{t('drivesAppearHere')}</p>
          </div>
        ) : (
          drives.map((drive, index) => (
            <div key={index} className="drive-card">
              <div className="drive-header">
                <div className="drive-icon">
                  <Building />
                </div>
                <div className="drive-title-section">
                  <h3>{drive.name}</h3>
                  <div className="drive-meta">
                    <span className="drive-date">
                      <Calendar size={14} />
                      {new Date(drive.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="drive-details">
                <div className="detail-item">
                  <Users size={16} />
                  <span>Departments: {drive.departments.join(", ")}</span>
                </div>
              </div>

              <div className="drive-actions">
                <button
                  className="download-btn"
                  onClick={() => window.open(`http://localhost:5000${drive.file}`, '_blank')}
                >
                  <Download size={16} />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
