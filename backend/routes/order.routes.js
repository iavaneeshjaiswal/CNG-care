import express from "express";
import verifyUser from "../middleware/verifyUser.js";
const router = express.Router();
import orderControl from "../controllers/orderControl.js";

router.post("/verifyandorder", verifyUser, orderControl.VerifyAndAddOrder);
router.get("/", verifyUser, orderControl.viewOrders);
router.get("/:id", verifyUser, orderControl.viewOrder);
router.patch(
  "/update-order-status/:id",
  verifyUser,
  orderControl.updateOrderStatus
);
router.delete("/:id", verifyUser, orderControl.deleteOrder);
router.patch("/cancel-order/:id", verifyUser, orderControl.cancelOrder);

export default router;
