import { Transaction } from "../models/transaction.js";
import razorpayInstance from "../utils/razorpay.js";
import Product from "../models/product.js";
import { v4 as uuidv4 } from "uuid";

const viewTransaction = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      .skip(skip)
      .limit(limit)
      .populate("userID");

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
  try {
    const { products } = req.body;
    const productIds = products.map((product) => product._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    if (dbProducts.length !== products.length) {
      return res.status(404).json({
        status: false,
        message: "Some products were not found",
      });
    }

    const totalAmount = products.reduce((sum, product) => {
      const dbProduct = dbProducts.find(
        (p) => p._id.toString() === product._id.toString()
      );
      return sum + (dbProduct.price * product.quantity || 0);
    }, 0);

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
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export default { viewTransaction, createRazorpayOrder };
