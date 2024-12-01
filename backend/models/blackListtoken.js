import mongoose from "mongoose";

const blackListtokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  created_by: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

const blackListedToken = mongoose.model(
  "blackListedToken",
  blackListtokenSchema
);
export default blackListedToken;
