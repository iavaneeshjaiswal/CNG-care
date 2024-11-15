import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";


const adminLogin = async(req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await User.findOne({ username });
        if (!admin) {
            return res.status(401).json({ error: "User not found" });
        }
        if (admin.password !== password) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign({ admin,password }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const addAdmin = async(req, res) => {
    const { fullName, username , password } = req.body;
    try {
        let newAdmin = new Admin({ fullName, username, password });
        await newAdmin.save();
        const token = jwt.sign({ username,password }, process.env.JWT_SECRET);
        res.status(200).json({ token });
        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

const listAdmin = async(req, res) => {
    try {
        const admin = await Admin.find();
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

const removeAdmin = async(req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findByIdAndDelete(id);
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateAdmin = async(req, res) => {
    const { id } = req.params;
    const { fullName, username , password } = req.body;
    try {
        const admin = await Admin.findByIdAndUpdate(id, { fullName, username, password });
        res.status(200).json({ admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

export default {
    adminLogin,
    addAdmin,
    listAdmin,
    removeAdmin,
    updateAdmin
};
