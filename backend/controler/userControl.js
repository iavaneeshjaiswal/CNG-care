import User from "../models/user.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// user login
const userLogin = async (req, res) => {
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!emailPattern.test(req.body.email)) {
    return res.status(401).json({ message: "Invalid email", status: false });
  }
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email", status: false });
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      status: true,
      message: "User login successfully",
      token,
      user: {
        fullName: user.fullName,
        email: user.email.toLowerCase(),
        number: user.number,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

// signup
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
      .json({ message: "Invalid phone number", status: false });
  }

  try {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(401).json({
        message:
          "Password must have at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
        status: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      number,
      password: hashedPassword,
    });
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
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    res.status(201).json({
      status: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// send otp through email and Phone number
const sendOtp = async (req, res) => {
  const { credential } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
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
      to: credential.toLowerCase(),
      subject: "Email Verification",
      html: `<p>Your One Time Password From CNG care is <strong>${otp}</strong></p>`,
    };

    auth.sendMail(reciever, (error, info) => {
      if (error) {
        console.log("Error occurred: " + error.message);
        res.status(500).json({ message: error.message, status: false });
      } else {
        console.log("Email sent: " + info.response);
        const VerifyToken = jwt.sign(
          { credential, otp },
          process.env.JWT_SECRET,
          {
            expiresIn: "120s",
          }
        );
        console.log(otp);
        res.status(200).json({
          otp,
          message: "Email sent successfully",
          VerifyToken,
          status: true,
        });
      }
    });
  } else {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(credential)) {
      return res
        .status(401)
        .json({ message: "Invalid phone number", status: false });
    }
    client.messages
      .create({
        body: `Your one time password From CNG care is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${credential}`,
      })
      .then(() => {
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

// verify otp
const verifyOtp = async (req, res) => {
  try {
    const { otp, VerifyToken } = req.body;
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

// list user
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

// delete user
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

// reset password
const resetpassword = async (req, res) => {
  const { credential, new_password, VerifyToken, otp } = req.body;
  console.log(credential);
  try {
    const verify = jwt.verify(VerifyToken, process.env.JWT_SECRET);
    if (verify.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP", status: false });
    }
    if (credential !== verify.credential) {
      return res
        .status(401)
        .json({ message: "Invalid credential", status: false });
    }
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (emailPattern.test(credential)) {
      const user = await User.findOne({ email: credential.toLowerCase() });
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not found", status: false });
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedPassword;
      await user.save();
    } else {
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

export default {
  userLogin,
  signup,
  sendOtp,
  listUser,
  removeUser,
  resetpassword,
};
