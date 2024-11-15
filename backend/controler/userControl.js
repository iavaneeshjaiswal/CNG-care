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
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  const { fullName, email, number, password } = req.body;
  try {
    let newUser = new User({ ...req.body });

    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(400).send("Email already exists");
    }

    const existingPhone = await User.findOne({ number: newUser.number });
    if (existingPhone) {
      return res.status(400).send("Phone number already exists");
    }
    
    await newUser.save();
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
    res.status(201).json({ token, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ otp });
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
        res.status(200).json({ otp });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  }
};

const listUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { userLogin, signup, sendOtp, listUser };
