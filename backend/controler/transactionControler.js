import { Transaction } from "../models/transaction.js";
import razorpayInstance from "../utils/razorpay.js";
import Product from "../models/product.js";
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
    const amount = async () => {
      let totalAmount = 0;
      for (const product of products) {
        const prod = await Product.findById(product._id);
        if (!prod) {
          return res
            .status(404)
            .json({ message: "Product not found", status: false });
        }
        totalAmount += prod.price * product.quantity;
      }
      return totalAmount;
    };

    const totalAmount = await amount();

    if (totalAmount <= 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid amount provided",
      });
    }

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid amount provided",
      });
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      name: "CNG-CARE",
      description: "Payment for products",
      image: `${process.env.URL}/public/logo.png`,
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
