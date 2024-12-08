import Order from "../models/order.js";
import User from "../models/user.js";
import { Transaction } from "../models/transaction.js";
import dotenv from "dotenv";
dotenv.config();

const addOrder = async (req, res) => {
  const { products, totalAmount, address, orderStatus } = req.body;

  if (!products || products.length === 0) {
    return res
      .status(400)
      .json({ message: "Products are required", status: false });
  }
  if (!totalAmount || totalAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Invalid total amount", status: false });
  }
  if (!address) {
    return res
      .status(400)
      .json({ message: "Address is required", status: false });
  }
  if (!orderStatus) {
    return res
      .status(400)
      .json({ message: "Delivery status is required", status: false });
  }
  try {
    const newOrder = new Order({
      products,
      totalAmount,
      address,
      orderStatus,
      userID: req.user.userId,
    });

    const newTransaction = new Transaction({
      amount: totalAmount,
      status: "success",
      userID: req.user.userId,
      paymentID: newOrder._id,
      orderID: newOrder._id,
    });

    newOrder.transactionID = newTransaction._id;
    await newOrder.save();
    await newTransaction.save();

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    user.orders.push(newOrder._id);
    user.payments.push(newTransaction._id);
    await user.save();

    res.status(200).json({ message: "Order added successfully", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
