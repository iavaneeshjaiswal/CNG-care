import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema({
  WorkshopID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workshop",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    required: true,
    default: "pending",
  },
});
const approvalModel = mongoose.model("Approval", approvalSchema);

export default approvalModel;
