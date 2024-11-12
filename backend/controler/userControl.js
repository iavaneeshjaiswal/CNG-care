import User from "../models/user.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const userLogin = async(req, res) => {
        const { number, password } = req.body;
        try {
            const user = await User.findOne({ number });
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }
            if (user.password !== password) {
                return res.status(401).json({ error: "Invalid password" });
            }
            const token = jwt.sign({ number,password }, process.env.JWT_SECRET);
            res.status(200).json({ token , user });
        } catch (error) {
            res.status(500).json({ error: error.message });
    }}

    const signup = async(req, res) => {
        const { fullName, number , password } = req.body;
        try {
            let newUser = new User({ fullName, number, password });
            await newUser.save();
            const token = jwt.sign({ number,password }, process.env.JWT_SECRET);
            res.status(201).json({ token ,...req.body });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    const sendOtp = async(req, res) => { 
    const { number } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);
    client.messages
        .create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: number,
        })
        .then(() => {
            res.status(200).json({ otp });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });}


        const listUser = async(req, res) => {
            try {
                const user = await User.find();
                res.status(200).json({ user });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }


        export default { userLogin, signup, sendOtp ,listUser};