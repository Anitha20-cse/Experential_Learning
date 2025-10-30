import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AnnouncementPage.css";

const ParentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [search, date]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (date) params.date = date;

      const parentData = JSON.parse(localStorage.getItem("parent"));
      const headers = {};
      if (parentData) {
        headers['x-user-role'] = 'parent';
        headers['x-user-email'] = parentData.email;
      }

      const res = await axios.get("https://experential-learning.onrender.com/api/announcements", {
        params,
        headers,
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="announcement-page">
      <h1 className="title">📢 Announcements</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchData}>Filter</button>
      </div>

      <div className="announcement-grid">
        {announcements.map((a) => (
          <div key={a._id} className="announcement-card">
            <span className="date">
              {new Date(a.date).toLocaleDateString()}
            </span>
            <h2>{a.title}</h2>
            <p>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentAnnouncements;
