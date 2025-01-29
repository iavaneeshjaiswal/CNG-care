import Product from "../models/product.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Controller to add a new product
const addProduct = async (req, res) => {
  try {
    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one image.",
        status: false,
      });
    }
    const imageUrls = req.files.map((file) => `uploads/${file.filename}`);

    const { category, title, price, quantity, offerPrice, description, brand } =
      req.body;
    const categoryOption = ["CNG", "LPG", "SPARE"];
    // Validate category
    if (!categoryOption.includes(category)) {
      return res.status(400).json({ message: "Invalid category option" });
    }

    // Create new product instance
    const newProduct = new Product({
      category,
      title,
      price,
      quantity,
      brand,
      offerPrice,
      description,
      images: imageUrls,
    });

    // Save product to database
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to list all products
const listProduct = async (req, res) => {
  try {
    const products = await Product.find(
      {},
      "_id category brand title price quantity description images"
    );
    if (products.length === 0 || !products) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json({ products, status: true, message: "Products found" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// Controller to list a single product by ID
const listSingleProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(401)
      .json({ message: "Product ID not found", status: false });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", status: false });
    }
    res.status(200).json({ product, message: "Product founded", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// Controller to remove a product by ID
const removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated images
    product.images.forEach((imageUrl) => {
      const fileName = path.basename(imageUrl);
      const filePath = path.join(__dirname, "../uploads", fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    });

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to update a product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to search products by title
const searchProduct = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json({ status: false, message: "Query not provided" });
  }
  try {
    const products = await Product.find({
      title: { $regex: query, $options: "i" },
    });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No products found with this name" });
    }
    res.status(200).json({ products, status: true, message: "Products found" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// Controller to add multiple products at once
const addBulkProduct = async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "Products must be an array" });
    }
    const createdProducts = await Product.insertMany(products);
    res
      .status(201)
      .json({ message: "Products created successfully", createdProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all product controllers
export default {
  addProduct,
  searchProduct,
  listProduct,
  removeProduct,
  updateProduct,
  listSingleProduct,
  addBulkProduct,
};
