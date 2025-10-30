const mongoose = require("mongoose");
const Timetable = require("./models/Timetable"); // adjust path if needed

mongoose.connect("mongodb://127.0.0.1:27017/necdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const timetables = [
  { semester: "Semester 1", imageUrl: "/timetable1.png" },
  { semester: "Semester 2", imageUrl: "/timetable2.png" },
  { semester: "Semester 3", imageUrl: "/timetable3.png" }
];

async function seed() {
  await Timetable.deleteMany(); // optional: clears old data
  await Timetable.insertMany(timetables);
  console.log("Timetables seeded successfully!");
  mongoose.disconnect();
}

seed();
