const Teacher = require("../models/Teacher");
const fs = require("fs");
const path = require("path");

const getFacultyPhoto = async (req, res) => {
  try {
    const { facultyName, department } = req.params;

    // Find teacher by name and department
    const teacher = await Teacher.findOne({
      name: { $regex: new RegExp(facultyName, 'i') },
      department: { $regex: new RegExp(department, 'i') }
    });

    if (!teacher || !teacher.photo) {
      return res.status(404).json({ message: "Faculty photo not found" });
    }

    // Read the photo file and convert to base64
    const photoPath = path.join(__dirname, "../uploads", teacher.photo);

    if (!fs.existsSync(photoPath)) {
      return res.status(404).json({ message: "Photo file not found" });
    }

    const photoBuffer = fs.readFileSync(photoPath);
    const photoBase64 = photoBuffer.toString('base64');

    res.json({ photo: photoBase64 });
  } catch (error) {
    console.error("Error fetching faculty photo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFacultyPhotos = async (req, res) => {
  try {
    const teachers = await Teacher.find({ photo: { $exists: true, $ne: null } });
    const photos = teachers.map(teacher => {
      const photoPath = path.join(__dirname, "../uploads", teacher.photo);
      if (fs.existsSync(photoPath)) {
        const photoBuffer = fs.readFileSync(photoPath);
        const photoBase64 = photoBuffer.toString('base64');
        return {
          name: teacher.name,
          department: teacher.department,
          photo: photoBase64
        };
      }
      return null;
    }).filter(photo => photo !== null);

    res.json(photos);
  } catch (error) {
    console.error("Error fetching faculty photos:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getFacultyPhoto,
  getFacultyPhotos
};