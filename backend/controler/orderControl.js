import Order from "../models/order.js";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const addOrder = async (req, res) => {
  const { products, totalAmount, address, deliveryStatus } = req.body;
  try {
    const newOrder = new Order({
      products,
      totalAmount,
      address,
      deliveryStatus,
      user: req.user.userId,
    });
    await newOrder.save();
    const user = await User.findById(req.user.userId);
    user.orders.push(newOrder._id);
    await user.save();
    res.status(200).json({ message: "Order added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewOrders = async () => {
  try {
    const orders = await Order.find();
    if (orders) {
      res
        .status(200)
        .json({ orders, status: true, message: "Orders found successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export default { addOrder, viewOrders };
