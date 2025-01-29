import { Transaction } from "../models/transaction.js";
import razorpayInstance from "../utils/razorpay.js";
import Product from "../models/product.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const viewTransaction = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(
      {},
      "_id amount  status userID paymentID orderID createdAt"
    )
      .skip(skip)
      .limit(limit)
      .populate("userID", "fullName");

    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No transactions found" });
    }

    res.status(200).json({
      status: true,
      transactions,
      message: "Transactions found successfully",
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const createRazorpayOrder = async (req, res) => {
  const { products } = req.body;
  console.log(products);
  try {
    // Check if products are provided and are an array
    if (!products || !Array.isArray(products)) {
      return res.status(404).json({
        status: false,
        message: "Products are important",
      });
    }

    // Check if all products exist in the database
    const productIds = products.map(
      (product) => new mongoose.Types.ObjectId(product.id)
    );
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== products.length) {
      return res.status(404).json({
        status: false,
        message: "Some products were not found",
      });
    }

    let totalAmount = 0;
    // Calculate the total amount by summing up the price of each product
    // in the products array.
    products.forEach((product) => {
      const dbProduct = dbProducts.find(
        (p) => p._id.toString() === product.id.toString()
      );
      totalAmount += dbProduct.price * product.quantity;
    });

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid amount provided",
      });
    }

    const receiptId = `receipt_${uuidv4().substring(0, 30)}`;
    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: receiptId,
    };

    const response = await razorpayInstance.orders.create(options);

    res.status(200).json({
      status: true,
      RazorpayOrderId: response.id,
      message: "Razorpay order created successfully",
      amount: response.amount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export default { viewTransaction, createRazorpayOrder };
