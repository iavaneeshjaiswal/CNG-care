import workshopModel from "../models/workshop.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/Tokens.js";
import BlockedToken from "../models/blockedToken.js";

const createWorkshop = async (req, res) => {
  try {
    const {
      workshopName,
      ownerName,
      numbers,
      text,
      longitude,
      latitude,
      username,
      password,
      email,
    } = req.body;

    if (
      !workshopName ||
      !ownerName ||
      !numbers ||
      !text ||
      !longitude ||
      !latitude ||
      !username ||
      !password ||
      !email
    ) {
      return res.status(401).json({
        message: "All fields are required",
        status: false,
      });
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be in right way.",
        status: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        status: false,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(401).json({
        message: "Please upload at least one image.",
        status: false,
      });
    }
    const imageUrls = req.files.map((file) => `uploads/${file.filename}`);
    if (imageUrls.length < 1) {
      return res.status(402).json({
        message: "Please upload at least one image.",
        status: false,
      });
    }
    const numberArray = numbers.split(",");
    if (numberArray.length < 1) {
      return res
        .status(401)
        .json({ status: false, message: "Please provide at least one number" });
    }

    const existingWorkshop = await workshopModel.findOne({
      $or: [{ email }, { username }, { numbers: { $in: numberArray } }],
    });

    if (existingWorkshop) {
      return res.status(403).json({
        message: "Workshop already exists",
        status: false,
      });
    }

    const newWorkshop = new workshopModel({
      workshopName,
      ownerName,
      numbers: numberArray,
      address: {
        text,
        coordinates: [
          parseFloat(req.body.latitude),
          parseFloat(req.body.longitude),
        ],
      },
      workshopImage: imageUrls,
      username,
      password: await bcrypt.hash(password, 10),
      email,
    });

    await newWorkshop.save();

    res.status(201).json({
      newWorkshop,
      message: "Workshop created successfully",
      status: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, status: false });
  }
};

const listWorkshop = async (req, res) => {
  try {
    const workshops = await workshopModel.find({});
    if (workshops.length === 0) {
      return res
        .status(404)
        .json({ message: "No workshops found", status: false });
    }
    return res
      .status(200)
      .json({ workshops, status: true, message: "Workshops found" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const findNearbyWorkshops = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
        status: false,
      });
    }

    const { page = 1, limit = 15 } = req.query;

    // Convert latitude and longitude to numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        message: "Invalid latitude or longitude",
        status: false,
      });
    }

    const workshops = await workshopModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat], // Remember that coordinates are [longitude, latitude]
          },
          distanceField: "distance",
          maxDistance: 15000, // 15 km in meters
          spherical: true,
        },
      },
      {
        $match: {
          available: true, // Only include available workshops
        },
      },
      {
        $skip: (page - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    if (workshops.length === 0) {
      return res.status(404).json({
        message: "No available workshops found within 15 km",
        status: false,
      });
    }

    return res.status(200).json({
      workshops: workshops.map((workshop) => ({
        ...workshop,
        distance: workshop.distance.toFixed(2),
        googleMapLink: `https://www.google.com/maps/search/?api=1&query=${workshop.address.coordinates[1]},${workshop.address.coordinates[0]}`,
      })),
      status: true,
      message: "Available workshops found within 15 km",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const loginWorkshop = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
        status: false,
      });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // dude this is the regex pattern for password

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.",
        status: false,
      });
    }

    const workshop = await workshopModel
      .findOne({ username })
      .select("+password");

    if (!workshop) {
      return res.status(404).json({
        message: "Workshop not found",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, workshop.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
        status: false,
      });
    }

    // Coder this is the function that generates the tokens
    const { accessToken } = generateTokens(workshop);

    return res.status(200).json({
      message: "Login successful",
      status: true,
      workshop: {
        username: workshop.username,
        _id: workshop._id,
        workshopName: workshop.workshopName,
        available: workshop.available,
      },
      accessToken,
    });
  } catch (error) {
    // dude this is the Log which shows error for server-side debugging
    console.error(error);
    return res.status(500).json({
      message: "An error occurred. Please try again later.",
      status: false,
    });
  }
};

const changeAvailability = async (req, res) => {
  try {
    const workshop = await workshopModel.findById(req.user.userId);
    if (!workshop) {
      return res.status(404).json({
        message: "Workshop not found",
        status: false,
      });
    }
    workshop.available = workshop.available ? false : true;
    await workshop.save();

    return res.status(200).json({
      message: "Workshop availability status updated successfully",
      status: true,
      isAvailable: workshop.available,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred. Please try again later.",
      status: false,
    });
  }
};

export const workshopLogout = async (req, res) => {
  if (!req.token || !req.user.userId) {
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
    const findtoken = await BlockedToken.findOne({ token: req.token });
    if (findtoken) {
      return res
        .status(401)
        .json({ message: "Token already blocked", status: false });
    }
    const newblocked = await BlockedToken.create({
      token: req.token,
    });
    await newblocked.save();
    return res
      .status(200)
      .json({ message: "Logout successfully", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export default {
  createWorkshop,
  listWorkshop,
  findNearbyWorkshops,
  loginWorkshop,
  changeAvailability,
  workshopLogout,
};
