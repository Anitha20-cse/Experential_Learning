import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

export default function SplashScreen() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2500);
    const timer2 = setTimeout(() => navigate("/home"), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className={`splash-container ${fadeOut ? "fade-out" : ""}`}>
      <img src="/images/logo.png" alt="College Logo" className="splash-logo" />
      <h2 className="splash-text">
        <span className="highlight">N</span>ational{" "}
        <span className="highlight">E</span>ngineering{" "}
        <span className="highlight">C</span>ollege
      </h2>
      <p className="splash-sub">Estd : 1984</p>
    </div>
  );
}
