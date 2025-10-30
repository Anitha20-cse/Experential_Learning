import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  X, 
  Loader, 
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  Home,
  Bus,
  UserCircle,
  BookOpen,
  GraduationCap,
  Info,
  Search,
  Filter
} from "lucide-react";

export default function ViewStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isParent, setIsParent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterYear, setFilterYear] = useState("All");

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (!teacherData && !parentData) {
      navigate("/");
      return;
    }

    if (teacherData) {
      fetchTeacherProfile(teacherData.email);
    } else if (parentData) {
      setIsParent(true);
      fetchStudentsForParent(parentData.email);
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.emailId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDept !== "All") {
      filtered = filtered.filter(s => s.department === filterDept);
    }

    if (filterYear !== "All") {
      filtered = filtered.filter(s => String(s.year) === String(filterYear));
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterDept, filterYear]);

  const fetchTeacherProfile = async (email) => {
    try {
      setTeacherEmail(email);
      const res = await axios.get(`http://localhost:5000/api/teachers/profile/${email}`);
      const teacherId = res.data._id;
      fetchStudents(teacherId);
    } catch (err) {
      console.error("Error fetching teacher profile:", err);
      setError("Failed to load teacher profile");
      setLoading(false);
    }
  };

  const fetchStudents = async (teacherId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/assigned-students/teacher/${teacherId}`);
      setStudents(res.data.filter(s => s));
      setFilteredStudents(res.data.filter(s => s));
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForParent = async (parentEmail) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/students/parent/${parentEmail}`);
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      console.error("Error fetching students for parent:", err);
      setError("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = async (student) => {
    if (isParent) return;

    setSelectedStudent(null);
    setModalLoading(true);
    setModalError("");

    try {
      const res = await axios.get(`http://localhost:5000/api/students/${student._id}?teacherEmail=${teacherEmail}`);
      setSelectedStudent(res.data);
    } catch (err) {
      console.error("Error fetching student details:", err);
      setModalError(err.response?.data?.message || "Failed to load student details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setModalError("");
  };

  const departments = ["All", "CSE", "ECE", "MECH", "AIDS", "S&H", "IT", "EEE"];
  const years = ["All", "1", "2", "3", "4"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isParent ? "Your Children" : "Assigned Students"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isParent ? "View your children's information" : "Manage and view student details"}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {!isParent && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-bold text-gray-900">Search & Filter</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, roll no, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year === "All" ? "All Years" : `Year ${year}`}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">
              {isParent ? "No children information available" : "No students assigned to you yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                onClick={() => handleStudentClick(student)}
                className={`bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 transition-all ${
                  !isParent ? 'cursor-pointer hover:shadow-xl hover:-translate-y-2 hover:border-blue-400' : ''
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 font-semibold">{student.rollNo}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 truncate">{student.emailId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{student.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">Year {student.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span className="text-gray-700">{student.phoneNumber}</span>
                  </div>
                </div>

                {!isParent && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      View Full Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {(selectedStudent || modalLoading || modalError) && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Student Details</h2>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {modalLoading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading student details...</p>
                  </div>
                ) : modalError ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-red-600 font-semibold mb-4">{modalError}</p>
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                    >
                      Close
                    </button>
                  </div>
                ) : selectedStudent ? (
                  <div className="space-y-6">
                    {/* Personal Info */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-blue-600" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Full Name</p>
                          <p className="font-semibold text-gray-900">
                            {selectedStudent.firstName} {selectedStudent.lastName}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                          <p className="font-semibold text-gray-900">{selectedStudent.rollNo}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <p className="font-semibold text-gray-900 truncate">{selectedStudent.emailId}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-600 mb-1">Phone</p>
                          <p className="font-semibold text-gray-900">{selectedStudent.phoneNumber}</p>
                        </div>
                        {selectedStudent.dateOfBirth && (
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Date of Birth
                            </p>
                            <p className="font-semibold text-gray-900">
                              {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {selectedStudent.gender && (
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1">Gender</p>
                            <p className="font-semibold text-gray-900">{selectedStudent.gender}</p>
                          </div>
                        )}
                        {selectedStudent.bloodGroup && (
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                              <Droplet className="w-4 h-4 text-red-600" />
                              Blood Group
                            </p>
                            <p className="font-semibold text-gray-900">{selectedStudent.bloodGroup}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-purple-600" />
                        Academic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                          <p className="text-sm text-purple-700 mb-1">Department</p>
                          <p className="font-semibold text-gray-900">{selectedStudent.department}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                          <p className="text-sm text-purple-700 mb-1">Year</p>
                          <p className="font-semibold text-gray-900">Year {selectedStudent.year}</p>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    {selectedStudent.permanentAddress && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-green-600" />
                          Address
                        </h3>
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                          <p className="text-gray-900">{selectedStudent.permanentAddress}</p>
                        </div>
                      </div>
                    )}

                    {/* Parent Info */}
                    {(selectedStudent.fatherName || selectedStudent.motherName || selectedStudent.parentPhone) && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-orange-600" />
                          Parent Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedStudent.fatherName && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                              <p className="text-sm text-orange-700 mb-1">Father's Name</p>
                              <p className="font-semibold text-gray-900">{selectedStudent.fatherName}</p>
                            </div>
                          )}
                          {selectedStudent.motherName && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                              <p className="text-sm text-orange-700 mb-1">Mother's Name</p>
                              <p className="font-semibold text-gray-900">{selectedStudent.motherName}</p>
                            </div>
                          )}
                          {selectedStudent.parentPhone && (
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                              <p className="text-sm text-orange-700 mb-1">Parent Phone</p>
                              <p className="font-semibold text-gray-900">{selectedStudent.parentPhone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Facilities */}
                    {(selectedStudent.transportRequired || selectedStudent.hostelRequired) && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Home className="w-5 h-5 text-indigo-600" />
                          Facilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedStudent.transportRequired && (
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                              <p className="text-sm text-indigo-700 mb-1 flex items-center gap-2">
                                <Bus className="w-4 h-4" />
                                Transport Required
                              </p>
                              <p className="font-semibold text-gray-900">{selectedStudent.transportRequired}</p>
                            </div>
                          )}
                          {selectedStudent.hostelRequired && (
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                              <p className="text-sm text-indigo-700 mb-1 flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Hostel Required
                              </p>
                              <p className="font-semibold text-gray-900">{selectedStudent.hostelRequired}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}