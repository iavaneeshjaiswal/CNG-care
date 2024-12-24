import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    transactionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentID: {
      type: String,
      required: true,
    },
    refundID: {
        type: String,
        required: true,
      },
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true }
);

export const Refund = mongoose.model("Refund", refundSchema);
