import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SkillrackMedals() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("https://experential-learning.onrender.com/api/skillrack-medals")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Skillrack Medals</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Roll No</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Medals</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} className="text-center">
              <td className="p-2 border">{s.rollNo}</td>
              <td className="p-2 border">{s.studentName}</td>
              <td className="p-2 border">{s.medals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
