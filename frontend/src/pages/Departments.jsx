import React from "react";
import { useNavigate } from "react-router-dom";
import "./Departments.css";

const Departments = () => {
  const navigate = useNavigate();

  const departments = [
    { name: "CSE", active: true },
    { name: "ECE", active: true },
    { name: "MECH", active: true },
    { name: "AIDS", active: true },
    { name: "S&H", active: true },
    { name: "IT", active: true },
    { name: "EEE", active: true },
  ];

  return (
    <div className="departments-container">
      <h1 className="departments-title">Select Department</h1>
      <div className="departments-grid">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className={`department-card ${dept.active ? "active" : "disabled"}`}
            onClick={() =>
              dept.active && navigate(`/admin/add-teachers/${dept.name}`)
            }
          >
            <h2>{dept.name}</h2>
            {!dept.active && <p className="coming-soon">Coming Soon</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
