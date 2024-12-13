import { Transaction } from "../models/transaction.js";
import razorpayInstance from "../utils/razorpay.js";
import crypto from "crypto";
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
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid amount provided",
      });
    }

    const options = {
      amount: amount * 100, // Amount in paise (100 paise = 1 INR)
      currency: "INR",
      receipt: `receipt_${Math.random()}`,
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

const verifyPayment = async (req, res) => {
  try {
    const { payment_id, RazorpayOrderId, signature } = req.body;

    if (!payment_id || !RazorpayOrderId || !signature) {
      return res.status(400).json({
        status: false,
        message:
          "Missing required fields: payment_id, RazorpayOrderId, or signature",
      });
    }

    const body = `${RazorpayOrderId}|${payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayInstance.key_secret)
      .update(body)
      .digest("hex");

    if (expectedSignature === signature) {
      res.status(200).json({ status: true, message: "Payment verified" });
    } else {
      res
        .status(400)
        .json({ status: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error during payment verification",
    });
  }
};

export default { viewTransaction, createRazorpayOrder, verifyPayment };
