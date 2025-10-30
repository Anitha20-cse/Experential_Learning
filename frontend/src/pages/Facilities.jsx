import React from "react";

const facilities = [
  {
    title: "Library",
    image: "/images/library.png",
    description:
      "The Central Library is a state-of-the-art facility with an extensive collection of books, journals, databases, and multimedia. An automated system ensures efficient resource management and delivery, supporting research and learning across the campus.",
    icon: "📚"
  },
  {
    title: "Transport",
    image: "/images/transport.png",
    description:
      "Thirty buses operate daily from various towns including Vilathikulam, Aruppukkottai, Tirunelveli, Tuticorin, and more. Buses arrive before 9:00 a.m. and depart at 5:40 p.m., with special services at 6:30 p.m. for students attending extra sessions.",
    icon: "🚌"
  },
  {
    title: "Girls Hostel",
    image: "/images/girls-hostel.png",
    description:
      "Housing 900 students, the girls' hostel offers hygienic mess, recreation halls, gym, indoor games, DTH, home theatre, 24/7 internet, and a library. Modern kitchens with solar steam cooking and separate dining for veg/non-veg are provided.",
    icon: "🏠"
  },
  {
    title: "Boys Hostel",
    image: "/images/boys-hostel.png",
    description:
      "Two hostels accommodate 800 boys with modern dining halls, solar cooking systems, recreation halls, gym, DTH, home theatre, internet access, and a sewage treatment plant that sustains a green environment.",
    icon: "🏘️"
  },
  {
    title: "Sports and Games",
    image: "/images/sports.png",
    description:
      "Indoor games include Chess, Carrom, Table Tennis, and a Multi Gym. Outdoor facilities include courts and grounds for Volleyball, Basketball, Kabaddi, Football, Hockey, Cricket, and more—promoting fitness and teamwork.",
    icon: "⚽"
  },
  {
    title: "Cafeteria",
    image: "/images/cafeteria.png",
    description:
      "Four food points serve meals, snacks, juices, and beverages. The spacious canteen accommodates 320+ people and offers a variety of menus that create a home-like dining experience.",
    icon: "🍽️"
  },
  {
    title: "ATM",
    image: "/images/atm.png",
    description:
      "Two ATMs—one behind the Admin Block and one near the bank—offer modern financial services for students and staff with convenience and security.",
    icon: "🏧"
  },
  {
    title: "Bank",
    image: "/images/bank.png",
    description:
      "The Indian Overseas Bank branch on campus operates Monday to Saturday, from 10:30 a.m. to 4:00 p.m., offering full banking services to the NEC community.",
    icon: "🏦"
  },
  {
    title: "Store",
    image: "/images/store.png",
    description:
      "Open from 9:00 a.m. to 6:00 p.m., the college store provides notebooks, textbooks, instruments, and stationery at nominal rates for students and faculty.",
    icon: "🏪"
  },
  {
    title: "Dispensary",
    image: "/images/dispensary.png",
    description:
      "Free medical support is available for all students and staff. Experienced doctors and two full-time nurses ensure health and well-being through regular checkups and care.",
    icon: "⚕️"
  },
];

export default function Facilities() {
  return (
    <section className="facilities-page">
      <style>{`
        .facilities-page {
          font-family: 'Poppins', sans-serif;
          background-color: #f9fafb;
          color: #1e293b;
          overflow-x: hidden;
        }

        /* Hero Section */
       
        .facilities-hero::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: url('/images/hero-bg-pattern.svg') center/cover no-repeat;
          opacity: 0.15;
          top: 0;
          left: 0;
        }
        .facilities-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          animation: fadeInDown 1s ease;
        }
        .facilities-hero h1 {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: 1px;
        }
        .facilities-hero p {
          margin-top: 20px;
          font-size: 1.2rem;
          opacity: 0.9;
        }
        .hero-divider {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          gap: 10px;
        }
        .hero-divider-line {
          width: 60px;
          height: 5px;
          background: white;
          border-radius: 5px;
          animation: slideIn 1.5s ease;
        }

        /* Facilities Grid */
        .facilities-container {
          max-width: 1200px;
          margin: 100px auto;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          gap: 80px;
        }

        .facility-card {
          display: flex;
          align-items: center;
          gap: 50px;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .facility-card.reverse {
          flex-direction: row-reverse;
        }
        .facility-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .facility-image-container {
          position: relative;
          flex: 1;
        }
        .facility-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 20px 0 0 20px;
        }
        .facility-card.reverse .facility-image-container img {
          border-radius: 0 20px 20px 0;
        }
        .facility-icon {
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 2.5rem;
          background: rgba(255,255,255,0.85);
          border-radius: 50%;
          padding: 10px 15px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }

        .facility-content-wrapper {
          flex: 1;
          padding: 40px;
        }
        .facility-header h2 {
          color: #1e40af;
          font-size: 2rem;
          font-weight: 700;
        }
        .facility-divider {
          width: 60px;
          height: 5px;
          background: linear-gradient(90deg, #1e40af, #0d9488);
          border-radius: 5px;
          margin: 10px 0 20px;
        }
        .facility-content-wrapper p {
          color: #475569;
          line-height: 1.8;
          font-size: 1.05rem;
          text-align: justify;
        }
        .facility-dots {
          display: flex;
          gap: 5px;
          margin-top: 20px;
        }
        .facility-dot {
          width: 8px;
          height: 8px;
          background: #1e40af;
          border-radius: 50%;
          opacity: 0.7;
        }

        /* Stats Section */
        .facilities-stats {
          background: linear-gradient(135deg, #1e40af, #0d9488);
          color: white;
          padding: 80px 20px;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .stat-item {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 30px 20px;
          transition: transform 0.3s ease;
        }
        .stat-item:hover {
          transform: translateY(-10px);
          background: rgba(255,255,255,0.25);
        }
        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
        }
        .stat-label {
          margin-top: 10px;
          font-size: 1rem;
          opacity: 0.9;
        }

        /* CTA Section */
        .facilities-cta {
          background: #f1f5f9;
          text-align: center;
          padding: 100px 20px;
        }
        .facilities-cta h3 {
          font-size: 2rem;
          color: #1e3a8a;
          font-weight: 700;
        }
        .facilities-cta p {
          max-width: 700px;
          margin: 20px auto;
          color: #475569;
          line-height: 1.8;
        }
        .cta-button {
          background: linear-gradient(135deg, #1e3a8a, #0d9488);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 14px 40px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        /* Animations */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { width: 0; opacity: 0; }
          to { width: 60px; opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .facility-card,
          .facility-card.reverse {
            flex-direction: column;
          }
          .facility-image-container img {
            border-radius: 20px 20px 0 0 !important;
          }
          .facility-content-wrapper {
            padding: 25px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="facilities-hero">
        <div className="facilities-hero-content">
          <h1>World-Class Facilities</h1>
          <p>
            Experience excellence in education with our state-of-the-art
            infrastructure
          </p>
          <div className="hero-divider">
            <div className="hero-divider-line"></div>
            <div className="hero-divider-line"></div>
            <div className="hero-divider-line"></div>
          </div>
        </div>
      </div>

      {/* Facilities List */}
      <div className="facilities-container">
        {facilities.map((item, index) => (
          <div
            key={index}
            className={`facility-card ${index % 2 !== 0 ? "reverse" : ""}`}
          >
            <div className="facility-image-container">
              <img src={item.image} alt={item.title} />
              <div className="facility-icon">{item.icon}</div>
            </div>
            <div className="facility-content-wrapper">
              <div className="facility-header">
                <h2>{item.title}</h2>
                <div className="facility-divider"></div>
              </div>
              <p>{item.description}</p>
              <div className="facility-dots">
                <div className="facility-dot"></div>
                <div className="facility-dot"></div>
                <div className="facility-dot"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="facilities-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Premium Facilities</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1700+</div>
            <div className="stat-label">Hostel Capacity</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">30</div>
            <div className="stat-label">Transport Buses</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Services</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="facilities-cta">
        <h3>Experience Campus Life at NEC</h3>
        <p>
          Our facilities are designed to provide students with the best
          environment for learning, growth, and development
        </p>
        <button className="cta-button">Schedule a Campus Tour</button>
      </div>
    </section>
  );
}
