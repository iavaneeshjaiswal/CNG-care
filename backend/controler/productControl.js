import Product from "../models/product.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
dotenv.config();

const url = process.env.URL;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image." });
    }
    const imageUrls = req.files.map(
      (file) => `${url}/uploads/${file.filename}`
    );

    const { category, title, price, quantity, offerPrice, description, brand } =
      req.body;
    let categoryOption = ["LPG", "CNG"];
    if (!categoryOption.includes(category)) {
      return res.status(400).json({ message: "Invalid category option" });
    }
    let newProduct = new Product({
      category,
      title,
      price,
      quantity,
      brand,
      offerPrice,
      description,
      images: imageUrls,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const listProduct = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      const ProductImages = product.images;
      ProductImages.forEach((imageUrl) => {
        const fileName = path.basename(imageUrl);
        const filePath = path.join(__dirname, "../uploads", fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        } else {
          console.log(`File not found: ${filePath}`);
        }
      });
    }

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
};

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
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const orderPlace = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, {
      customersID: { $addToSet: req.user._id },
    });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  addProduct,
  listProduct,
  removeProduct,
  updateProduct,
  listSingleProduct,
  orderPlace,
};
