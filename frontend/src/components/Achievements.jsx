import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Trophy, 
  Award, 
  Plus, 
  Filter, 
  Calendar, 
  User, 
  Building2, 
  Medal,
  DollarSign,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Music,
  Upload,
  Search,
  ChevronDown
} from "lucide-react";

const Achievements = () => {
  const [formData, setFormData] = useState({
    name: "",
    deptYear: "",
    eventName: "",
    eventDate: "",
    college: "",
    category: "academic",
    prize: "",
    cashPrize: 0,
  });
  const [file, setFile] = useState(null);
  const [records, setRecords] = useState([]);
  const [preview, setPreview] = useState(null);
  const [departments] = useState(["CSE", "ECE", "MECH", "AIDS", "S&H", "IT", "EEE"]);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/achievements");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      showMessage("Error fetching achievements", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) data.append("file", file);

      await axios.post("http://localhost:5000/api/achievements", data);
      showMessage("Achievement added successfully! 🎉", "success");
      setFormData({
        name: "",
        deptYear: "",
        eventName: "",
        eventDate: "",
        college: "",
        category: "academic",
        prize: "",
        cashPrize: 0,
      });
      setFile(null);
      fetchRecords();
    } catch (err) {
      console.error(err);
      showMessage("Error adding achievement", "error");
    }
  };

  const getPrizeColor = (prize) => {
    switch (prize) {
      case "1st Prize":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900";
      case "2nd Prize":
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900";
      case "3rd Prize":
        return "bg-gradient-to-r from-orange-400 to-orange-500 text-white";
      case "Participation":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPrizeIcon = (prize) => {
    switch (prize) {
      case "1st Prize":
        return "🥇";
      case "2nd Prize":
        return "🥈";
      case "3rd Prize":
        return "🥉";
      default:
        return "🎖️";
    }
  };

  const renderCards = (category) => {
    let filtered = records.filter((r) => r.category === category);

    if (filterDepartment) {
      filtered = filtered.filter((r) =>
        r.deptYear.toLowerCase().startsWith(filterDepartment.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.college.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 font-medium">No achievements found</p>
          <p className="text-sm text-gray-400 mt-1">Add your first achievement above</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((rec, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex flex-col md:flex-row">
              {rec.file && (
                <div className="md:w-48 h-48 md:h-auto flex-shrink-0 relative group cursor-pointer">
                  <img
                    src={`http://localhost:5000/uploads/${rec.file}`}
                    alt="achievement"
                    onClick={() =>
                      setPreview(`http://localhost:5000/uploads/${rec.file}`)
                    }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 flex-1 pr-2">
                    {rec.eventName}
                  </h3>
                  <span className="text-2xl">{getPrizeIcon(rec.prize)}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {rec.prize && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getPrizeColor(
                        rec.prize
                      )}`}
                    >
                      {rec.prize}
                    </span>
                  )}
                  {rec.cashPrize > 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />₹ {rec.cashPrize}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">{rec.name}</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                      {rec.deptYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span>{rec.college}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span>{new Date(rec.eventDate).toLocaleDateString()}</span>
                  </div>
                </div>
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
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Achievements</h1>
                <p className="text-gray-600 mt-1">Celebrate excellence and recognition</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-700">
                    {records.length} Achievements
                  </span>
                </div>
              </div>
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

        {/* Add Achievement Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Plus className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Add New Achievement</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventName"
                  placeholder="Enter event name"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prize <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="prize"
                    value={formData.prize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-white appearance-none"
                  >
                    <option value="">Select Prize</option>
                    <option value="1st Prize">🥇 1st Prize</option>
                    <option value="2nd Prize">🥈 2nd Prize</option>
                    <option value="3rd Prize">🥉 3rd Prize</option>
                    <option value="Participation">🎖️ Participation</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cash Prize (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="cashPrize"
                    placeholder="0"
                    value={formData.cashPrize}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter student name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department & Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="deptYear"
                  placeholder="e.g., CSE 3rd Year"
                  value={formData.deptYear}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  College Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="college"
                    placeholder="Enter college name"
                    value={formData.college}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-white appearance-none"
                  >
                    <option value="academic">📘 Academic</option>
                    <option value="non-academic">🎭 Non-Academic</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                  />
                </div>
                {file && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {file.name}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
            >
              <Plus className="w-6 h-6" />
              Add Achievement
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Filter Achievements</h2>
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
                  placeholder="Search by name, event, or college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
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
              <div className="relative">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-white appearance-none"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Achievements */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Academic Achievements</h2>
            </div>
          </div>
          <div className="p-6">{renderCards("academic")}</div>
        </div>

        {/* Non-Academic Achievements */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Non-Academic Achievements</h2>
            </div>
          </div>
          <div className="p-6">{renderCards("non-academic")}</div>
        </div>

        {/* Image Preview Modal */}
        {preview && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreview(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setPreview(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={preview}
              alt="preview"
              className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;