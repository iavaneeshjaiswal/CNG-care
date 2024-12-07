import { Transaction } from "../models/transaction.js";

const viewTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("userID");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { viewTransaction };
