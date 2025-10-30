import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import TeacherDashboardYear4 from "./TeacherDashboardYear4";
import ParentDashboard from "./ParentDashboard";
import Admission from "./pages/Admission";
import Placement from "./pages/Placement";
import Scholarship from "./pages/Scholarship";

import TopRanks from "./pages/TopRanks";
import Timetable from "./pages/Timetable";
import SkillrackMedals from "./pages/SkillrackMedals";
import SkillrackPage from "./pages/SkillrackPage";
import Attendance from "./pages/Attendance";
import AnnouncementPage from "./pages/AnnouncementPage";
import ExamSchedule from "./pages/ExamSchedule";
import StudentActivities from "./pages/StudentActivities";
import DriveDetails from "./pages/DriveDetails";
import CBCS from "./pages/CBCS";
import ParentCBCS from "./pages/ParentCBCS";

import ParentTimetable from "./pages/ParentTimetable";
import ParentAnnouncements from "./pages/ParentAnnouncements";
import ParentSkillrack from "./pages/ParentSkillrack";
import ParentActivities from "./pages/ParentActivities";
import ParentAttendance from "./pages/ParentAttendance";
import ParentExamSchedule from "./pages/ParentExamSchedule";
import ParentTopRanks from "./pages/ParentTopRanks";
import ParentMarks from "./pages/ParentMarks";
import ParentStudents from "./pages/ParentStudents";
import ParentLeaveRequests from "./pages/ParentLeaveRequests";
import TeacherLeaveRequests from "./pages/TeacherLeaveRequests";
import ParentScholarship from "./pages/ParentScholarship";
import ParentAchievements from "./pages/ParentAchievements";
import ParentCirculars from "./pages/ParentCirculars";
import ParentDrives from "./pages/ParentDrives";

import Achievements from "./components/Achievements";
import CircularPage from "./components/CircularPage";
import AddStudents from "./components/AddStudents";
import AssignStudents from "./components/AssignStudents";
import ViewStudents from "./components/ViewStudents";
import Departments from "./pages/Departments";
import TeacherManagement from "./pages/TeacherManagement";

import AboutUs from "./pages/AboutUs";
import Counter from "./pages/Counter";
import Facilities from "./pages/Facilities";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Placeholder from "./pages/Placeholder";
import SplashScreen from "./pages/SplashScreen";

import "./App.css";

function App() {
  return (
    <Router>
      {/* ✅ Navbar is always visible */}
      <Navbar />

      <Routes>
        {/* ✅ Give Home its own path */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* ✅ Login on its own path */}
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-dashboard-year4" element={<TeacherDashboardYear4 />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />

        {/* Admin pages */}
        <Route path="/admin/top-ranks" element={<TopRanks />} />
        <Route path="/admin/timetable" element={<Timetable />} />
        <Route path="/admin/skillrack" element={<SkillrackPage />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/announcements" element={<AnnouncementPage />} />
        <Route path="/admin/exam-schedule" element={<ExamSchedule />} />
        <Route path="/admin/activities" element={<StudentActivities />} />
        <Route path="/admin/drives" element={<DriveDetails />} />
        <Route path="/admin/achievements" element={<Achievements />} />

        {/* Teacher */}
        <Route path="/teacher/attendance" element={<Attendance />} />
        <Route path="/teacher/students" element={<ViewStudents />} />
        <Route path="/teacher/cbcs" element={<CBCS />} />
        <Route path="/teacher/leave-requests" element={<TeacherLeaveRequests />} />
        <Route path="/teacher/scholarship" element={<Scholarship />} />
        {/* Parent */}
        <Route path="/parent/timetable" element={<ParentTimetable />} />
        <Route path="/parent/top-ranks" element={<ParentTopRanks />} />
        <Route path="/parent/marks" element={<ParentMarks />} />
        <Route path="/parent/activities" element={<ParentActivities />} />
        <Route path="/parent/skillrack" element={<ParentSkillrack />} />
        <Route path="/parent/attendance" element={<ParentAttendance />} />
        <Route path="/parent/announcements" element={<ParentAnnouncements />} />
        <Route path="/parent/exam-schedule" element={<ParentExamSchedule />} />
        <Route path="/parent/students" element={<ParentStudents />} />
        <Route path="/parent/cbcs" element={<ParentCBCS />} />
        <Route path="/parent/leave-requests" element={<ParentLeaveRequests />} />
        <Route path="/parent/scholarship" element={<ParentScholarship />} />
        <Route path="/parent/achievements" element={<ParentAchievements />} />
        <Route path="/parent/circulars" element={<ParentCirculars />} />
        <Route path="/parent/drives" element={<ParentDrives />} />
        <Route path="/admin/circulars" element={<CircularPage />} />
        <Route path="/admin/add-students" element={<AddStudents />} />
        <Route path="/admin/assign-students" element={<AssignStudents />} />
       <Route path="/admin/add-teachers" element={<Departments />} />
       <Route path="/admin/add-teachers/:department" element={<TeacherManagement />} />

        <Route path="/cse" element={<h1>CSE Page (Coming Soon)</h1>} />
        <Route path="/cse/2nd-year" element={<TeacherManagement />} />

        {/* Others */}
        <Route path="/skillrack" element={<SkillrackMedals />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/counter" element={<Counter />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/placements" element={<Placement />} />
        <Route path="/admission" element={<Admission />} />

       
        <Route path="/placeholder" element={<Placeholder />} />
        <Route path="/splash" element={<SplashScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
