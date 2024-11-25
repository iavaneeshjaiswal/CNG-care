import User from "../models/user.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (!emailPattern.test(email)) {
    return res.status(401).json({ message: "Invalid email" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      message: "User login successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "User not found" });
  }
};

const signup = async (req, res) => {
  const { fullName, email, number, password } = req.body;
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (!emailPattern.test(email)) {
    return res.status(401).json({ error: "Invalid email", status: false });
  }
  const phonePattern = /^[6-9]\d{9}$/;

  if (!phonePattern.test(number)) {
    return res
      .status(401)
      .json({ error: "Invalid phone number", status: false });
  }

  try {
    let newUser = new User({ ...req.body });

    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists" });
    }

    const existingPhone = await User.findOne({ number: newUser.number });
    if (existingPhone) {
      return res
        .status(400)
        .json({ status: false, message: "Phone number already exists" });
    }

    await newUser.save();
    const user = await User.findOne({ email: newUser.email });
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    res.status(201).json({
      status: true,
      message: "User created successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// send otp through email and Phone number
const sendOtp = async (req, res) => {
  const { credential } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);

  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (emailPattern.test(credential)) {
    const auth = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const reciever = {
      from: process.env.GMAIL_USER,
      to: credential,
      subject: "Email Verification",
      text: `Your One Time Password From CNG care is  ${otp}`,
    };

    auth.sendMail(reciever, (error, info) => {
      if (error) {
        console.log("Error occurred: " + error.message);
        res.status(500).json({ message: error.message });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ otp, message: "Email sent successfully" });
      }
    });
  } else {
    client.messages
      .create({
        body: `Your one time password From CNG care is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${credential}`,
      })
      .then(() => {
        res
          .status(200)
          .json({ otp, message: "Phone number sent successfully" });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  }
};

const listUser = async (req, res) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ users, message: "Users found successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const removeUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "User deleted successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: true });
  }
};

const resetpassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    user.password = password;
    await user.save();
    res
      .status(200)
      .json({ message: "Password reset successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export default {
  userLogin,
  signup,
  sendOtp,
  listUser,
  removeUser,
  resetpassword,
};
