import { Transaction } from "../models/transaction.js";
import razorpayInstance from "../utils/razorpay.js";

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
      amount: amount * 100, 
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


export default { viewTransaction, createRazorpayOrder };
