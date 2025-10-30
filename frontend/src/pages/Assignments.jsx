import { useEffect, useState } from "react";
import axios from "axios";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/assignments")
      .then(res => setAssignments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assignments</h2>
      {assignments.map((a, i) => (
        <div key={i} className="mb-4 bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">{a.title}</h3>
          <p>{a.description}</p>
          <p className="text-sm text-gray-500">Due: {new Date(a.dueDate).toDateString()}</p>
        </div>
      ))}
    </div>
  );
}
