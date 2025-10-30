// src/TopRanks.jsx
import React, { useEffect, useState } from "react";

export default function TopRanks() {
  const [ranks, setRanks] = useState([]);

  useEffect(() => {
    fetch("https://experential-learning.onrender.com/api/dashboard/top-ranks")
      .then((res) => res.json())
      .then((data) => setRanks(data))
      .catch((err) => console.error("❌ Error fetching ranks:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🏆 Top 3 Ranks</h1>
      <ul>
        {ranks.map((s, i) => (
          <li key={i}>
            {s.name} - Rank {s.rank}
          </li>
        ))}
      </ul>
    </div>
  );
}
