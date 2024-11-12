import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name can\'t exceed 50 characters'],
    },
    username: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    adminType: {
        type: String,
        required: [true, 'Admin type is required'],
        enum: ['mainAdmin', 'subAdmin'],
        default: 'subAdmin',
    },
    password: {
        type: String,
        unique:true,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
});

 const Admin = mongoose.model("Admin", adminSchema);
 export default Admin;