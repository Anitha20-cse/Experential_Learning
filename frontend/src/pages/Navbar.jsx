import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

const NavbarStyles = `
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

/* ----------------- Navbar Container ----------------- */
.navbar-container {
    font-family: 'Inter', sans-serif;
    width: 100%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    position: relative;
}

/* -------- Top Help Bar -------- */
.top-bar {
    background: linear-gradient(to right, #1f2937, #374151);
    height: 32px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
}
.help-desk {
    color: #fff;
    font-size: 13px;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.3s;
}
.help-desk:hover { color: #fbbf24; }
.help-desk i { margin-right: 6px; font-size: 16px; }

/* -------- Main Header -------- */
.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;   /* ✅ changed from flex-start to center */
    background-color: #fff;
    padding: 12px 20px;
    flex-wrap: wrap;
}

/* Left Section: Logo + Text */
.logo-section {
    display: flex;
    align-items: center;
    justify-content: flex-start;  /* ✅ pushes logo fully to the left */
    gap: 10px;
    position: relative;
    margin-left: 0;               /* ✅ no extra left margin */
}


.college-logo {
    width: 320px;         /* adjust size to match your layout */
    height: auto;
    object-fit: contain;
    border: none;         /* ✅ removes border */
    border-radius: 0;     /* ✅ removes round edges */
    padding: 0;           /* ✅ removes padding */
    position: relative;
    top: 0;
    left: 0;
}

.college-text h1 {
    color: #1f2937;
    font-size: 26px;
    font-weight: 900;
    margin: 0;
    line-height: 1.1;
}
.college-text p {
    color: #4b5563;
    font-size: 12px;
    margin: 2px 0 0;
    font-weight: 500;
}

/* Right Section: Social + Code Image */
.right-elements {
    display: flex;
    align-items: center;         /* ✅ Centers vertically */
    justify-content: flex-end;   /* ✅ Pushes to the right side */
    gap: 25px;
    flex-wrap: wrap;
    margin-top: 0;               /* ✅ Removes extra top gap */
}



/* Social Icons */
.social-icons-list {
    display: flex;
    align-items: center;
    gap: 10px;
}
.social-icons-list a {
    color: #374151;
    font-size: 20px;
    padding: 6px;
    transition: all 0.3s;
}
.social-icons-list a:hover { transform: translateY(-3px); }
.social-icons-list a .fa-linkedin-in:hover { color: #0a66c2; }
.social-icons-list a .fa-facebook-f:hover { color: #1877f2; }
.social-icons-list a .fa-instagram:hover { color: #c32aa3; }
.social-icons-list a .fa-youtube:hover { color: #ff0000; }
.social-icons-list a .fa-x-twitter:hover { color: #000; }

/* -------- Code Image Block -------- */
.code-image {
    width: 290px;         /* Adjust width as needed */
    height: auto;
    object-fit: contain;
    border-radius: 12px;
    margin-top: -10px;    /* ✅ Slight lift to align perfectly */
}

/* -------- Navigation Bar -------- */
.navbar-links {
    background-color: #1d4ed8;
}
.navbar-links a {
    color: #fff;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s;
}
.navbar-links a:hover { background-color: #2563eb; color: #fff; }
.navbar-links a.active { background-color: #fbbf24; color: #1f2937; }

/* -------- Responsive -------- */
@media (max-width: 1024px) {
    .main-header { flex-direction: column; text-align: center; }
    .right-elements { justify-content: center; margin-top: 15px; }
}
@media (max-width: 600px) {
    .college-text h1 { font-size: 22px; }
    .main-header { padding: 10px; }
    .top-bar { padding: 0 10px; }
    .social-icons-list a { font-size: 18px; padding: 4px; }
    .code-image { width: 150px; }
}
`;

export default function Navbar() {
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = NavbarStyles;
        style.id = "navbar-custom-styles";
        document.head.appendChild(style);
        return () => {
            const existingStyle = document.getElementById("navbar-custom-styles");
            if (existingStyle) document.head.removeChild(existingStyle);
        };
    }, []);

    return (
        <div className="navbar-container">



            {/* Main Header */}
            <div className="main-header">

                {/* Left: Logo + College Name */}
                <div className="logo-section">
                    <img
                        src="/images/logoooo.png"
                        alt="College Logo"
                        className="college-logo"
                    />
                    
                </div>

                {/* Right: Custom Code Image */}
                <div className="right-elements">
                    {/* ✅ Replace TNEA + Chair with your image */}
                    <img
                        src="/images/code.jpeg"
                        alt="TNEA Code Banner"
                        className="code-image"
                    />
                </div>
            </div>

            {/* Navigation Bar */}
            <nav className="navbar-links">
                <div className="max-w-7xl mx-auto flex flex-wrap space-x-6 py-3 px-4">
                    {["Home", "About Us", "Facilities", "Placements", "Admission", "Login"].map((item, idx) => (
                        <NavLink
                            key={idx}
                            to={`/${item.toLowerCase().replace(/\s+/g, "")}`}
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            {item}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </div>
    );
}
