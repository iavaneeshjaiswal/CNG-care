import mongoose from "mongoose";
import { type } from "os";

const orderSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    transactionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["success", "failed"],
    },
    orderStatus: {
      type: String,
      required: true,
      enum: [
        "Pending",
        "Order Placed",
        "Order Shipped",
        "Out For Delivery",
        "Delivered",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
