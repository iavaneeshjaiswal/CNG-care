import Order from "../models/order.js";
import User from "../models/user.js";
import { Transaction } from "../models/transaction.js";
import razorpayInstance from "../utils/razorpay.js";
import Product from "../models/product.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
const VerifyAndAddOrder = async (req, res) => {
  try {
    const { payment_id, RazorpayOrderId, signature, products, address } =
      req.body;

    // Validation
    if (!payment_id || !RazorpayOrderId || !signature) {
      return res.status(400).json({
        status: false,
        message:
          "Missing required fields: payment_id, RazorpayOrderId, or signature",
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Products are required",
      });
    }

    if (!address || typeof address !== "string" || address.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Address is required",
      });
    }

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
        (p) => p._id.toString() === product._id
      );
      return sum + (dbProduct.price * product.quantity || 0);
    }, 0);

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid total amount",
      });
    }

    const body = `${RazorpayOrderId}|${payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayInstance.key_secret)
      .update(body)
      .digest("hex");

    const paymentStatus =
      expectedSignature === signature ? "success" : "failed";

    const newOrder = new Order({
      products,
      totalAmount,
      address,
      paymentStatus,
      orderStatus: "Pending",
      userID: req.user.userId,
    });

    const newTransaction = new Transaction({
      amount: totalAmount,
      status: paymentStatus,
      userID: req.user.userId,
      orderID: newOrder._id,
      paymentID: payment_id,
    });

    newOrder.transactionID = newTransaction._id;

    await newOrder.save();
    await newTransaction.save();

    // Link order and transaction to user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    user.orders.push(newOrder._id);
    user.transactionID.push(newTransaction._id);
    await user.save();

    const responseMessage =
      paymentStatus === "success"
        ? "Order added successfully"
        : "Payment verification failed, order saved with failed status";

    const statusCode = paymentStatus === "success" ? 200 : 400;

    return res.status(statusCode).json({
      status: paymentStatus === "success",
      message: responseMessage,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error during payment verification",
    });
  }
};

const viewOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userID")
      .populate("products.product");
    if (orders) {
      res.status(200).json({
        orders,
        status: true,
        message: "Orders found successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Order deleted successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const viewOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .populate("userID");
    if (order) {
      res.status(200).json({
        order,
        status: true,
        message: "Order found successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = req.body.orderStatus;
      await order.save();
      res.status(200).json({
        status: true,
        message: "Order updated successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export default {
  VerifyAndAddOrder,
  viewOrders,
  deleteOrder,
  viewOrder,
  updateOrderStatus,
};
