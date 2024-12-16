import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import dotenv from "dotenv";
dotenv.config();
const adminLogin = async (req, res) => {
  const { data } = req.body;
  console.log(data);
  try {
    const admin = await Admin.findOne({ username: data.username });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }
    if (admin.password !== data.password) {
      return res.status(401).json({ message: "Invalid password" });
    }
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

const addAdmin = async (req, res) => {
  console.log(req.user);
  try {
    let newAdmin = new Admin({ ...req.body });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Admin not created" });
  }
};

const listAdmin = async (req, res) => {
  try {
    const admin = await Admin.find();
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Admins not found!" });
  }
};

const removeAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByIdAndDelete(id);
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByIdAndUpdate(id, { ...req.body });
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const admindetail = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findOne({ _id: id });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    let cookies = req.cookies;
    res.status(200).json({ message: "Logout successfully", cookies });
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
