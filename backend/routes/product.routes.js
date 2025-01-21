import express from "express";
const router = express.Router();
import productControl from "../controllers/productControl.js";
import verifyUser from "../middleware/verifyUser.js";
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

router.post(
  "/add-product",
  upload.array("images", 6),
  verifyUser,
  productControl.addProduct
);
router.get("/search", verifyUser, productControl.searchProduct);
router.get("/list-products", verifyUser, productControl.listProduct);
router.get("/get-product/:id", verifyUser, productControl.listSingleProduct);
router.delete("/remove-product/:id", verifyUser, productControl.removeProduct);
router.put("/update-product/:id", verifyUser, productControl.updateProduct);

export default router;
