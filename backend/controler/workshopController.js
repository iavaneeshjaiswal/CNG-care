import workshopModel from "../models/workshop.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { generateTokens } from "../utils/Tokens.js";
import sendMail from "../utils/sendMail.js";
import { getOtpEmailtemp } from "../utils/emailTemplate.js";
import BlockedToken from "../models/blockedToken.js";

export const createWorkshop = async (req, res) => {
  try {
    const {
      workshopName,
      workshopOwnerName,
      email,
      password,
      number,
      address,
    } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image.",
        status: false,
      });
    }
    const imageUrls = req.files.map((file) => `uploads/${file.filename}`);

    if (
      !workshopName ||
      !workshopOwnerName ||
      !email ||
      !password ||
      !number ||
      !address
    ) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }

    const existingWorkshop = await workshopModel.findOne({ email });
    if (existingWorkshop) {
      return res.status(400).json({
        message: "Workshop already exists",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newWorkshop = new workshopModel({
      workshopName,
      email,
      workshopOwnerName,
      password: hashedPassword,
      number,
      address,
      coordinates: {
        text: address.text,
        coordinates: {
          long: address.coordinates.long,
          lat: address.coordinates.lat,
        },
      },
      images: imageUrls,
    });
    const tokens = generateTokens(newWorkshop);
    const savedWorkshop = await newWorkshop.save();
    res.status(201).json({
      savedWorkshop,
      tokens,
      message: "Workshop created successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export const loginWorkshop = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", status: false });
    }
    const workshop = await workshopModel
      .findOne(
        { email },
        "_id workshopName workshopOwnerName number address email wallet workshopImage services"
      )
      .select("+password");
    if (!workshop) {
      return res
        .status(404)
        .json({ message: "Workshop not found", status: false });
    }

    const WorkshopObject = {
      _id: workshop._id,
      workshopName: workshop.workshopName,
      workshopOwnerName: workshop.workshopOwnerName,
      number: workshop.number,
      addressText: workshop.address.text,
      addressCoordinates: workshop.address.coordinates,
      email: workshop.email,
      wallet: workshop.wallet,
      workshopImage: workshop.workshopImage,
      services: workshop.services,
    };
    const isPasswordValid = await bcrypt.compare(password, workshop.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", status: false });
    }
    const tokens = generateTokens(workshop);
    res.status(200).json({
      workshop: WorkshopObject,
      tokens,
      message: "Login successful",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export const logoutWorkshop = async (req, res) => {
  if (!req.user.accessToken || !req.user.userId) {
    return res
      .status(400)
      .json({ message: "Token and user ID is required", status: false });
  }
  try {
    const workshop = await workshopModel.findById(req.user.userId);
    if (!workshop) {
      return res
        .status(401)
        .json({ message: "Workshop not found", status: false });
    }
    const findtoken = await BlockedToken.findOne({
      token: req.user.accessToken,
    });
    if (findtoken) {
      return res
        .status(401)
        .json({ message: "Token already blocked", status: false });
    }
    const newblocked = await BlockedToken.create({
      token: req.user.accessToken,
    });
    res.status(200).json({ message: "Logout successful", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
