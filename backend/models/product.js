/*************  ✨ Codeium Command 🌟  *************/
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"]
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    offerPrice: {
      type: Number,
      required: [true, "Offer Price is required"],
      min: [0, "Offer Price must be a positive number"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be a positive number"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    images: [
      {
        type: String,
        required: [true, "Image is required"]
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
