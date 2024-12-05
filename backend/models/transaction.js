import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "success"],
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    TransactionID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default Transaction = mongoose.model("Transaction", transactionSchema);
