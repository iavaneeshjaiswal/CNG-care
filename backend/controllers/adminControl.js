import Admin from "../models/admin.js";
import { generateTokens } from "../utils/Tokens.js";
import dotenv from "dotenv";
import BlockedToken from "../models/blockedToken.js";
dotenv.config();

// Admin login function
const adminLogin = async (req, res) => {
  try {
    // Find admin by username
    const admin = await Admin.findOne(
      { username: req.body.data.username },
      "_id role username password"
    );
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }
    // Check password

    if (req.body.data.password !== admin.password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const { accessToken, refreshToken } = generateTokens(admin);
    res.status(200).json({
      success: true,
      message: "Admin login successfully",
      accessToken,
      refreshToken,
      admin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new admin
const addAdmin = async (req, res) => {
  const { name, username, password, role } = req.body;

  // Validation
  if (!name || !username || !password || !role) {
    return res
      .status(400)
      .json({ message: "Name, username, password and role are required" });
  }

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      message:
        "Password must have at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    });
  }

  try {
    // Create new admin
    let newAdmin = new Admin({ ...req.body });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Admin not created", error: error.message });
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
      return res.status(401).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin by ID
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    // Update admin by ID
    const admin = await Admin.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        new: true,
      }
    );
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin updated successfully", admin });
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
export const logout = async (req, res) => {
  if (!req.body.token || !req.user.userId) {
    return res
      .status(400)
      .json({ message: "Token and user ID is required", status: false });
  }
  try {
    const admin = await Admin.findById(req.user.userId);
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Admin not found", status: false });
    }
    const findtoken = await BlockedToken.findOne({ token: req.body.token });
    if (findtoken) {
      return res
        .status(401)
        .json({ message: "Token already blocked", status: false });
    }
    const newblocked = await BlockedToken.create({
      token: req.body.token,
    });
    await newblocked.save();
    return res
      .status(200)
      .json({ message: "Logout successfully", status: true });
  } catch (error) {
    console.error("Error deleting cookie:", error.message);
    return res.status(500).json({ message: error.message, status: false });
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
