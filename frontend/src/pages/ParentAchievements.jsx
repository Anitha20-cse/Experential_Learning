import React, { useState, useEffect } from "react";
import axios from "axios";
import { Award, Calendar, Trophy, MapPin, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ParentAchievements.css";

export default function ParentAchievements() {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get("https://experential-learning.onrender.com/api/achievements");
      setAchievements(res.data);
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loadingAchievements')}</p>
      </div>
    );
  }

  return (
    <div className="parent-achievements-container">
      <div className="achievements-header">
        <div className="header-icon">
          <Trophy size={40} />
        </div>
        <div className="header-content">
          <h1>{t('studentAchievements')}</h1>
          <p>{t('viewAchievements')}</p>
        </div>
      </div>

      <div className="achievements-stats">
        <div className="stat-card">
          <Award className="stat-icon" />
          <div className="stat-info">
            <div className="stat-value">{achievements.length}</div>
            <div className="stat-label">{t('totalAchievements')}</div>
          </div>
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.length === 0 ? (
          <div className="empty-state">
            <Award className="empty-icon" />
            <h3>{t('noAchievementsFound')}</h3>
            <p>{t('achievementsAppearHere')}</p>
          </div>
        ) : (
          achievements.map((achievement, index) => (
            <div key={index} className="achievement-card">
              <div className="achievement-header">
                <div className="achievement-icon">
                  <Trophy />
                </div>
                <div className="achievement-title-section">
                  <h3>{achievement.name}</h3>
                  <span className="achievement-category">{achievement.category}</span>
                </div>
              </div>

              <div className="achievement-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{achievement.eventName}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{achievement.college}</span>
                </div>
                <div className="detail-item">
                  <Award size={16} />
                  <span>{achievement.prize}</span>
                </div>
                {achievement.cashPrize > 0 && (
                  <div className="detail-item">
                    <DollarSign size={16} />
                    <span>₹{achievement.cashPrize}</span>
                  </div>
                )}
              </div>

              <div className="achievement-footer">
                <div className="achievement-date">
                  {new Date(achievement.eventDate).toLocaleDateString()}
                </div>
                <div className="achievement-dept">
                  {achievement.deptYear}
                </div>
              </div>

              {achievement.file && (
                <div className="achievement-image">
                  <img
                    src={`https://experential-learning.onrender.com/uploads/${achievement.file}`}
                    alt="Achievement"
                    onClick={() => window.open(`https://experential-learning.onrender.com/uploads/${achievement.file}`, '_blank')}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
