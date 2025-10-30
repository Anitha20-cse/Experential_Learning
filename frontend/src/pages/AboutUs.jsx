import React, { useEffect, useState, useRef } from "react";
import necBackground from '/nec-background.png';
import necLogo from '/images/nec-logo.png';
function Counter({ target, label }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 50));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(start);
    }, 50);
    return () => clearInterval(timer);
  }, [target, isVisible]);

  return (
    <div ref={counterRef} style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ 
        fontSize: '4rem', 
        fontWeight: '700', 
        color: '#2c5282',
        marginBottom: '0.5rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        {count.toLocaleString()}+
      </div>
      <div style={{ 
        fontSize: '1.2rem', 
        color: '#4a5568',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
    </div>
  );
}

export default function AboutUs() {
  const styles = {
    pageWrapper: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#2d3748',
      backgroundColor: '#f7fafc',
      lineHeight: '1.6'
    },
    heroSection: {
      backgroundImage: `url(${necBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      height: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.85), rgba(16, 185, 129, 0.75))'
    },
    heroTitle: {
      color: '#fff',
      fontSize: '4rem',
      fontWeight: '800',
      position: 'relative',
    },
    sectionTitle: {
      color: '#2563eb',
      fontSize: '2.5rem',
      fontWeight: '700',
      marginBottom: '30px',
      position: 'relative',
      display: 'inline-block',
      paddingBottom: '15px'
    },
    titleUnderline: {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '80px',
      height: '4px',
      background: 'linear-gradient(90deg, #2563eb, #10b981)',
      borderRadius: '2px'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0'
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
    },
    leaderCard: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
      transition: 'all 0.4s ease',
      border: '2px solid #e2e8f0'
    },
    imageWrapper: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
    },
    checkIcon: {
      width: '28px',
      height: '28px',
      flexShrink: 0,
      marginTop: '2px',
      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>ABOUT US</h1>
      </div>

      {/* Main Content Section */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 30px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'start'
        }}>
          {/* Left Column - Title */}
          <div>
            <div style={{
              width: '80px',
              height: '5px',
              background: 'linear-gradient(90deg, #2563eb, #10b981)',
              marginBottom: '25px',
              borderRadius: '10px'
            }}></div>
            <h2 style={{
              color: '#1e40af',
              fontSize: '3.5rem',
              fontWeight: '800',
              lineHeight: '1.2',
              margin: 0,
              background: 'linear-gradient(135deg, #1e40af, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              National Engineering College
            </h2>
          </div>

          {/* Right Column - Description */}
          <div style={{
            fontSize: '1.1rem',
            lineHeight: '1.9',
            color: '#374151'
          }}>
            <p style={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
              NEC, the most prominent landmark of Kovilpatti, has been the crowning glory of this Matchless City of Matches. 
              Its celebrated 'Son of the Soil' <strong style={{ color: '#1e40af' }}>Thiru.K.Ramasamy</strong> transformed the entire social and cultural scenario in and 
              around this small town by establishing the excellent educational institution popularly referred as <strong>"NEC"</strong>. By 
              wielding the magical wand of social commitment and munificence this foresighted philanthropist transformed a 
              strip of barren land into a magnificent academic complex that has been consistently producing infallible engineers 
              of high competence right from the day of its inception in <strong style={{ color: '#10b981' }}>1984</strong>.
            </p>
            <p style={{ margin: 0, textAlign: 'justify' }}>
              This much-acclaimed temple of erudition was established under the self-financing scheme sanctioned by the 
              Government of Tamilnadu G.O. No. 939 dated 20.07.1984 by the National Educational and Charitable Trust, 
              Kovilpatti, Thoothukudi district.
            </p>
          </div>
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
        padding: '80px 30px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
            {/* Vision Card */}
            <div style={{ ...styles.card, background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)' }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                marginBottom: '25px',
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
              }}>
                👁️
              </div>
              <h2 style={{ ...styles.sectionTitle, fontSize: '2rem', marginBottom: '20px' }}>
                Vision of the Institution
              </h2>
              <div style={styles.titleUnderline}></div>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.9', color: '#374151', marginTop: '30px' }}>
                Transforming lives through quality education and research with human values.
              </p>
            </div>

            {/* Mission Card */}
            <div style={{ ...styles.card, background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' }}>
              <div style={{
                width: '70px',
                height: '70px',
                background: 'linear-gradient(135deg, #10b981, #34d399)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                marginBottom: '25px',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
              }}>
                🎯
              </div>
              <h2 style={{ ...styles.sectionTitle, fontSize: '2rem', marginBottom: '20px' }}>
                Mission of the Institution
              </h2>
              <div style={styles.titleUnderline}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '30px' }}>
                {[
                  'To maintain excellent infrastructure and highly qualified and dedicated faculty.',
                  'To provide a conducive environment with an ambiance of humanity, wisdom, creativity, and team spirit.',
                  'To promote the values of ethical behavior and commitment to the society.',
                  'To partner with academic, industrial, and government entities to attain collaborative research.'
                ].map((mission, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={styles.checkIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.7', color: '#374151' }}>
                      {mission}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaders Messages */}
      {[
        {
          title: "FOUNDER'S MESSAGE",
          name: "Thiru.K.Ramasamy",
          role: "Founder",
          image: "/images/founder.png",
          fallback: "https://nec.edu.in/wp-content/uploads/2023/12/founder.png",
          messages: [
            "Education is supporting the development of any country. National Engineering College has dedicated itself to impart knowledge and develop the students to be a responsible engineer, oblige a person to the society and superior citizen to our nation. Students of our institution are created carefully by the qualities of hard work, discipline and ethical principles in their career.",
            "Our Institute makes the students as an equipped professional with an ever open and fresh mind for new thoughts in technological improvements. We are in the progress of harvesting the confidence of the students which will emerge as valuable contribution assets to the development of the nation"
          ],
          imageLeft: true,
          bg: '#ffffff'
        },
        {
          title: "MANAGING TRUSTEE'S MESSAGE",
          name: "Thiru.K.R.Arunachalam",
          role: "Managing Trustee",
          image: "/images/trustee.png",
          fallback: "https://nec.edu.in/wp-content/uploads/2023/12/trustee.png",
          messages: [
            "We at National Engineering College trust that the contemporary young learners need to teach themselves in analytical orientation to understand and analyse complex real-world tribulations. Our education system is anchored around this philosophy which is guided by our vision and mission.",
            "We aim to equip the students with all necessary skills by which they can serve their communities and contribute to the growth and progress of the country. Moreover, we are maintaining a cloud relationship with corporate to assist our students with work experience, which in-turn, is creating a bridge between academics and professional world. Our college has many students' bodies and clubs which provide them with a platform to realise their potential and polish their talent by actively engaging in other activities."
          ],
          imageLeft: false,
          bg: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)'
        },
        {
          title: "DIRECTOR'S MESSAGE",
          name: "Dr.S.Shanmugavel",
          role: "Director",
          image: "/images/director.png",
          fallback: "https://nec.edu.in/wp-content/uploads/2023/12/director.png",
          messages: [
            "Victory comes to those who work hard and put continuous effort with confidence. Our Institution National Engineering College serves in shaping futures of rural citizens of our country.",
            "Our institution creates inquisitiveness, creativity, technology, entrepreneurial skills and Leadership in the minds of students, to produce an autonomous Learner. Autonomous Learner can inspect authorities and be a conscientious engineer.",
            "Students are the leaders who would work together as a Self-organizing Network and transform India into a developed nation in a time-bound manner."
          ],
          imageLeft: true,
          bg: '#ffffff'
        },
        {
          title: "PRINCIPAL'S MESSAGE",
          name: "Dr.K.Kalidasa Murugavel",
          role: "Principal",
          image: "/images/principal.png",
          fallback: "https://nec.edu.in/wp-content/uploads/2023/12/principal.png",
          messages: [
            "It's the people over here who have made NEC a fantastic autonomous institute. Knowledge is only as powerful as the application of it and as useful as the care that goes into the application. Let's put wisdom in education by combining knowledge with application, compassion & insight.",
            "Some of you will be engineers who will solve the most critical problems, scientists who will invent, business leaders who will generate wealth and employment for the society and teachers who will create tomorrow's engineers, scientists and business leaders.",
            "But we aspire that all of you will be most caring, wise & determined human beings. I dare you to dream, to work smart and strive for nothing less than excellence."
          ],
          imageLeft: false,
          bg: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
          showProfile: true
        }
      ].map((leader, idx) => (
        <div key={idx} style={{ background: leader.bg, padding: '80px 30px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ ...styles.sectionTitle, fontSize: '2.2rem', marginBottom: '50px' }}>
              {leader.title} —
            </h2>
            <div style={styles.titleUnderline}></div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: leader.imageLeft ? '380px 1fr' : '1fr 380px',
              gap: '60px',
              alignItems: 'start',
              marginTop: '40px'
            }}>
              {leader.imageLeft && (
                <div style={styles.imageWrapper}>
                  <img 
                    src={leader.image}
                    alt={leader.role}
                    style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
                    onError={(e) => { e.target.src = leader.fallback; }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>
              )}
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {leader.messages.map((text, i) => (
                    <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                      <div style={styles.checkIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.9', color: '#374151', textAlign: 'justify' }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '35px', color: '#1e40af', fontWeight: '700', fontSize: '1.3rem' }}>
                  – {leader.name}
                </div>
                {leader.showProfile && (
                  <a href="#" style={{
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    marginTop: '15px',
                    display: 'inline-block',
                    fontWeight: '600',
                    borderBottom: '2px solid transparent',
                    transition: 'border-color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.borderBottomColor = '#2563eb'}
                  onMouseOut={(e) => e.target.style.borderBottomColor = 'transparent'}>
                    View Profile →
                  </a>
                )}
              </div>
              {!leader.imageLeft && (
                <div style={styles.imageWrapper}>
                  <img 
                    src={leader.image}
                    alt={leader.role}
                    style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
                    onError={(e) => { e.target.src = leader.fallback; }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Counters Section */}
      <div style={{
        padding: '100px 30px',
        background: 'linear-gradient(135deg, #1e40af 0%, #10b981 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: '#fff', fontSize: '3rem', fontWeight: '800', marginBottom: '70px', textShadow: '2px 2px 8px rgba(0,0,0,0.3)' }}>
            National Engineering College at a Glance
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '30px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '40px 20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <Counter target={2200} label="Students" />
            <Counter target={170} label="Faculty Members" />
            <Counter target={10} label="Industry Experts" />
            <Counter target={200} label="Ph.D Awarded" />
            <Counter target={260} label="Staff" />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: '#d1d5db',
        padding: '60px 30px 30px',
        marginTop: '0'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 400px', gap: '60px', marginBottom: '50px' }}>
            {/* Quick Links */}
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '25px', fontWeight: '700' }}>Quick Links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Undertaking to UGC', 'Grievance Redressal Portal', 'Online Fee Payment', 'Replying to A Punishable Offence', 'Internal Complaint Committee', 'SC- ST Committee', 'Disciplinary Committee', 'Canteen Committee', 'Anti Drug Club Committee', 'Student Counsellor Committee', 'Mandatory Disclosure'].map((link, i) => (
                  <li key={i}>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s ease' }}
                       onMouseOver={(e) => e.target.style.color = '#60a5fa'}
                       onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Links */}
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '25px', fontWeight: '700' }}>Other Links</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Document Verification System', 'Faculty Application Form', 'Scholarship Application Form', 'ERP Oavya', 'Minority Cell And OBC Cell', 'Equal Opportunity Cell', 'Gender Equity Cell', 'POSH', 'Feedback', 'Sitemap'].map((link, i) => (
                  <li key={i}>
                    <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s ease' }}
                       onMouseOver={(e) => e.target.style.color = '#60a5fa'}
                       onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '25px', fontWeight: '700' }}>Find Us</h3>
              <div style={{
                width: '100%',
                height: '250px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                border: '2px solid #374151'
              }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.8347856815886!2d77.86893431478!3d8.821450793632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b042173f289208b%3A0x5f52ac0b5b0b5b0b!2sNational%20Engineering%20College!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="NEC Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div style={{ borderTop: '1px solid #374151', paddingTop: '30px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '20px' }}>
              {[
                { icon: 'LinkedIn', color: '#0077b5' },
                { icon: 'Facebook', color: '#1877f2' },
                { icon: 'Instagram', color: '#e4405f' },
                { icon: 'YouTube', color: '#ff0000' },
                { icon: 'Twitter', color: '#1da1f2' }
              ].map((social, i) => (
                <a key={i} href="#" style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: social.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '1.2rem',
                  textDecoration: 'none',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.15)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
                }}>
                  {social.icon[0]}
                </a>
              ))}
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: 0 }}>
              Copyright © 2025 National Engineering College | Designed and Developed by <span style={{ color: '#60a5fa' }}>Software Development Team - NEC</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}