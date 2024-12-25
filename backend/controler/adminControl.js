import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import dotenv from "dotenv";
dotenv.config();

// Admin login function
const adminLogin = async (req, res) => {
  const { data } = req.body;
  try {
    // Find admin by username
    const admin = await Admin.findOne({ username: data.username });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }
    // Check password
    const match = await admin.comparePassword(data.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      success: true,
      message: "Admin login successfully",
      token,
      admin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new admin
const addAdmin = async (req, res) => {
  try {
    // Create new admin
    let newAdmin = new Admin({ ...req.body });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Admin not created" });
  }
};

// List all admins
const listAdmin = async (req, res) => {
  try {
    // Retrieve all admins
    const admin = await Admin.find();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Admins not found!" });
  }
};

// Remove admin by ID
const removeAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete admin by ID
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin by ID
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Update admin by ID
    const admin = await Admin.findByIdAndUpdate(id, { ...req.body }, {
      new: true,
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin details by ID
const admindetail = async (req, res) => {
  const { id } = req.params;
  try {
    // Find admin by ID
    const admin = await Admin.findOne({ _id: id });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout admin
const logout = async (req, res) => {
  try {
    // Delete cookie
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Error deleting cookie:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export default {
  adminLogin,
  addAdmin,
  listAdmin,
  removeAdmin,
  updateAdmin,
  admindetail,
  logout,
};

