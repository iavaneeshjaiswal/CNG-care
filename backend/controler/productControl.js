import Product from "../models/product.js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const url = process.env.URL;

// add single product with images
const addProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image." });
    }

    const imageUrls = req.files.map(
      (file) => `${url + process.env.PORT}/uploads/${file.filename}`
    );

    const { category, title, price, quantity, offerPrice, description,brand} =
      req.body;

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
    if (product && product.images && product.images.length > 0) {
      product.images.forEach((imageUrl) => {
        const filePath = path.join(
          __dirname,
          "../uploads",
          path.basename(imageUrl)
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
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
