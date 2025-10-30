// frontend/src/pages/Placement.jsx
import React, { useState, useEffect } from 'react';
import './Placement.css';

const Placement = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`placement-container ${isVisible ? 'fade-in' : ''}`}>
      
      {/* Animated Hero Section */}
      <section className="placement-hero">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
          <div className="gradient-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-aboutus">
              
            </h1>

          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Additional Image */}
      <section className="additional-image-section">
        <div className="container">
          <img src="/images/2025.png" alt="2025" className="additional-image" />
        </div>
      </section>

      {/* Main Content with Animations */}
      <section className="placement-content">
        <div className="container">
          <div className="content-card">
            <div className="card-header">
              <div className="header-icon">🎯</div>
              <h2>Welcome to Our Placement Program</h2>
            </div>
            
            <div className="animated-paragraphs">
              <div className="text-block fade-in-up">
                <div className="text-icon">👥</div>
                <p>
                  Welcome to Placement program of National Engineering College. This program consists of a dedicated and efficient placement team of students and staff who function round the year to ensure that students are placed in reputed companies across the country.
                </p>
              </div>

              <div className="text-block fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="text-icon">🎓</div>
                <p>
                  Continuous placement training is offered to equip the students on communication, soft skills, confidence building, interview skills and test of reasoning by experts in the respective fields. Career development programs are regularly conducted through accomplished resource persons across a broad spectrum of industries.
                </p>
              </div>

              <div className="text-block fade-in-up" style={{animationDelay: '0.6s'}}>
                <div className="text-icon">🏆</div>
                <p>
                  The Placement Centre strives to achieve 100% placements year on year. The students are also motivated and equipped to participate in the Campus placement programs. Renowned companies with attractive salary packages are invited to the campus recruitment drive. Companies which are part of on-campus placements are from Software and Core Engineering industry.
                </p>
              </div>
              <img src="/images/details.png" alt="Details" className="details-image" />
            </div>

            {/* Stats Section */}
          
          </div>
        </div>
      </section>


      {/* Functions of Placement Centre Section */}
      <section className="functions-section">
        <div className="container">
          <div className="functions-card">
            <div className="card-header">
              <div className="header-icon">⚙️</div>
              <h2>Functions of Placement Centre</h2>
            </div>
            <div className="functions-list">
              <div className="function-item">
                <div className="function-icon">🎯</div>
                <p>To Organize On / Off campus Interviews for the final year students</p>
              </div>
              <div className="function-item">
                <div className="function-icon">🤝</div>
                <p>To Promote Industry Institute Interface activities.</p>
              </div>
              <div className="function-item">
                <div className="function-icon">💬</div>
                <p>To Arrange Career / Personal Counselling sessions.</p>
              </div>
              <div className="function-item">
                <div className="function-icon">🚀</div>
                <p>To Organize Career Guidance sessions and Personality development programs.</p>
              </div>
              <div className="function-item">
                <div className="function-icon">🛠️</div>
                <p>To Organize Functional Skill Development Program.</p>
              </div>
              <div className="function-item">
                <div className="function-icon">📚</div>
                <p>To Organize Placement training Programs like Aptitude programs, Life skills programs, Motivational sessions, Resume Writing, Group discussions, Mock Interviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-card">
            <div className="card-header">
              <div className="header-icon">📞</div>
              <h2>Contact Us</h2>
            </div>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-info">
                  <strong>Email:</strong> placement@nec.edu.in
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div className="contact-info">
                  <strong>Phone:</strong> 04632 – 226955, 222502 ext:1062 & 1025
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🌐</div>
                <div className="contact-info">
                  <strong>Website:</strong> <a href="http://www.nec.edu.in" target="_blank" rel="noopener noreferrer">www.nec.edu.in</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">👨‍🏫</div>
                <div className="contact-info">
                  <strong>Placement Convener:</strong> Dr.V.Manimaran – 94432 30265
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">👥</div>
                <div className="contact-info">
                  <strong>Placement Coordinators:</strong><br />
                  Dr.D.Vigneshkumar – 90039 43550<br />
                  Mr.M.Sathiskumar – 99526 51676
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Placement;