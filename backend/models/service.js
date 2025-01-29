import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
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
      enum: ["Rejected", "Accepted", "Pending", "Completed"],
      default: "Pending",
      required: true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
