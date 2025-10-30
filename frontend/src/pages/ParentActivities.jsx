import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ParentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = () => {
    const parentData = JSON.parse(localStorage.getItem("parent"));
    const headers = {};
    if (parentData) {
      headers['x-user-role'] = 'parent';
      headers['x-user-email'] = parentData.email;
    }

    axios
      .get("https://experential-learning.onrender.com/api/activities", { headers })
      .then((res) => setActivities(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <>
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 1rem;
            background: white;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #f1f5f9;
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
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className="activities-page">
        <h2>🎉 Student Activities</h2>

        <div className="activities-list">
          {activities.map((act, index) => (
            <div 
              key={act._id} 
              className="activity-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {act.image && (
                <div className="image-wrapper">
                  <img src={act.image} alt={act.title} />
                </div>
              )}
              <div className="card-content">
                <h3>{act.title}</h3>
                <p className="activity-date">
                  <b>Date:</b>{" "}
                  {new Date(act.date).toLocaleDateString()}
                </p>
                <p>{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .activities-page {
          min-height: 100vh;
          background: white;
          padding: 2.5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .activities-page h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2.5rem;
          text-align: center;
          padding-bottom: 1.5rem;
          border-bottom: 3px solid #e2e8f0;
          position: relative;
        }

        .activities-page h2::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .activities-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .activity-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
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

        .activity-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }

        .image-wrapper {
          width: 100%;
          height: 240px;
          overflow: hidden;
          position: relative;
          background: #f1f5f9;
        }

        .image-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.05) 100%);
          pointer-events: none;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .activity-card:hover .image-wrapper img {
          transform: scale(1.08);
        }

        .card-content {
          padding: 1.75rem;
        }

        .card-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .activity-date {
          color: #475569;
          font-size: 0.95rem;
          margin-bottom: 1.25rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .activity-date b {
          color: #1e293b;
          font-weight: 600;
        }

        .card-content p {
          color: #475569;
          font-size: 1rem;
          line-height: 1.7;
        }

        @media (max-width: 1024px) {
          .activities-list {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .activities-page {
            padding: 1.5rem;
          }

          .activities-page h2 {
            font-size: 2rem;
            margin-bottom: 2rem;
          }

          .activities-list {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .image-wrapper {
            height: 200px;
          }

          .card-content h3 {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .activities-page {
            padding: 1rem;
          }

          .activities-page h2 {
            font-size: 1.75rem;
          }

          .card-content {
            padding: 1.5rem;
          }

          .card-content h3 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
}