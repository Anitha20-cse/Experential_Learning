import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaBookOpen,
  FaBuilding,
  FaRocket,
  FaChevronLeft,
  FaChevronRight,
  FaAward,
  FaUsers,
  FaGraduationCap,
  FaLightbulb
} from "react-icons/fa";

const programmes = [
  {
    img: "/images/Computer Science and Engineering.png",
    title: "Computer Science and Engineering",
    desc: "The Department of Computer Science and Engineering was established after civil with a mission to prepare highly competent engineers for global automotive industries through innovative, industry-oriented curriculum and intensive practical training.",
    color: "from-blue-500 to-blue-700"
  },
  {
    img: "/images/civil.png",
    title: "Civil Engineering",
    desc: "With technology pervading through our veins and arteries, it is high time we get to know about them with an engineering perspective. The Department of Biotechnology offers B.Tech., M.Tech., and Ph.D. programs since 2002.",
    color: "from-gray-500 to-gray-700"
  },
  {
    img: "/images/mech.png",
    title: "Mechanical Engineering",
    desc: "With technology pervading through our veins and arteries, it is high time we get to know about them with an engineering perspective. The Department of Biotechnology offers B.Tech., M.Tech., and Ph.D. programs since 2002.",
    color: "from-red-500 to-red-700"
  },
  {
    img: "/images/it.png",
    title: "Information Engineering",
    desc: "Department of IT Engineering is one of the core departments started in Kumaraguru College of Technology. It specializes in seven key domains including Structural, Environmental, and Construction Management.",
    color: "from-purple-500 to-purple-700"
  },
  {
    img: "/images/ece.png",
    title: "Electrical and Communication Engineering",
    desc: "Department of ECE Engineering is one of the earliest departments started in Kumaraguru College of Technology. It specializes in seven key domains including Structural, Environmental, and Construction Management.",
    color: "from-green-500 to-green-700"
  },
  {
    img: "/images/AIDS.png",
    title: "Artificial Engineering",
    desc: "Department of AI Engineering is one of the new departments started in Kumaraguru College of Technology. It specializes in seven key domains including Structural, Environmental, and Construction Management.",
    color: "from-orange-500 to-orange-700"
  },
];

const images = [
  "/images/college1.jpeg",
  "/images/college2.jpeg",
  "/images/college3.jpeg",
  "/images/college4.png",
];

const highlights = [
  {
    icon: <FaBookOpen className="text-white text-3xl" />,
    title: "LIBRARY",
    text: "Our Library was established in the year 1951. It holds more than one lakh book volumes.",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: <FaBuilding className="text-white text-3xl" />,
    title: "HOSTEL",
    text: "Our College facilitate students an excellent Hostel facility to feel home away from home.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: <FaRocket className="text-white text-3xl" />,
    title: "PLACEMENT",
    text: "Placement Office facilitating campus recruitment for multinational and national organizations.",
    gradient: "from-orange-500 to-orange-600"
  },
];

const stats = [
  { label: "Acre of Campus", value: "140+", icon: <FaBuilding /> },
  { label: "Years of Legacy", value: "65+", icon: <FaAward /> },
  { label: "Students", value: "300+", icon: <FaUsers /> },
  { label: "Faculty", value: "150+", icon: <FaGraduationCap /> },
  { label: "Patents", value: "97", icon: <FaLightbulb /> },
  { label: "Grade by NAAC, MHRD", value: "A++", icon: <FaAward /> },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Slider */}
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                current === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40" /> */}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <FaChevronLeft className="text-white text-xl" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <FaChevronRight className="text-white text-xl" />
        </button>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4 max-w-4xl animate-fade-in">
            <div className="mb-6 inline-block">
              
            </div>
           
            <div className="flex gap-4 justify-center flex-wrap">
            
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                current === index ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }} />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 px-4 relative z-10">
          {stats.map((item, i) => (
            <div
              key={i}
              className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-yellow-400 text-3xl mb-2 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-white text-4xl font-bold mb-2">{item.value}</h3>
              <p className="text-gray-300 text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY NEC Section */}
      <section
        id="section-why"
        className={`max-w-6xl mx-auto py-20 px-6 transition-all duration-1000 ${
          isVisible["section-why"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">NEC</span>?
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
          <p className="text-gray-700 text-lg leading-relaxed">
            <span className="text-3xl text-blue-600 font-serif float-left mr-2 mt-1">"</span>
            National Engineering College (NEC), established in 1984 and accredited by the NBA,
            offers seven undergraduate, five postgraduate, and numerous Ph.D. research programs.
            The college boasts centers of excellence and state-of-the-art laboratories for all
            engineering branches. NEC collaborates with research organizations and industries
            through MoUs to drive technological advancements, enhance student training, update
            curricula, and establish advanced research centers. Strong ties with leading industries
            and IT firms provide students with invaluable training and project opportunities.
            NEC's robust academic environment ensures excellent campus placement prospects for both
            UG and PG students.
          </p>
        </div>
      </section>

      {/* Campus Highlights */}
      <section
        id="section-highlights"
        className={`bg-gradient-to-b from-gray-50 to-white py-20 px-6 transition-all duration-1000 ${
          isVisible["section-highlights"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Campus Highlights
            </h2>
            <p className="text-gray-600 text-lg">Discover our world-class facilities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${item.gradient}`} />
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section
        id="section-programmes"
        className={`max-w-7xl mx-auto py-20 px-6 transition-all duration-1000 ${
          isVisible["section-programmes"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Programmes</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            NEC offers multiple UG and PG programmes. All academic departments are recognized as research centers by Anna University.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programmes.map((item, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">{item.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.desc}</p>
                <button className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center group-hover:gap-2 transition-all">
                  Know More
                  <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    {/* NEC Footer Section */}
<footer
  className="bg-gray-100 text-gray-800 mt-20 border-t border-gray-300 relative overflow-hidden"
  style={{
    backgroundImage: "url('/images/nec-campus-bg.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundBlendMode: "lighten",
    opacity: 0.95,
  }}
>
  <div className="absolute inset-0 bg-white/80"></div> {/* subtle overlay for readability */}

  <div className="relative max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
    {/* Left: College Info */}
    <div>
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/images/nec-logo.png"
          alt="NEC Logo"
          className="w-16 h-16"
        />
        <div>
          <h2 className="text-xl font-bold text-blue-900">
            National Engineering College
          </h2>
          <p className="text-sm text-gray-600 font-medium">K.R.Nagar, Kovilpatti</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed mb-2">The Principal,</p>
      <p className="text-sm leading-relaxed">
        National Engineering College (Autonomous),
        <br />
        K.R.Nagar, Kovilpatti, Thoothukudi (Dt) – 628503
      </p>
      <p className="text-sm mt-2">Ph: 04632 – 222 502</p>
      <p className="text-sm">Fax: 232749</p>
      <p className="text-sm">Mob: 93859 76674, 93859 76684</p>
      <a
        href="mailto:principal@nec.edu.in"
        className="text-blue-600 hover:underline text-sm"
      >
        principal@nec.edu.in
      </a>
    </div>

    {/* Middle: Quick Links */}
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Links</h3>
      <ul className="space-y-2 text-sm text-blue-700">
        {[
          "Undertaking to UGC",
          "Grievance Redressal Portal",
          "Online Fee Payment",
          "Ragging Is A Punishable Offence",
          "Internal Complaint Committee",
          "SC-ST Committee",
          "Disciplinary Committee",
          "Canteen Committee",
          "Anti Drug Club Committee",
          "Student Counsellor Committee",
          "Mandatory Disclosure",
        ].map((link, i) => (
          <li key={i}>
            <a href="#" className="hover:underline">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Middle Right: Other Links */}
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">Other Links</h3>
      <ul className="space-y-2 text-sm text-blue-700">
        {[
          "Document Verification System",
          "Faculty Application Form",
          "Scholarship Application Form",
          "ERP Oasys",
          "Minority Cell And OBC Cell",
          "Equal Opportunity Cell",
          "Gender Equity Cell",
          "POSH",
          "Feedback",
          "Sitemap",
        ].map((link, i) => (
          <li key={i}>
            <a href="#" className="hover:underline">
              {link}
            </a>
          </li>
        ))}
      </ul>


    </div>

    {/* Right: Map */}
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3">Find Us</h3>
      <iframe
        title="NEC Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.037782588726!2d77.79304607410289!3d9.183879990910027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b041226e5ab1b61%3A0xcffef02e1aaf6e3b!2sNational%20Engineering%20College!5e0!3m2!1sen!2sin!4v1709287375057!5m2!1sen!2sin"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        className="rounded-lg shadow-md"
      ></iframe>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="relative border-t border-gray-300 py-4 text-center text-sm text-gray-600 bg-gray-50">
    © 2025 National Engineering College. All rights reserved. <br />
    <span className="text-gray-500">
      Designed by Software Development Team – NEC
    </span>
  </div>
</footer>

    </div>
  );
}