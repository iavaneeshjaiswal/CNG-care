import express from "express";
const router = express.Router();
import workshopController from "../controllers/workshopControl.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/");
  },
  filename: (_, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, Date.now() + fileExtension);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.array("images", 6), workshopController.createWorkshop);
router.get("/", workshopController.listWorkshop);
router.get("/findNearbyWorkshops", workshopController.findNearbyWorkshops);
export default router;
