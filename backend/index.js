import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./DB/DbConnect.js";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import { seedSuperAdmin } from './Controllers/userController.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

connectDB().then(async () => {
  await seedSuperAdmin();
  console.log("DB seeded successfully.");
}).catch((err) => {
  console.error("MongoDB Atlas connection error.", err.message);
});