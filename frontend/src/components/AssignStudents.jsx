import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  UserPlus, 
  Users, 
  GraduationCap, 
  Upload, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileSpreadsheet,
  ChevronDown,
  Search,
  UserCheck,
  Save,
  XCircle
} from 'lucide-react';

const AssignStudents = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [newTeacherId, setNewTeacherId] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const hardcodedDepartments = ["CSE", "ECE", "MECH", "AIDS", "S&H", "IT", "EEE"];
    setDepartments(hardcodedDepartments);
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const fetchStudents = async () => {
    if (!selectedDepartment || !selectedYear) return;
    try {
      const res = await axios.get(`https://experential-learning.onrender.com/api/assigned-students/students?department=${selectedDepartment}&year=${selectedYear}`);
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTeachers = async () => {
    if (!selectedDepartment) return;
    try {
      const res = await axios.get(`https://experential-learning.onrender.com/api/assigned-students/teachers?department=${selectedDepartment}`);
      setTeachers(res.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const params = new URLSearchParams();
      if (filterDepartment) params.append('department', filterDepartment);
      if (filterYear) params.append('year', filterYear);
      const res = await axios.get(`https://experential-learning.onrender.com/api/assigned-students/assignments?${params.toString()}`);
      setAssignments(res.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, [selectedDepartment, selectedYear]);

  useEffect(() => {
    fetchAssignments();
  }, [filterDepartment, filterYear]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
      if (!allowedTypes.includes(file.type)) {
        showMessage('Please select a valid Excel (.xlsx) or CSV file.', 'error');
        setExcelFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setExcelFile(file);
      showMessage(`File "${file.name}" selected successfully`, 'info');
    }
  };

  const handleAssign = async () => {
    if (!selectedDepartment || !selectedYear) {
      showMessage('Please select a department and year.', 'error');
      return;
    }
    if (selectedStudents.length === 0 && !excelFile) {
      showMessage('Please select at least one student or upload a file.', 'error');
      return;
    }
    if (!selectedTeacher) {
      showMessage('Please select a teacher.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('studentIds', JSON.stringify(selectedStudents));
    formData.append('teacherId', selectedTeacher);
    formData.append('department', selectedDepartment);
    formData.append('year', selectedYear);
    if (excelFile) {
      formData.append('file', excelFile);
    }

    try {
      const res = await axios.post('https://experential-learning.onrender.com/api/assigned-students/assign', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showMessage(res.data.message, 'success');
      setSelectedStudents([]);
      setExcelFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchAssignments();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error assigning students.', 'error');
    }
  };

  const handleUpdate = async (assignmentId) => {
    if (!newTeacherId) {
      showMessage('Please select a new teacher.', 'error');
      return;
    }
    try {
      const res = await axios.put(`https://experential-learning.onrender.com/api/assigned-students/assignments/${assignmentId}`, {
        teacherId: newTeacherId,
      });
      showMessage(res.data.message, 'success');
      setEditingAssignment(null);
      setNewTeacherId('');
      fetchAssignments();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error updating assignment.', 'error');
    }
  };

  const handleDelete = async (assignmentId) => {
    try {
      const res = await axios.delete(`https://experential-learning.onrender.com/api/assigned-students/assignments/${assignmentId}`);
      showMessage(res.data.message, 'success');
      fetchAssignments();
    } catch (error) {
      showMessage(error.response?.data?.message || 'Error deleting assignment.', 'error');
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const executeDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const filteredStudents = students.filter(s => 
    studentSearch === '' || 
    s.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s._id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Assign Students to Teachers</h1>
                <p className="text-gray-600 mt-1">Manage student-teacher assignments efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    {assignments.length} Assignments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-5 ${
            messageType === "success" ? "bg-green-50 border border-green-200" :
            messageType === "error" ? "bg-red-50 border border-red-200" :
            "bg-blue-50 border border-blue-200"
          }`}>
            <div className="flex items-center gap-3">
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : messageType === "error" ? (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              )}
              <span className={`font-medium ${
                messageType === "success" ? "text-green-800" :
                messageType === "error" ? "text-red-800" :
                "text-blue-800"
              }`}>{message}</span>
            </div>
            <button onClick={() => setMessage('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Assignment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Create New Assignment</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white appearance-none"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white appearance-none"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Select Year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {selectedDepartment && selectedYear && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Students Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      Select Students ({selectedStudents.length} selected)
                    </label>
                    {filteredStudents.length > 0 && (
                      <button
                        onClick={selectAllStudents}
                        className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>
                  
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="border-2 border-gray-300 rounded-xl p-4 max-h-80 overflow-y-auto bg-gray-50">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <label
                          key={student._id}
                          className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors mb-2"
                        >
                          <input
                            type="checkbox"
                            value={student._id}
                            checked={selectedStudents.includes(student._id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedStudents(prev => {
                                if (checked) {
                                  return [...prev, student._id];
                                } else {
                                  return prev.filter(id => id !== student._id);
                                }
                              });
                            }}
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{student.rollNo}</div>
                            <div className="text-sm text-gray-600">{student.firstName} {student.lastName}</div>
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No students found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                    <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                    Or Upload Excel/CSV
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors bg-gray-50">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".xlsx,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                    >
                      Choose File
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Supported: .xlsx, .csv</p>
                    {excelFile && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-800">{excelFile.name}</span>
                        <button
                          onClick={() => {
                            setExcelFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="ml-auto text-green-600 hover:text-green-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Teacher Selection */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      Select Teacher <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none"
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map(teacher => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name} - {teacher.designation}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAssign}
                disabled={!selectedDepartment || !selectedYear || (selectedStudents.length === 0 && !excelFile) || !selectedTeacher}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                <UserCheck className="w-6 h-6" />
                Assign Students to Teacher
              </button>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Filter Assignments</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Department
              </label>
              <div className="relative">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Year
              </label>
              <div className="relative">
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none"
                >
                  <option value="">All Years</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Current Assignments ({assignments.length})
            </h2>
          </div>

          {assignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  {editingAssignment === assignment._id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select New Teacher
                        </label>
                        <div className="relative">
                          <select
                            value={newTeacherId}
                            onChange={(e) => setNewTeacherId(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white appearance-none"
                          >
                            <option value="">Select Teacher</option>
                            {teachers.map(teacher => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.name} - {teacher.designation}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(assignment._id)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingAssignment(null);
                            setNewTeacherId('');
                          }}
                          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            <span className="text-xs font-semibold text-gray-500 uppercase">Student</span>
                          </div>
                          <p className="font-bold text-gray-900 text-lg">
                            {assignment.student ? assignment.student.rollNo : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {assignment.student ? `${assignment.student.firstName} ${assignment.student.lastName}` : 'Unknown'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingAssignment(assignment._id);
                              setNewTeacherId(assignment.teacher ? assignment.teacher._id : '');
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => confirmDelete(assignment._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-gray-200">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <GraduationCap className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-gray-500 uppercase">Teacher</span>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {assignment.teacher ? assignment.teacher.name : 'Unknown'}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {assignment.department}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            Year {assignment.year}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 font-medium text-lg">No assignments found</p>
              <p className="text-sm text-gray-400 mt-2">Create your first assignment using the form above</p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Delete Assignment?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This action cannot be undone. The assignment will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteId(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignStudents;