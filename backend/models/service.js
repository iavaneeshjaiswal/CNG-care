import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    transactionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
      required: true,
    },
    workshopID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },
    serviceType: {
      type: String,
      enum: ["BREAKDOWN", "WORKSHOP"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Cancelled", "Accepted", "Pending", "Completed"],
      default: "Pending",
      required: true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
