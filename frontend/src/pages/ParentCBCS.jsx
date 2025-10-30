import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CBCS.css";

const ParentCBCSPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyPhoto, setFacultyPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const fetchData = async () => {
    try {
      const parentData = JSON.parse(localStorage.getItem("parent"));
      if (!parentData) {
        setError("Parent data not found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`https://experential-learning.onrender.com/api/cbcs/parent?parentEmail=${parentData.email}`);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching CBCS data:", err);
      setError("Error fetching CBCS data. Please try again.");
      setLoading(false);
    }
  };

  const fetchFacultyPhoto = async (facultyName) => {
    setPhotoLoading(true);
    setPhotoError("");
    try {
      const res = await axios.get(
        `https://experential-learning.onrender.com/api/teachers/photo/${encodeURIComponent(facultyName)}`
      );
      setFacultyPhoto(res.data.photo || "/default-avatar.png");
      setSelectedFaculty(facultyName);
    } catch (err) {
      console.error("Error fetching faculty photo:", err);
      setFacultyPhoto("/default-avatar.png");
      setSelectedFaculty(facultyName);
    } finally {
      setPhotoLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedFaculty(null);
    setFacultyPhoto(null);
    setPhotoError("");
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{
          textAlign: 'center',
          color: '#495057'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.2em', fontWeight: '500' }}>Loading CBCS data...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          border: '1px solid #dee2e6'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '15px', fontSize: '1.8em' }}>Error</h2>
          <p style={{ color: '#6c757d', fontSize: '1.1em', lineHeight: '1.5' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            color: '#212529',
            fontSize: '3em',
            fontWeight: '300',
            marginBottom: '10px',
            letterSpacing: '1px'
          }}>CBCS System</h1>
          <p style={{
            color: '#6c757d',
            fontSize: '1.2em',
            fontWeight: '400',
            margin: '0'
          }}>Comprehensive Curriculum & Assessment Management</p>
        </div>

        {data.length > 0 ? (
          <div>
            <h2 style={{
              textAlign: 'center',
              color: '#343a40',
              marginBottom: '40px',
              fontSize: '2.2em',
              fontWeight: '300'
            }}>Student Information</h2>
            {data.map((student, index) => (
              <div key={index} style={{ marginBottom: '60px' }}>
                {/* Student Name and Roll No in Compact Card */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '30px',
                  padding: '15px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  border: '1px solid #dee2e6',
                  maxWidth: '500px',
                  margin: '0 auto 30px'
                }}>
                  <h3 style={{
                    color: '#007bff',
                    fontSize: '1.8em',
                    fontWeight: '500',
                    margin: '0 0 8px 0'
                  }}>{student.name}</h3>
                  <div style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '6px 15px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    fontSize: '1em',
                    fontWeight: '500'
                  }}>
                    Roll No: {student.regno}
                  </div>
                </div>

                {/* Subject Allocations Card */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '40px',
                  boxShadow: '0 4px 25px rgba(0,0,0,0.1)',
                  border: '1px solid #dee2e6',
                  margin: '0 auto',
                  maxWidth: '1000px'
                }}>
                  <div>
                    <h4 style={{
                      textAlign: 'center',
                      color: '#495057',
                      fontSize: '1.8em',
                      fontWeight: '400',
                      marginBottom: '30px',
                      borderBottom: '2px solid #007bff',
                      paddingBottom: '10px'
                    }}>Subject Allocations</h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '20px'
                    }}>
                      {data[0]?.subjects ? (
                        <>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>{data[0].subjects.s1}</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s1 && student.s1 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s1 && student.s1 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s1 && student.s1 !== 'Not Assigned' && fetchFacultyPhoto(student.s1)}
                            >
                              {student.s1 || 'Not Assigned'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>{data[0].subjects.s2}</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s2 && student.s2 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s2 && student.s2 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s2 && student.s2 !== 'Not Assigned' && fetchFacultyPhoto(student.s2)}
                            >
                              {student.s2 || 'Not Assigned'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>{data[0].subjects.s3}</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s3 && student.s3 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s3 && student.s3 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s3 && student.s3 !== 'Not Assigned' && fetchFacultyPhoto(student.s3)}
                            >
                              {student.s3 || 'Not Assigned'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>{data[0].subjects.s4}</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s4 && student.s4 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s4 && student.s4 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s4 && student.s4 !== 'Not Assigned' && fetchFacultyPhoto(student.s4)}
                            >
                              {student.s4 || 'Not Assigned'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>{data[0].subjects.s5}</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s5 && student.s5 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s5 && student.s5 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s5 && student.s5 !== 'Not Assigned' && fetchFacultyPhoto(student.s5)}
                            >
                              {student.s5 || 'Not Assigned'}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>Theory of Computation</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s1 && student.s1 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s1 && student.s1 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s1 && student.s1 !== 'Not Assigned' && fetchFacultyPhoto(student.s1)}
                            >
                              {student.s1 || 'Not Assigned'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>Object Oriented Analysis and Design</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s2 && student.s2 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s2 && student.s2 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s2 && student.s2 !== 'Not Assigned' && fetchFacultyPhoto(student.s2)}
                            >
                              {student.s2 || 'Not Assigned'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>DevOps and Agile Methodology</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s3 && student.s3 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s3 && student.s3 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s3 && student.s3 !== 'Not Assigned' && fetchFacultyPhoto(student.s3)}
                            >
                              {student.s3 || 'Not Assigned'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>Modern Web Technologies</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s4 && student.s4 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s4 && student.s4 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s4 && student.s4 !== 'Not Assigned' && fetchFacultyPhoto(student.s4)}
                            >
                              {student.s4 || 'Not Assigned'}
                            </div>
                          </div>
                          <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            transition: 'box-shadow 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,123,255,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{ fontSize: '1.1em', fontWeight: '500', color: '#495057', marginBottom: '8px' }}>Artificial Intelligence</div>
                            <div
                              style={{
                                fontSize: '1.3em',
                                fontWeight: '600',
                                color: '#007bff',
                                cursor: student.s5 && student.s5 !== 'Not Assigned' ? 'pointer' : 'default',
                                textDecoration: student.s5 && student.s5 !== 'Not Assigned' ? 'underline' : 'none'
                              }}
                              onClick={() => student.s5 && student.s5 !== 'Not Assigned' && fetchFacultyPhoto(student.s5)}
                            >
                              {student.s5 || 'Not Assigned'}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '60px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            maxWidth: '600px',
            margin: '0 auto',
            border: '1px solid #dee2e6'
          }}>
            <div style={{
              fontSize: '4em',
              marginBottom: '20px',
              opacity: '0.6'
            }}>📚</div>
            <h3 style={{ color: '#6c757d', marginBottom: '15px', fontSize: '1.8em', fontWeight: '400' }}>No CBCS Data Available</h3>
            <p style={{ color: '#868e96', fontSize: '1.1em', lineHeight: '1.6' }}>CBCS information for your child will appear here once uploaded by the faculty.</p>
          </div>
        )}

        {/* Faculty Photo Modal */}
        {selectedFaculty && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}>
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}>
                ×
              </button>
              <h3 style={{
                textAlign: 'center',
                marginBottom: '20px',
                color: '#007bff',
                fontSize: '1.5em'
              }}>
                {selectedFaculty}
              </h3>
              {photoLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e9ecef',
                    borderTop: '3px solid #007bff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px'
                  }}></div>
                  <p>Loading photo...</p>
                </div>
              ) : photoError ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
                  <p>{photoError}</p>
                </div>
              ) : facultyPhoto ? (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={facultyPhoto.startsWith('http') ? facultyPhoto : `https://experential-learning.onrender.com/uploads/${facultyPhoto}`}
                    alt={`${selectedFaculty} photo`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                  />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  <p>No photo available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentCBCSPage;