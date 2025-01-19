import express from "express";
import adminControl from "../controllers/adminControl.js";
import verifyUser from "../middleware/verifyUser.js";
import checkRole from "../middleware/authAdmin.js";
const router = express.Router();

router.post("/login", adminControl.adminLogin);
router.post(
  "/add-admin",
  verifyUser,
  checkRole("super admin"),
  adminControl.addAdmin
);
router.get(
  "/list-admin",
  verifyUser,
  checkRole("super admin"),
  adminControl.listAdmin
);
router.get(
  "/admindetail/:id",
  verifyUser,
  checkRole("super admin"),
  adminControl.admindetail
);
router.delete(
  "/remove-admin/:id",
  verifyUser,
  checkRole("super admin"),
  adminControl.removeAdmin
);
router.put(
  "/update-admin/:id",
  verifyUser,
  checkRole("super admin"),
  adminControl.updateAdmin
);
router.post("/logout", verifyUser, adminControl.logout);

export default router;
