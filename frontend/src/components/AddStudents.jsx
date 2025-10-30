import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Trash2, Users, Filter, Download, Search, X, CheckCircle, AlertCircle, FileSpreadsheet, UserPlus } from "lucide-react";

const AddStudents = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      showMessage(`File "${selectedFile.name}" selected`, "info");
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleUpload = async () => {
    if (!file) {
      showMessage("Please select a file first!", "error");
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://experential-learning.onrender.com/api/students/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      showMessage(res.data.message || "Students uploaded successfully! ✅", "success");
      fetchStudents();
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      showMessage("Upload failed: " + err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("https://experential-learning.onrender.com/api/students");
      showMessage("All students deleted successfully", "success");
      setStudents([]);
      setFilteredStudents([]);
      setShowDeleteConfirm(false);
    } catch (err) {
      showMessage("Delete failed: " + err.message, "error");
      setShowDeleteConfirm(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://experential-learning.onrender.com/api/students");
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.emailId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedDept !== "All") {
      filtered = filtered.filter((s) => s.department === selectedDept);
    }
    
    if (selectedYear !== "All") {
      filtered = filtered.filter((s) => String(s.year) === String(selectedYear));
    }
    
    setFilteredStudents(filtered);
  }, [selectedDept, selectedYear, students, searchTerm]);

  const departments = ["All", "CSE", "ECE", "IT", "EEE", "MECH", "CIVIL"];
  const years = ["All", "2", "3", "4"];

  const exportToCSV = () => {
    if (filteredStudents.length === 0) {
      showMessage("No data to export", "error");
      return;
    }
    
    const headers = ["Roll No", "First Name", "Last Name", "Year", "Gender", "DOB", "Blood Group", "Phone", "Email", "Address", "Father Name", "Mother Name", "Parent Phone", "Parent Email", "Transport", "Hostel", "Department"];
    const csvData = [
      headers.join(","),
      ...filteredStudents.map(s => [
        s.rollNo,
        s.firstName,
        s.lastName,
        s.year,
        s.gender,
        s.dateOfBirth,
        s.bloodGroup,
        s.phoneNumber,
        s.emailId,
        `"${s.permanentAddress}"`,
        s.fatherName,
        s.motherName,
        s.parentPhone,
        s.parentEmail,
        s.transportRequired,
        s.hostelRequired,
        s.department
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showMessage("Data exported successfully!", "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <p className="text-gray-600 mt-1">Upload, manage, and track student records</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    {filteredStudents.length} Students
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 shadow-md animate-in slide-in-from-top-5 ${
            messageType === "success" ? "bg-green-50 border border-green-200" :
            messageType === "error" ? "bg-red-50 border border-red-200" :
            "bg-blue-50 border border-blue-200"
          }`}>
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
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <FileSpreadsheet className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Upload Student Data</h2>
          </div>
          
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Excel/CSV File
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx,.xls,.csv"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Supported formats: .xlsx, .xls, .csv</p>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={students.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete All
            </button>
            
            <button
              onClick={exportToCSV}
              disabled={filteredStudents.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Filter & Search</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Students
              </label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
              >
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
              >
                {years.map((yr, i) => (
                  <option key={i} value={yr}>
                    {yr === "All" ? "All Years" : `Year ${yr}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Students List ({filteredStudents.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                <tr>
                  {["Roll No", "First Name", "Last Name", "Year", "Gender", "DOB", "Blood Group", "Phone", "Email", "Address", "Father Name", "Mother Name", "Parent Phone", "Parent Email", "Transport", "Hostel", "Department"].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s, idx) => (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{s.rollNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.firstName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.year}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.gender}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.dateOfBirth}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                          {s.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">{s.emailId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{s.permanentAddress}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.fatherName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.motherName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{s.parentPhone}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">{s.parentEmail}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold ${
                          s.transportRequired === "Yes" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {s.transportRequired}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold ${
                          s.hostelRequired === "Yes" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {s.hostelRequired}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {s.department}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="17" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 font-medium">No students found</p>
                        <p className="text-sm text-gray-400">Upload a file to add students</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Delete All Students?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This action cannot be undone. All student records will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                >
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudents;