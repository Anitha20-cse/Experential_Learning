import { useEffect, useState } from "react";
import axios from "axios";

export default function Activities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/activities")
      .then(res => setActivities(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Activities</h2>
      {activities.map((a, i) => (
        <div key={i} className="mb-3 bg-white shadow p-3 rounded-lg">
          <p><strong>{a.studentName}</strong> ({a.rollNo})</p>
          <p>{a.activity}</p>
          <p className="text-xs text-gray-500">{new Date(a.date).toDateString()}</p>
        </div>
      ))}
    </div>
  );
}
