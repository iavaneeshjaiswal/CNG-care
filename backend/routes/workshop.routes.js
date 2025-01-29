import express from "express";
const router = express.Router();
import workshopController from "../controllers/workshopControl.js";
import multer from "multer";
import path from "path";
import verifyUser from "../middleware/verifyUser.js";
import checkRole from "../middleware/authAdmin.js";

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

router.post(
  "/",
  verifyUser,
  checkRole("super admin"),
  upload.array("images", 6),
  workshopController.createWorkshop
);
router.post("/login", workshopController.loginWorkshop);
router.patch(
  "/availability",
  verifyUser,
  workshopController.changeAvailability
);
router.get("/", verifyUser, workshopController.listWorkshop);
router.get(
  "/findNearbyWorkshops",
  verifyUser,
  workshopController.findNearbyWorkshops
);
router.post("/logout", verifyUser, workshopController.workshopLogout);
export default router;
