import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name can\'t exceed 50 characters'],
    },
    number: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
    },
});

 const User = mongoose.model("User", userSchema);
 export default User;