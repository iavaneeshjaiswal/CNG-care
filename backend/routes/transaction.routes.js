import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import transactionControler from "../controllers/transactionControl.js";

const router = express.Router();

router.get("/", verifyUser, transactionControler.viewTransaction);
router.post("/", verifyUser, transactionControler.createRazorpayOrder);

export default router;
