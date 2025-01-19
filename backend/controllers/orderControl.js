import Order from "../models/order.js";
import User from "../models/user.js";
import { Refund } from "../models/refund.js";
import { Transaction } from "../models/transaction.js";
import razorpayInstance from "../utils/razorpay.js";
import Product from "../models/product.js";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import dotenv from "dotenv";
dotenv.config();
import {
  getSuccessEmailTemplate,
  getFailureEmailTemplate,
} from "../utils/emailTemplate.js";

const VerifyAndAddOrder = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      products,
      address,
    } = req.body;
    // Validation
    if (
      !products ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !address
    ) {
      return res.status(400).json({
        status: false,
        message:
          "Missing required fields: RazorpayOrderId, razorpay_order_id, razorpay_signature, or address",
      });
    }
    const user = await User.findById(req.user.userId, "email");
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }
    const userEmail = user.email;
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
      return res.status(401).json({
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

    const productsWithIds = products.map((product) => ({
      product: product._id,
      quantity: product.quantity,
    }));

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayInstance.key_secret)
      .update(body)
      .digest("hex");
    const paymentStatus =
      expectedSignature === razorpay_signature ? "success" : "failed";
    let emailTemplate;

    try {
      const newOrder = new Order({
        products: productsWithIds,
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
        paymentID: razorpay_payment_id,
      });

      newOrder.transactionID = newTransaction._id;

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "User not found",
        });
      }

      user.orders.push(newOrder._id);
      user.transactionID.push(newTransaction._id);
      await newOrder.save();
      await newTransaction.save();
      await user.save();

      emailTemplate =
        paymentStatus === "success"
          ? getSuccessEmailTemplate(
              newOrder._id,
              totalAmount,
              new Date().toISOString().split("T")[0],
              address,
              newTransaction._id
            )
          : getFailureEmailTemplate(
              newOrder._id,
              totalAmount,
              new Date().toISOString().split("T")[0],
              address,
              newTransaction._id
            );

      await sendMail(user.email, emailTemplate, "Order Status");
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error saving order or transaction " + error.message,
      });
    }

    const responseMessage =
      paymentStatus === "success"
        ? "Order added successfully and Payment verified successfully"
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
      .populate("userID", "_id fullName number")
      .populate("products.product", "title price images");
    if (orders) {
      return res.status(200).json({
        orders,
        status: true,
        message: "Orders found successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Order deleted successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const viewOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id,
      "_id products createdAt orderStatus paymentStatus totalAmount address paymentStatus transactionID"
    )
      .populate("products.product", "title price images")
      .populate("userID", "fullName number");
    if (order) {
      return res.status(200).json({
        order,
        status: true,
        message: "Order found successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = req.body.orderStatus;
      await order.save();
      return res.status(200).json({
        status: true,
        message: "Order updated successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", status: false });
    }
    order.orderStatus = "cancelled";
    order.paymentStatus = "refunded";
    const transaction = await Transaction.findById(order.transactionID);
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found", status: false });
    }
    transaction.status = "refunded";

    await refundPayment(
      transaction.paymentID,
      transaction.amount,
      order._id,
      transaction._id,
      order.userID
    );

    await order.save();
    await transaction.save();
    return res.status(200).json({
      status: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const refundPayment = async (
  paymentID,
  amount,
  orderID,
  transactionID,
  userId
) => {
  if (!paymentID || !amount || typeof amount !== "number" || amount < 0) {
    throw new Error(
      "Payment ID and amount are required for refund, amount should be a positive number"
    );
  }
  try {
    const refund = await razorpayInstance.payments.refund(paymentID, {
      amount,
    });
    const newRefund = Refund({
      amount,
      orderID,
      transactionID,
      userID: userId,
      paymentID,
      refundID: refund.id,
    });

    await newRefund.save();
    console.log("Refund successful:", refund);
  } catch (error) {
    console.error("Refund failed:", error);
    throw new Error("Refund failed:", error.message);
  }
};

const orderHistory = async (req, res) => {
  try {
    const orders = await Order.find(
      {
        userID: req.user.userId,
      },
      "_id products createdAt"
    ).populate("products.product", "title price images");
    if (orders.length === 0) {
      return res.status(200).json({
        orders: [],
        status: true,
        message: "No orders found",
      });
    }
    return res.status(200).json({
      orders,
      status: true,
      message: "Orders found successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export default {
  VerifyAndAddOrder,
  viewOrders,
  orderHistory,
  deleteOrder,
  viewOrder,
  updateOrderStatus,
  cancelOrder,
};
