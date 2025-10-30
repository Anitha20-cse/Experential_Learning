import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./AnnouncementPage.css"; // 👈 new css file

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem("teacher"));
    const parentData = JSON.parse(localStorage.getItem("parent"));
    if (teacherData) {
      setUserRole("teacher");
    } else if (parentData) {
      setUserRole("parent");
    }
    fetchData();
  }, [search, date]);

  const fetchData = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (date) params.date = date;

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

      const res = await axios.get("https://experential-learning.onrender.com/api/announcements", {
        params,
        headers,
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const teacherData = JSON.parse(localStorage.getItem("teacher"));
      const payload = { ...form };
      if (!editId) {
        payload.teacherEmail = teacherData.email;
      }
      if (editId) {
        await axios.put(
          `https://experential-learning.onrender.com/api/announcements/${editId}`,
          payload
        );
        toast.success("✅ Announcement updated");
      } else {
        await axios.post("https://experential-learning.onrender.com/api/announcements", payload);
        toast.success("✅ Announcement added");
      }
      setForm({ title: "", content: "" });
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong");
    }
  };

  const handleEdit = (a) => {
    setForm({ title: a.title, content: a.content });
    setEditId(a._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    await axios.delete(`https://experential-learning.onrender.com/api/announcements/${id}`);
    toast.success("🗑️ Deleted successfully");
    fetchData();
  };

  return (
    <div className="announcement-page">
      <Toaster position="top-right" />
      <h1 className="title">📢 Announcements</h1>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchData}>Filter</button>
      </div>

      {userRole && (
        <form onSubmit={handleSubmit} className="announcement-form">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows="3"
            required
          />
          <button type="submit">
            {editId ? "Update Announcement" : "Add Announcement"}
          </button>
        </form>
      )}

      <div className="announcement-grid">
        {announcements.map((a) => (
          <div key={a._id} className="announcement-card">
            <span className="date">
              {new Date(a.date).toLocaleDateString()}
            </span>
            <h2>{a.title}</h2>
            <p>{a.content}</p>
            {userRole && (
              <div className="actions">
                <button className="edit" onClick={() => handleEdit(a)} title="Edit">
                  ✏️
                </button>
                <button className="delete" onClick={() => handleDelete(a._id)} title="Delete">
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementPage;
