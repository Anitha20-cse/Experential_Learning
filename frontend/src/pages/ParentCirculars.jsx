import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Calendar, Tag, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ParentCirculars.css";

export default function ParentCirculars() {
  const { t } = useTranslation();
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const res = await axios.get("https://experential-learning.onrender.com/api/circulars");
      setCirculars(res.data);
    } catch (err) {
      console.error("Error fetching circulars:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Leave", "Celebration", "Competition", "Others"];

  const filteredCirculars = activeCategory === "All"
    ? circulars
    : circulars.filter(c => c.category === activeCategory);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loadingCirculars')}</p>
      </div>
    );
  }

  return (
    <div className="parent-circulars-container">
      <div className="circulars-header">
        <div className="header-icon">
          <FileText size={40} />
        </div>
        <div className="header-content">
          <h1>{t('circularsAnnouncements')}</h1>
          <p>{t('stayUpdated')}</p>
        </div>
      </div>

      <div className="circulars-stats">
        <div className="stat-card">
          <FileText className="stat-icon" />
          <div className="stat-info">
            <div className="stat-value">{circulars.length}</div>
            <div className="stat-label">{t('totalCirculars')}</div>
          </div>
        </div>
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="circulars-grid">
        {filteredCirculars.length === 0 ? (
          <div className="empty-state">
            <FileText className="empty-icon" />
            <h3>{t('noCircularsFound')}</h3>
            <p>{t('circularsAppearHere')}</p>
          </div>
        ) : (
          filteredCirculars.map((circular, index) => (
            <div key={index} className="circular-card">
              <div className="circular-header">
                <div className="circular-icon">
                  <FileText />
                </div>
                <div className="circular-title-section">
                  <h3>{circular.title}</h3>
                  <div className="circular-meta">
                    <span className="circular-category">
                      <Tag size={14} />
                      {circular.category}
                    </span>
                    <span className="circular-date">
                      <Calendar size={14} />
                      {new Date(circular.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="circular-content">
                <p>{circular.description}</p>
              </div>

              {circular.file && (
                <div className="circular-actions">
                  <button
                    className="download-btn"
                    onClick={() => window.open(`https://experential-learning.onrender.com${circular.file}`, '_blank')}
                  >
                    <Download size={16} />
                    {t('viewPDF')}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
