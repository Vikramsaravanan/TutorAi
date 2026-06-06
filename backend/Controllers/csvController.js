import multer from "multer";
import csvParser from "csv-parser";
import { Readable } from "stream";
import User from "../Model/User.js";
import bcrypt from "bcryptjs";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const bulkUploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const students = [];
    const stream = Readable.from(req.file.buffer.toString());

    await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on("data", (row) => {
          const normalized = {};
          Object.keys(row).forEach((key) => {
            normalized[key.trim().toLowerCase()] = row[key]?.trim();
          });
          if (normalized.name && normalized.email) {
            students.push({
              name: normalized.name,
              email: normalized.email.toLowerCase(),
            });
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (students.length === 0) {
      return res.status(400).json({
        message: 'No valid rows found. CSV must have "name" and "email" columns.',
      });
    }

    const defaultPassword = "Kit@123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const results = { created: [], skipped: [], errors: [] };

    for (const student of students) {
      try {
        const existing = await User.findOne({ email: student.email });
        if (existing) {
          results.skipped.push({ name: student.name, email: student.email, reason: "Email already exists" });
          continue;
        }

        await User.create({
          name: student.name,
          email: student.email,
          password: hashedPassword,
          role: "student",
          creatorId: req.user._id,
          college: req.user.college,
          dept: req.user.dept,
          year: req.user.year,
        });

        results.created.push({ name: student.name, email: student.email });
      } catch (err) {
        results.errors.push({ name: student.name, email: student.email, reason: err.message });
      }
    }

    res.status(201).json({
      message: `Bulk upload complete: ${results.created.length} created, ${results.skipped.length} skipped, ${results.errors.length} errors`,
      totalProcessed: students.length,
      ...results,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ message: error.message });
  }
};
