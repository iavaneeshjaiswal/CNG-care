import express from "express";
const router = express.Router();
import servicesControl from "../controllers/servicesControl.js";
import verifyUser from "../middleware/verifyUser.js";

router.post("/", verifyUser, servicesControl.createService);
router.patch(
  "/updateservicestatus",
  verifyUser,
  servicesControl.updateServiceStatus
);
router.patch("/updateservice", verifyUser, servicesControl.updateService);
router.get("/", verifyUser, servicesControl.listService);

export default router;
