import User from "../models/user.js";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { generateTokens } from "../utils/Tokens.js";
import sendMail from "../utils/sendMail.js";
import { getOtpEmailtemp } from "../utils/emailTemplate.js";
import BlockedToken from "../models/blockedToken.js";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// User login function
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", status: false });
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailPattern.test(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format", status: false });
    }

    // Find user by email
    const user = await User.findOne(
      { email },
      "_id fullName number email password address"
    );

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", status: false });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", status: false });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Exclude password from the user object before sending response
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      status: true,
      message: "User logged in successfully",
      accessToken,
      refreshToken,
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred during login", status: false });
  }
};

// User signup function
const signup = async (req, res) => {
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
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Send email with OTP
    res.status(201).json({
      status: true,
      message: "User created successfully",
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Send OTP through email and phone number
const sendOtp = async (req, res) => {
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
const verifyOtp = async (req, res) => {
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
const listUser = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const skip = (page - 1) * limit;
    const users = await User.find({}, "_id fullName number email address")
      .skip(skip)
      .limit(limit);
    if (!users || users.length === 0) {
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
const removeUser = async (req, res) => {
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
const updateAddress = async (req, res) => {
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
const resetpassword = async (req, res) => {
  const { credential, new_password, VerifyToken, otp } = req.body;
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

// Get user location
const getUserLocation = async (req, res) => {
  try {
    const { lat, long } = req.body;
    if (!lat || !long) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
        status: false,
      });
    }
    const location = `https://www.google.com/maps?q=${lat},${long}`;
    return res
      .status(200)
      .json({ location, status: true, message: "Location found" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// Fetch user details
const fetchUserDetail = async (req, res) => {
  try {
    const user = await User.findOne(
      { _id: req.user.userId },
      "_id fullName number email address cart favorites"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found", status: false });
    }
    return res
      .status(200)
      .json({ user, status: true, message: "User found successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// Logout function
const logout = async (req, res) => {
  if (!req.body.token || !req.user.userId) {
    return res
      .status(400)
      .json({ message: "Token and user ID is required", status: false });
  }
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found", status: false });
    }
    const findtoken = await BlockedToken.findOne({ token: req.body.token });
    if (findtoken) {
      return res
        .status(401)
        .json({ message: "Token already blocked", status: false });
    }
    const newblocked = await BlockedToken.create({
      token: req.body.token,
    });
    await newblocked.save();
    return res
      .status(200)
      .json({ message: "Logout successfully", status: true });
  } catch (error) {
    console.error("Error deleting cookie:", error.message);
    return res.status(500).json({ message: error.message, status: false });
  }
};

// Add to cart function
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;
    // Validate input fields
    if (!userId || !productId || !quantity) {
      return res
        .status(400)
        .json({ message: "All fields are required", status: false });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Check if product already exists in cart
    const productIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      // Update quantity if product exists
      user.cart[productIndex].quantity += quantity;
    } else {
      // Add new product to cart
      user.cart.push({ productId, quantity });
    }

    // Save user with updated cart
    await user.save();

    return res.status(200).json({
      message: "Product added to cart",
      status: true,
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

//remove from cart function
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    // Validate input fields
    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and product ID are required",
        status: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: { productId } },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    return res.status(200).json({
      message: "Product removed from cart",
      status: true,
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// update cart product quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    // Validate input fields
    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({
        message: "User ID, product ID, and quantity are required",
        status: false,
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Find product in cart
    const productIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      // Update quantity or remove product if quantity becomes zero
      user.cart[productIndex].quantity += quantity;
      if (user.cart[productIndex].quantity <= 0) {
        user.cart.splice(productIndex, 1);
      }
      await user.save();
      return res.status(200).json({
        message: "Product quantity updated in cart",
        status: true,
        cart: user.cart,
      });
    } else {
      return res.status(404).json({
        message: "Product not found in cart",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// Add to favorites function
const addtofev = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    // Validate input fields
    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and product ID are required",
        status: false,
      });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Check if product already exists in favorites
    if (user.favorites.includes(productId)) {
      return res
        .status(400)
        .json({ message: "Product already in favorites", status: false });
    }

    // Add product to favorites
    user.favorites.push(productId);

    // Save user with updated favorites
    await user.save();

    return res.status(200).json({
      message: "Product added to favorites",
      status: true,
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// Remove from favorites function
const removefromfev = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    // Validate input fields
    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and product ID are required",
        status: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { favorites: productId },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    if (!user.favorites.includes(productId)) {
      return res.status(400).json({
        message: "Product already removed from favorites",
        status: false,
      });
    }
    return res.status(200).json({
      message: "Product removed from favorites",
      status: true,
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// View favorites function
const viewFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Validate input fields
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        status: false,
      });
    }

    // Find user by ID
    const user = await User.findById(userId, "favorites").populate({
      path: "favorites",
      select: "category brand title price images",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    if (user.favorites.length === 0) {
      return res.status(400).json({
        message: "No favorites found",
        status: false,
      });
    }
    return res.status(200).json({
      message: "Favorites retrieved successfully",
      status: true,
      favorites: user.favorites,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

// View cart function
const viewcarts = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Validate input fields
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        status: false,
      });
    }

    // Find user by ID
    const user = await User.findById(userId, "cart").populate({
      path: "cart.productId",
      select: "category brand title price images",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    if (user.cart.length === 0) {
      return res.status(400).json({
        message: "No items in cart",
        status: false,
      });
    }
    return res.status(200).json({
      message: "Cart retrieved successfully",
      status: true,
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export default {
  userLogin,
  signup,
  sendOtp,
  listUser,
  removeUser,
  logout,
  resetpassword,
  updateAddress,
  fetchUserDetail,
  getUserLocation,
  addToCart,
  addtofev,
  removeFromCart,
  updateCartQuantity,
  removefromfev,
  viewcarts,
  viewFavorites,
};
