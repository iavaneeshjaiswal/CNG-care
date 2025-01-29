import express from "express";
const router = express.Router();
import servicesControl from "../controllers/servicesControl.js";
import verifyUser from "../middleware/verifyUser.js";
router.post("/", verifyUser, servicesControl.createService);
router.patch(
  "/updateservicestatus/:id",
  verifyUser,
  servicesControl.updateServiceStatus
);
router.get(
  "/getpendingrequests",
  verifyUser,
  servicesControl.getPendingRequests
);
router.get(
  "/getacceptedrequests",
  verifyUser,
  servicesControl.getAcceptedRequests
);
router.get("/", verifyUser, servicesControl.listService);
router.get("/:id", verifyUser, servicesControl.listServiceForCustomer);
router.patch("/complete", verifyUser, servicesControl.completeService);

export default router;
