import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "First name is required"],
    minlength: [3, "First name must be at least 2 characters long"],
    maxlength: [50, "First name can't exceed 50 characters"],
  },
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["super admin", "sub Admin", "manager", "admin"],
    default: "admin",
  },
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
