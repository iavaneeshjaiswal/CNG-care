import User from "../models/user.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sendMail from "../utils/sendMail.js";
import { getOtpEmailtemp } from "../utils/emailTemplate.js";
dotenv.config();

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// User login function
export const userLogin = async (req, res) => {
  // Validate input fields
  if (!req.body.email || !req.body.password) {
    return res
      .status(401)
      .json({ message: "Email and password required", status: false });
  }
  // Email validation pattern
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!emailPattern.test(req.body.email)) {
    return res.status(401).json({ message: "Invalid email", status: false });
  }
  try {
    // Find user by email and populate related fields
    const user = await User.findOne({
      email: req.body.email.toLowerCase(),
    })
      .populate("orders")
      .populate("transactionID");
    if (!user) {
      return res.status(401).json({ message: "Invalid email", status: false });
    }
    // Compare passwords
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: "Invalid password", status: false });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      status: true,
      message: "User login successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, status: false });
  }
};

// User signup function
export const signup = async (req, res) => {
  const { fullName, email, number, password } = req.body;
  // Check for mandatory fields
  if (!fullName || !email || !number || !password) {
    res.status(401).json({ message: "All fields are required", status: false });
  }
  // Email validation pattern
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!emailPattern.test(email)) {
    return res.status(401).json({ error: "Invalid email", status: false });
  }

  // Phone number validation pattern
  const phonePattern = /^[6-9]\d{9}$/;
  if (!phonePattern.test(number)) {
    return res
      .status(401)
      .json({ message: "Invalid phone number", status: false });
  }

  try {
    // Password validation pattern
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(401).json({
        message:
          "Password must have at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
        status: false,
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      number,
      password: hashedPassword,
    });
    // Check for existing email
    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists" });
    }
    // Check for existing phone number
    const existingPhone = await User.findOne({ number: newUser.number });
    if (existingPhone) {
      return res
        .status(400)
        .json({ status: false, message: "Phone number already exists" });
    }
    // Save new user to database
    await newUser.save();
    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    res.status(201).json({
      status: true,
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Send OTP through email and phone number
export const sendOtp = async (req, res) => {
  const { credential } = req.body;
  // Generate random OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  // Email validation pattern
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (emailPattern.test(credential)) {
    try {
      await sendMail(credential, getOtpEmailtemp(otp), "OTP Verification");
      const VerifyToken = jwt.sign(
        { credential, otp },
        process.env.JWT_SECRET,
        {
          expiresIn: "120s",
        }
      );
      return res.status(200).json({
        otp,
        message: "OTP sent successfully",
        VerifyToken,
        status: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failure While sending Email", status: false });
    }
  } else {
    // Phone number validation pattern
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(credential)) {
      return res
        .status(401)
        .json({ message: "Invalid phone number", status: false });
    }
    // Send SMS using Twilio
    client.messages
      .create({
        body: `Your one time password From CNG care is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${credential}`,
      })
      .then(() => {
        // Create verification token
        const VerifyToken = jwt.sign(
          { credential, otp },
          process.env.JWT_SECRET,
          {
            expiresIn: "120s",
          }
        );
        res.status(200).json({
          otp,
          message: "OTP sent successfully",
          VerifyToken,
          status: true,
        });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message, status: false });
      });
  }
};

// Verify OTP function
export const verifyOtp = async (req, res) => {
  try {
    const { otp, VerifyToken } = req.body;
    // Verify the token
    const verify = jwt.verify(VerifyToken, process.env.JWT_SECRET);
    if (verify.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP", status: false });
    }
    res
      .status(200)
      .json({ message: "OTP verified successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// List all users
export const listUser = async (req, res) => {
  try {
    // Retrieve all users
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "No users found", status: false });
    }
    return res
      .status(200)
      .json({ users, message: "Users found successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// Delete user by ID
export const removeUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "User deleted successfully", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: true });
  }
};

// Update user address
export const updateAddress = async (req, res) => {
  const { pincode, state, area, locality, city } = req.body;

  // Validate input fields
  if (!pincode || !state || !area || !locality || !city) {
    return res
      .status(400)
      .json({ message: "All address fields are required", status: false });
  }

  try {
    // Find user by ID and update
    const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { address: `${area},${locality},${pincode},${city},${state}` }
    );
    if (!user) {
      return res.status(401).json({ message: "User not found", status: false });
    }
    return res
      .status(200)
      .json({ message: "Address updated successfully", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// Reset user password
export const resetpassword = async (req, res) => {
  const { credential, new_password, VerifyToken, otp } = req.body;
  console.log(credential);
  try {
    // Verify the token
    const verify = jwt.verify(VerifyToken, process.env.JWT_SECRET);
    if (verify.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP", status: false });
    }
    if (credential !== verify.credential) {
      return res
        .status(401)
        .json({ message: "Invalid credential", status: false });
    }
    // Email validation pattern
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (emailPattern.test(credential)) {
      // Find user by email
      const user = await User.findOne({ email: credential.toLowerCase() });
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found", status: false });
      }
      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedPassword;
      await user.save();
    } else {
      // Find user by phone number
      const user = await User.findOne({ number: credential });
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found", status: false });
      }
      if (user.password === new_password) {
        return res
          .status(401)
          .json({ message: "Password already exists", status: false });
      }
      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedPassword;
      await user.save();
    }
    res
      .status(200)
      .json({ message: "Password reset successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export const getUserLocation = async (req, res) => {
  try {
    const { lat, long } = req.body;
    if (!lat || !long) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required", status: false });
    }
    const location = `https://www.google.com/maps?q=${lat},${long}`;
    console.log(location);
    return res
      .status(200)
      .json({ location, status: true, message: "Location found" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

