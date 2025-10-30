import Student from "../models/Student.js";

export const getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

export const addStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
};

export const updateStudent = async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteStudent = async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
};

export const getStudentsByParentEmail = async (req, res) => {
  const { email } = req.params;
  const students = await Student.find({ parentEmail: email });
  res.json(students);
};
