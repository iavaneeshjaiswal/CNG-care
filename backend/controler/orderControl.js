import Order from "../models/order.js";
import User from "../models/user.js";
import { Transaction } from "../models/transaction.js";
import razorpayInstance from "../utils/razorpay.js";
import Product from "../models/product.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const addOrder = async (req, res) => {
  try {
    const {
      payment_id,
      RazorpayOrderId,
      signature,
      products,
      address,
      orderStatus,
    } = req.body;

    if (!payment_id || !RazorpayOrderId || !signature) {
      return res.status(400).json({
        status: false,
        message:
          "Missing required fields: payment_id, RazorpayOrderId, or signature",
      });
    }
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products are required", status: false });
    }
    if (!totalAmount || typeof totalAmount !== "number" || totalAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid total amount", status: false });
    }
    if (!address || typeof address !== "string" || address.trim() === "") {
      return res
        .status(400)
        .json({ message: "Address is required", status: false });
    }
    if (!orderStatus || typeof orderStatus !== "string") {
      return res
        .status(400)
        .json({ message: "Delivery status is required", status: false });
    }

    const body = `${RazorpayOrderId}|${payment_id}`;

    const calculateTotalAmount = async () => {
      let totalAmount = 0;
      for (const product of products) {
        const prod = await Product.findById(product.productID);
        if (!prod) {
          return res
            .status(404)
            .json({ message: "Product not found", status: false });
        }
        totalAmount += prod.price * product.quantity;
      }
      return totalAmount;
    };

    const totalAmount = await calculateTotalAmount();

    const expectedSignature = crypto
      .createHmac("sha256", razorpayInstance.key_secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      const newOrder = new Order({
        products,
        totalAmount,
        address,
        paymentStatus: "failed",
        orderStatus,
        userID: req.user.userId,
      });

      const newTransaction = new Transaction({
        amount: totalAmount,
        status: "failed",
        userID: req.user.userId,
        orderID: newOrder._id,
        paymentID: payment_id,
      });

      await newOrder.save();
      await newTransaction.save();
      return res
        .status(400)
        .json({ status: false, message: "Payment verification failed" });
    }

    try {
      const newOrder = new Order({
        products,
        totalAmount,
        address,
        paymentStatus: "success",
        orderStatus,
        userID: req.user.userId,
      });

      const newTransaction = new Transaction({
        amount: totalAmount,
        status: "success",
        userID: req.user.userId,
        orderID: newOrder._id,
        paymentID: payment_id,
      });

      newOrder.transactionID = newTransaction._id;
      await newOrder.save();
      await newTransaction.save();

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", status: false });
      }

      user.orders.push(newOrder._id);
      user.transactionID.push(newTransaction._id);
      await user.save();

      return res
        .status(200)
        .json({ message: "Order added successfully", status: true });
    } catch (error) {
      console.error("Error adding order:", error);
      return res.status(500).json({ message: error.message, status: false });
    }
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
  addOrder,
  viewOrders,
  deleteOrder,
  viewOrder,
  updateOrderStatus,
};
