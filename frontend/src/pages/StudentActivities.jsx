import React, { useState, useEffect } from "react";

export default function StudentActivities() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activities, setActivities] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher") || "null");
    const parentData = JSON.parse(localStorage.getItem("parent") || "null");
    if (teacherData) {
      setUserRole("teacher");
    } else if (parentData) {
      setUserRole("parent");
    }
  }, []);

  const fetchActivities = () => {
    const teacherData = JSON.parse(localStorage.getItem("teacher") || "null");
    const parentData = JSON.parse(localStorage.getItem("parent") || "null");
    const headers = {};
    if (teacherData) {
      headers['x-user-role'] = 'teacher';
      headers['x-user-email'] = teacherData.email;
    } else if (parentData) {
      headers['x-user-role'] = 'parent';
      headers['x-user-email'] = parentData.email;
    }

    fetch("http://localhost:5000/api/activities", { headers })
      .then(res => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);
    if (image) formData.append("image", image);

    const teacherData = JSON.parse(localStorage.getItem("teacher") || "null");
    const headers = {};
    if (teacherData) {
      headers['x-user-role'] = 'teacher';
      headers['x-user-email'] = teacherData.email;
    }

    (async () => {
      try {
        let res;
        if (editingId) {
          res = await fetch(
            `http://localhost:5000/api/activities/${editingId}`,
            {
              method: 'PUT',
              body: formData,
              headers: headers
            }
          );
          const updatedActivity = await res.json();
          setActivities(activities.map(act => act._id === editingId ? updatedActivity : act));
        } else {
          res = await fetch(
            "http://localhost:5000/api/activities",
            {
              method: 'POST',
              body: formData,
              headers: headers
            }
          );
          const newActivity = await res.json();
          setActivities([newActivity, ...activities]);
        }
        setTitle("");
        setDate("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
        setEditingId(null);
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const handleEdit = (act) => {
    setTitle(act.title);
    setDate(act.date.split('T')[0]);
    setDescription(act.description);
    setImage(null);
    setImagePreview(act.image);
    setEditingId(act._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;

    const teacherData = JSON.parse(localStorage.getItem("teacher") || "null");
    const headers = {};
    if (teacherData) {
      headers['x-user-role'] = 'teacher';
      headers['x-user-email'] = teacherData.email;
    }

    (async () => {
      try {
        await fetch(`http://localhost:5000/api/activities/${id}`, {
          method: 'DELETE',
          headers
        });
        setActivities(activities.filter((act) => act._id !== id));
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         act.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = !filterMonth || new Date(act.date).getMonth() === parseInt(filterMonth);
    return matchesSearch && matchesMonth;
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, white  0%,white 100%)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: '2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          animation: 'slideIn 0.6s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0,
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em'
                }}>
                  🎉 Student Activities
                </h1>
                <p style={{
                  fontSize: '1rem',
                  color: 'white',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {userRole === 'teacher' ? 'Create, manage, and track all student activities' : 'Explore and view all student activities and events'}
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.75rem', margin: 0, fontWeight: '600' }}>Total Activities</p>
                  <p style={{ color: 'white', fontWeight: '800', fontSize: '1.5rem', margin: 0 }}>
                    {activities.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          animation: 'slideIn 0.6s ease-out 0.1s both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <svg style={{ width: '20px', height: '20px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Filter & Search</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search activities by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Months</option>
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload Activity Section - Only for Teachers */}
        {userRole === 'teacher' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            padding: '0',
            marginBottom: '2rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            animation: 'slideIn 0.6s ease-out 0.2s both'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: 0 }}>
                  {editingId ? "✏️ Update Activity" : "➕ Create New Activity"}
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', margin: 0, marginTop: '0.25rem' }}>
                  Fill in the details below to add a new activity
                </p>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '0.75rem'
                    }}>
                      <svg style={{ width: '18px', height: '18px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Activity Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter an engaging activity title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box',
                        fontWeight: '500'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '0.75rem'
                    }}>
                      <svg style={{ width: '18px', height: '18px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Activity Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box',
                        fontWeight: '500'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '0.75rem'
                    }}>
                      <svg style={{ width: '18px', height: '18px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Description
                    </label>
                    <textarea
                      placeholder="Describe the activity in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="5"
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: 'all 0.3s',
                        boxSizing: 'border-box',
                        fontWeight: '500',
                        lineHeight: '1.6'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '0.75rem'
                  }}>
                    <svg style={{ width: '18px', height: '18px', color: '#667eea' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Image
                  </label>
                  <div style={{
                    border: '3px dashed #cbd5e1',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    backgroundColor: '#f8fafc',
                    position: 'relative',
                    minHeight: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}>
                    {imagePreview ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                        <button
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg style={{ width: '48px', height: '48px', color: '#94a3b8', marginBottom: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                          Drag & drop or click to upload
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          PNG, JPG, GIF up to 5MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #f1f5f9' }}>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setTitle("");
                      setDate("");
                      setDescription("");
                      setImage(null);
                      setImagePreview(null);
                    }}
                    style={{
                      padding: '0.875rem 2rem',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      backgroundColor: 'white',
                      fontSize: '0.9375rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      color: '#475569',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '0.875rem 2.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.9375rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {editingId ? "Update Activity" : "Publish Activity"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activities List */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            animation: 'slideIn 0.6s ease-out 0.3s both'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: 'white',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}>
              <span style={{
                width: '8px',
                height: '40px',
                background: 'linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.5))',
                borderRadius: '4px'
              }}></span>
              All Activities
            </h2>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              padding: '0.625rem 1.25rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '700',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              {filteredActivities.length} {filteredActivities.length === 1 ? 'Activity' : 'Activities'} Found
            </span>
          </div>

          {filteredActivities.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              animation: 'slideIn 0.6s ease-out 0.4s both'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)'
              }}>
                <svg style={{ width: '60px', height: '60px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.75rem' }}>
                {searchTerm || filterMonth ? 'No Activities Found' : 'No Activities Yet'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                {searchTerm || filterMonth
                  ? 'Try adjusting your search or filter criteria'
                  : userRole === 'teacher'
                  ? 'Start by creating your first activity above!'
                  : 'Check back soon for exciting new activities!'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredActivities.map((act, index) => (
                <div
                  key={act._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    animation: `slideIn 0.6s ease-out ${0.4 + index * 0.1}s both`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    {act.image ? (
                      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                        <img 
                          src={act.image} 
                          alt={act.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s'
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 50%)'
                        }}></div>
                      </div>
                    ) : (
                      <div style={{
                        height: '220px',
                        background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg style={{ width: '80px', height: '80px', color: 'rgba(255, 255, 255, 0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg style={{ width: '16px', height: '16px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'white' }}>
                          {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1.75rem' }}>
                    <h3 style={{
                      fontSize: '1.375rem',
                      fontWeight: '800',
                      color: '#1f2937',
                      marginBottom: '1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {act.title}
                    </h3>

                    <p style={{
                      color: '#64748b',
                      fontSize: '0.9375rem',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {act.description || 'No description provided for this activity.'}
                    </p>

                    {userRole === 'teacher' && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        paddingTop: '1.25rem',
                        borderTop: '2px solid #f1f5f9'
                      }}>
                        <button
  onClick={() => handleEdit(act)}
  style={{
    width: '28px', // reduced width
    height: '28px', // small box height
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(102, 126, 234, 0.3)',
  }}
  onMouseOver={(e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 5px 12px rgba(102, 126, 234, 0.4)';
  }}
  onMouseOut={(e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 3px 8px rgba(102, 126, 234, 0.3)';
  }}
>
  <svg
    style={{ width: '14px', height: '14px' }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
</button>

<button
  onClick={() => handleDelete(act._id)}
  style={{
    width: '28px', // reduced width
    height: '28px', // small height for uniformity
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1.5px solid #fecaca',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = '#fee2e2';
    e.target.style.borderColor = '#fca5a5';
    e.target.style.transform = 'translateY(-2px)';
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = '#fef2f2';
    e.target.style.borderColor = '#fecaca';
    e.target.style.transform = 'translateY(0)';
  }}
>
  <svg
    style={{ width: '14px', height: '14px' }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
</button>

                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}