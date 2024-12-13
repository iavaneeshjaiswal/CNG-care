import { Transaction } from "../models/transaction.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "your_razorpay_key_id", 
  key_secret: "your_razorpay_key_secret", 
});

const viewTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("userID");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { viewTransaction };
