import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Calendar, 
  Plus, 
  FileText, 
  Trash2, 
  X,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Eye,
  User
} from "lucide-react";

const examTypes = ["PT Exam", "CAT Exam", "Lab Exam", "End Sem Exam"];

export default function ExamSchedule() {
  const [formData, setFormData] = useState({
    examType: "PT Exam",
    examName: "",
    semester: 1,
    startDate: "",
    file: null,
  });
  const [exams, setExams] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [filterSemester, setFilterSemester] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (teacherData) {
      setUserRole("teacher");
    } else if (parentData) {
      setUserRole("parent");
    }
    fetchExams();
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const fetchExams = async () => {
    try {
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const parentData = JSON.parse(localStorage.getItem("parent"));
      const headers = {};
      if (teacherData) {
        headers['x-user-role'] = 'teacher';
        headers['x-user-email'] = teacherData.email;
      } else if (parentData) {
        headers['x-user-role'] = 'parent';
        headers['x-user-email'] = parentData.email;
      }

      const res = await axios.get("https://experential-learning.onrender.com/api/exams", { headers });
      setExams(res.data);
    } catch (err) {
      console.error(err);
      showMessage("Error fetching exams", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("examType", formData.examType);
    data.append("examName", formData.examName);
    data.append("semester", formData.semester);
    data.append("startDate", formData.startDate);
    if (formData.file) data.append("file", formData.file);

    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const headers = {};
    if (teacherData) {
      headers['x-user-role'] = 'teacher';
      headers['x-user-email'] = teacherData.email;
    }

    try {
      await axios.post("https://experential-learning.onrender.com/api/exams", data, { headers });
      showMessage("Exam schedule added successfully! 📅", "success");
      setFormData({
        examType: "PT Exam",
        examName: "",
        semester: 1,
        startDate: "",
        file: null,
      });
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      fetchExams();
    } catch (err) {
      console.error(err);
      showMessage("Failed to add exam schedule", "error");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://experential-learning.onrender.com/api/exams/${deleteId}`);
      showMessage("Exam deleted successfully", "success");
      fetchExams();
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      showMessage("Failed to delete exam", "error");
      setShowDeleteConfirm(false);
    }
  };

  const handleViewPDF = (filePath) => {
    // Construct the full URL for the PDF
    const pdfUrl = `https://experential-learning.onrender.com${filePath}`;
    setPdfPreview(pdfUrl);
  };

  const getExamTypeColor = (type) => {
    switch (type) {
      case "PT Exam":
        return "from-blue-500 to-blue-600";
      case "CAT Exam":
        return "from-green-500 to-green-600";
      case "Lab Exam":
        return "from-purple-500 to-purple-600";
      case "End Sem Exam":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getExamTypeIcon = (type) => {
    switch (type) {
      case "PT Exam":
        return "📝";
      case "CAT Exam":
        return "📊";
      case "Lab Exam":
        return "🔬";
      case "End Sem Exam":
        return "📚";
      default:
        return "📄";
    }
  };

  const renderCards = (type) => {
    let filtered = exams.filter((exam) => exam.examType === type);

    if (filterSemester !== "All") {
      filtered = filtered.filter((exam) => exam.semester === parseInt(filterSemester));
    }

    if (searchTerm) {
      filtered = filtered.filter((exam) =>
        exam.examName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500 text-sm">No exams scheduled</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filtered.map((exam) => (
          <div
            key={exam._id}
            className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getExamTypeIcon(type)}</span>
                  <h3 className="font-bold text-gray-900 text-lg">{exam.examName}</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">Semester {exam.semester}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>{new Date(exam.startDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {exam.file && (
                  <button
                    onClick={() => handleViewPDF(exam.file)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Schedule"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                )}
                {userRole && (
                  <button
                    onClick={() => confirmDelete(exam._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Exam Schedule</h1>
                <p className="text-gray-600 mt-1">Manage and view exam timetables</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">
                    {exams.length} Exams
                  </span>
                </div>
              </div>
              {userRole && (
                <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-700 capitalize">
                      {userRole}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-5 ${
              messageType === "success"
                ? "bg-green-50 border border-green-200"
                : messageType === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : messageType === "error" ? (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              )}
              <span
                className={`font-medium ${
                  messageType === "success"
                    ? "text-green-800"
                    : messageType === "error"
                    ? "text-red-800"
                    : "text-blue-800"
                }`}
              >
                {message}
              </span>
            </div>
            <button
              onClick={() => setMessage("")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Add Exam Form */}
        {userRole && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Add New Exam Schedule</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Exam Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="examType"
                      value={formData.examType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white appearance-none"
                    >
                      {examTypes.map((type, i) => (
                        <option key={i}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Exam Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="examName"
                    placeholder="e.g., PT 4"
                    value={formData.examName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="semester"
                    placeholder="1-8"
                    value={formData.semester}
                    onChange={handleChange}
                    min={1}
                    max={8}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload PDF <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
              >
                <Plus className="w-6 h-6" />
                Add Exam Schedule
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Filter Exams</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by exam name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
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
                Semester
              </label>
              <div className="relative">
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white appearance-none"
                >
                  <option value="All">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Exam Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {examTypes.map((type, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className={`p-6 border-b border-gray-200 bg-gradient-to-r ${getExamTypeColor(type)}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getExamTypeIcon(type)}</span>
                  <h2 className="text-xl font-bold text-white">{type}</h2>
                </div>
              </div>
              <div className="p-6">{renderCards(type)}</div>
            </div>
          ))}
        </div>

        {/* PDF Preview Modal */}
        {pdfPreview && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPdfPreview(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setPdfPreview(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              src={pdfPreview}
              title="PDF Preview"
              className="w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Delete Exam Schedule?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This action cannot be undone. The exam schedule will be permanently removed.
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
                  onClick={handleDelete}
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
}