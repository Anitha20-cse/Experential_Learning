// frontend/src/pages/Admission.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Admission.css';

const Admission = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className={`admission-container ${isVisible ? 'fade-in' : ''}`}>
      
      {/* Animated Hero Section */}
      <section className="hero-section" ref={addToRefs}>
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="hero-content">
         
         
          <div className="scroll-indicator">
            <div className="scroll-arrow"></div>
          </div>
        </div>
      </section>

      {/* Main Documents Section */}
      <section className="documents-section" ref={addToRefs}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Documents Required</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Documents to be produced at the time of admission</p>
          </div>

          <div className="documents-grid">
            {[
              "Provisional allotment order-TNEA 2025 (color printout)",
              "10th marksheet",
              "11th and 12th mark sheets",
              "Transfer certificate and conduct certificate obtained from the institution last studied",
              "Permanent community certificate for BC/BCM/MBC/DNC/SC/SCA/ST candidates (permanent card or digitally signed e-certificate)",
              "Income certificate for post-metric scholarship (for SC/SCA/ST and SC/SCA converted Christians)",
              "Four copies of the passport-size photograph",
              "Student Aadhaar card copy"
            ].map((doc, index) => (
              <div key={index} className="doc-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-inner">
                  <div className="doc-number">{index + 1}</div>
                  <div className="doc-content">
                    <p>{doc}</p>
                  </div>
                  <div className="card-hover-effect"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="note-card" ref={addToRefs}>
            <div className="note-icon">📝</div>
            <div className="note-content">
              <h4>Important Note</h4>
              <p>All the certificates mentioned above, along with two photocopies sets, are to be submitted (except serial number: 7).</p>
            </div>
            <div className="pulse-dot"></div>
          </div>
        </div>
      </section>

      {/* Additional Documents Section */}
      <section className="additional-section" ref={addToRefs}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Additional Documents</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">For First Graduate Students</p>
          </div>

          <div className="additional-cards">
            <div className="additional-card" ref={addToRefs}>
              <div className="card-icon">🎓</div>
              <div className="card-content">
                <h3>First Graduate Certificate</h3>
                <p>First Graduate Certificate (Minimum Seven members entry should be present in it) and Joint declaration.</p>
              </div>
              <div className="card-wave"></div>
            </div>

            <div className="additional-card" ref={addToRefs}>
              <div className="card-icon">📋</div>
              <div className="card-content">
                <h3>Bonafide Certificate</h3>
                <p>If Candidate's Brother/Sister is pursuing a Degree (mentioned in First Graduate Certificate), then he/she should obtain a Bonafide Certificate from the college (where the Brother/Sister is studying) that he/she has not availed of the First graduate fee concession.</p>
              </div>
              <div className="card-wave"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section" ref={addToRefs}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Visit Our Campus</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Find us at our beautiful campus location</p>
          </div>

          <div className="map-content">
            <div className="map-container" ref={addToRefs}>
              <div className="map-frame">
                <div className="map-overlay">
                  <div className="location-pin">
                    <div className="pin"></div>
                    <div className="pulse-ring"></div>
                  </div>
                  <h3>National Engineering College</h3>
                  <p>K.R. Nagar, Kovilpatti, Thoothukudi District</p>
                  <a 
                    href="https://www.google.com/maps/place/National+Engineering+College/@9.1483528,77.8321569,861m/data=!3m1!1e3!4m6!3m5!1s0x3b06ae08c6794e85:0xea30f98dcb16c4f5!8m2!3d9.148351!4d77.8321571!16zL20vMDNfeGJn?entry=ttu&g_ep=EgoyMDI1MTAwNy4wIKXMDSoASAFQAw%3D%3D" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-button"
                  >
                    <span>View on Google Maps</span>
                    <div className="button-arrow">→</div>
                  </a>
                </div>
              </div>
            </div>

            <div className="address-info" ref={addToRefs}>
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h4>Campus Address</h4>
                  <div className="address-details">
                    <p><strong>National Engineering College</strong></p>
                    <p>K.R. Nagar, Kovilpatti</p>
                    <p>Thoothukudi District, Tamil Nadu - 628503</p>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <h4>Contact Information</h4>
                  <div className="contact-details">
                    <p>Phone: +91-1234-567890</p>
                    <p>Email: admission@nec.edu.in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admission;