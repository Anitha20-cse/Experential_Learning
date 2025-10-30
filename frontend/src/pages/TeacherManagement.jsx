
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TeacherManagement.css";
import { FaTrash, FaPlus, FaUserTie, FaChalkboardTeacher, FaEdit, FaCalendarAlt, FaClock, FaPhone, FaVenusMars, FaBirthdayCake, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaCertificate, FaCalendarCheck } from "react-icons/fa";

const TeacherManagement = () => {
  const { department } = useParams();
  const [teachers, setTeachers] = useState([]);

  // Form States
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [experience, setExperience] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");

  const [loading, setLoading] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedYear, setSelectedYear] = useState('All');

  useEffect(() => {
    fetchTeachers();
  }, [department]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/teachers");
      setTeachers(res.data.filter((t) => t.department === department));
    } catch (err) {
      console.error("Error fetching teachers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !designation || !experience || !phone) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("experience", experience);
    formData.append("phone", phone);
    formData.append("year", year);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("qualification", qualification);
    formData.append("specialisation", specialisation);
    formData.append("department", department);
    formData.append("dateOfJoining", dateOfJoining);
    if (photo) formData.append("photo", photo);

    try {
      if (editingTeacher) {
        await axios.put(`http://localhost:5000/api/teachers/${editingTeacher._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5000/api/teachers/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchTeachers();
    } catch (err) {
      console.error("❌ Error saving teacher:", err);
      alert("Failed to save teacher. Check console for details.");
    }

    // Reset all form fields after submission
    setName("");
    setDesignation("");
    setExperience("");
    setPhone("");
    setYear("");
    setGender("");
    setDateOfBirth("");
    setEmail("");
    setAddress("");
    setQualification("");
    setSpecialisation("");
    setDateOfJoining("");
    setPhoto(null);
    setEditingTeacher(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      console.error("Error deleting teacher", err);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setDesignation(teacher.designation);
    setExperience(teacher.experience);
    setPhone(teacher.phone);
    setYear(teacher.year);
    setGender(teacher.gender);
    setDateOfBirth(teacher.dateOfBirth ? teacher.dateOfBirth.split('T')[0] : '');
    setEmail(teacher.email);
    setAddress(teacher.address);
    setQualification(teacher.qualification);
    setSpecialisation(teacher.specialisation);
    setDateOfJoining(teacher.dateOfJoining ? teacher.dateOfJoining.split('T')[0] : '');
    setPhoto(null); // Reset photo, but will show existing in preview
  };

  const filteredTeachers = selectedYear === 'All' ? teachers : teachers.filter(t => t.year === selectedYear);

  return (
    <div className="teacher-container">
      <h1 className="teacher-title">👩‍🏫 {department} Department - Teacher Management</h1>



      {/* Add/Edit Teacher Form */}
      <form className="teacher-form" onSubmit={handleSubmit}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
          <input
            type="text"
            placeholder="👤 Enter Teacher Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="🎓 Enter Designation (e.g., Assistant Professor)"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <input
            type="number"
            placeholder="⏰ Years of Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          <input
            type="text"
            placeholder="📞 Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="📅 Year (e.g., 2023)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">👥 Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            placeholder="🎂 Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <input
            type="email"
            placeholder="✉️ Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="🏠 Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="🎓 Qualification"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
          />
          <input
            type="text"
            placeholder="🔬 Specialisation"
            value={specialisation}
            onChange={(e) => setSpecialisation(e.target.value)}
          />
          <input
            type="date"
            placeholder="📅 Date of Joining"
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
          />
        </div>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            style={{flex: 1}}
          />
          {(photo || (editingTeacher && editingTeacher.photo)) && (
            <img
              src={photo ? URL.createObjectURL(photo) : `http://localhost:5000/uploads/${editingTeacher.photo}`}
              alt="Preview"
              className="preview-img"
            />
          )}
        </div>
        <button type="submit">
          {editingTeacher ? <FaEdit /> : <FaPlus />} {editingTeacher ? "Update Teacher" : "Add Teacher"}
        </button>
      </form>

      {/* Year Filter */}
      <div className="year-buttons">
        {['All', ...new Set(teachers.map(t => t.year).filter(y => y))].map(y => (
          <button
            key={y}
            className={`year-btn ${selectedYear === y ? 'active' : ''}`}
            onClick={() => setSelectedYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Teacher List */}
      {loading ? (
        <p className="loading-text">Loading teachers...</p>
      ) : filteredTeachers.length === 0 ? (
        <p className="no-teachers">No teachers found for the selected year.</p>
      ) : (
        <div className="teacher-list">
          {filteredTeachers.map((t) => (
            <div key={t._id} className="teacher-card">
              <button className="delete-icon-btn" onClick={() => handleDelete(t._id)} title="Delete Teacher">
                <FaTrash />
              </button>
              {t.photo ? (
                <img
                  src={`http://localhost:5000/uploads/${t.photo}`}

                  alt={t.name}
                  className="teacher-photo"
                />
              ) : (
                <div className="placeholder-icon">
                  <FaChalkboardTeacher />
                </div>
              )}
              <div className="teacher-info">
                <h3>{t.name}</h3>
                <p><FaUserTie style={{color: '#3498db'}} /> {t.designation}</p>
                <p><FaClock style={{color: '#e74c3c'}} /> Experience: {t.experience} yrs</p>
                <p><FaPhone style={{color: '#27ae60'}} /> {t.phone}</p>
                <p><FaCalendarAlt style={{color: '#f39c12'}} /> Year: {t.year}</p>
                <p><FaVenusMars style={{color: '#9b59b6'}} /> Gender: {t.gender}</p>
                <p><FaBirthdayCake style={{color: '#e67e22'}} /> Date of Birth: {t.dateOfBirth ? new Date(t.dateOfBirth).toLocaleDateString() : ""}</p>
                <p><FaEnvelope style={{color: '#34495e'}} /> Email: {t.email}</p>
                <p><FaMapMarkerAlt style={{color: '#16a085'}} /> Address: {t.address}</p>
                <p><FaGraduationCap style={{color: '#8e44ad'}} /> Qualification: {t.qualification}</p>
                <p><FaCertificate style={{color: '#d35400'}} /> Specialisation: {t.specialisation}</p>
                <p><FaCalendarCheck style={{color: '#2ecc71'}} /> Date of Joining: {t.dateOfJoining ? new Date(t.dateOfJoining).toLocaleDateString() : ""}</p>
              </div>
              <div className="card-buttons">
                <button className="edit-btn" onClick={() => handleEdit(t)}>
                  <FaEdit /> 
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;