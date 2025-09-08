const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Connect Database
connectDB();

// ✅ Seed Admin User (plain text password)
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "nive12@gmail.com" });
    if (!adminExists) {
      await User.create({
        name: "nivetha",
        email: "nive12@gmail.com",
        password: "nivethanive@2006", // plain text
        role: "admin",
      });
      console.log("✅ Admin user created: nive12@gmail.com / nivethanive@2006");
    } else {
      console.log("ℹ Admin user already exists");
    }
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
  }
};
seedAdmin();

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Backend + MongoDB is running ✅");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
