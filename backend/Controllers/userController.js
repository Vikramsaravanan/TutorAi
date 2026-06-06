import User from "../Model/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, role, college, dept, year } = req.body;
    const defaultPassword = "Kit@123";

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Account with email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
      creatorId: req.user._id,
      college: college || req.user.college, // Inherit if not provided
      dept: dept || req.user.dept,
      year: year || req.user.year,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHierarchyStats = async (req, res) => {
  try {
    const roleMap = {
      super_admin: "dean",
      dean: "hod",
      hod: "mentor",
      mentor: "student"
    };

    const targetSubordinateRole = roleMap[req.user.role];

    // Fetch immediate subordinates created by this user
    let subordinates = await User.find({ creatorId: req.user._id });

    // Build stats specifically for students if requested by mentor
    if (req.user.role === 'mentor') {
      return res.json({ children: subordinates });
    }

    res.json({ children: subordinates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed script helper
export const seedSuperAdmin = async () => {
  const superEmail = "superadmin@gmail.com";
  const user = await User.findOne({ email: superEmail });
  
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("thisissuperadminhere", salt);
    
    await User.create({
      name: "Global Super Admin",
      email: superEmail,
      password: hashedPassword,
      role: "super_admin"
    });
    console.log("Seeded default Super Admin.");
  }
};
