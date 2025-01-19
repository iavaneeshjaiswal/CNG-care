import express from "express";
const router = express.Router();
import workshopController from "../controllers/workshopControl.js";

router.post("/", workshopController.createWorkshop);
router.get("/", workshopController.listWorkshop);

export default router;
