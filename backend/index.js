import express from "express";
import bodyParser from "body-parser";
import connectDb from "./connectDb.js";
import userControl from "./controler/userControl.js";
import adminControl from "./controler/adminControl.js";
import productControl from "./controler/productControl.js";
import orderControl from "./controler/orderControl.js";
import transactionControler from "./controler/transactionControler.js";
import cors from "cors";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import verifyUser from "./middleware/verifyUser.js";
import checkRole from "./middleware/authAdmin.js";
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, Date.now() + fileExtension);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// connect to database
connectDb();

//constants
const upload = multer({ storage: storage });
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
// User routes
app.post("/user/login", userControl.userLogin);
app.get("/user/all-users", verifyUser, userControl.listUser);
app.post("/user/register", userControl.signup);
app.delete("/user/remove-user/:id", verifyUser, userControl.removeUser);
app.post("/user/send-otp", userControl.sendOtp);
app.post("/user/reset-password", userControl.resetpassword);
app.post("/user/update-address", verifyUser, userControl.updateAddress);

// Admin routes
app.post("/admin/login", adminControl.adminLogin);
app.post(
  "/admin/add-admin",
  verifyUser,
  checkRole("super admin"),
  adminControl.addAdmin
);
app.get(
  "/admin/list-admin",
  verifyUser,
  checkRole("super admin"),
  adminControl.listAdmin
);
app.get(
  "/admin/admindetail/:id",
  verifyUser,
  checkRole("super admin"),
  adminControl.admindetail
);
app.delete(
  "/admin/remove-admin/:id",
  verifyUser,
  checkRole("super admin"),
  adminControl.removeAdmin
);
app.put(
  "/admin/update-admin/:id",
  verifyUser,
  checkRole("super admin"),
  adminControl.updateAdmin
);
app.post("/admin/logout", verifyUser, adminControl.logout);

//Order Routes
app.post("/order", verifyUser, orderControl.addOrder);
app.get("/order", verifyUser, orderControl.viewOrders);
app.get("/order/:id", verifyUser, orderControl.viewOrder);
app.post(
  "/order/update-order-status/:id",
  verifyUser,
  orderControl.updateOrderStatus
);
app.delete("/order/:id", verifyUser, orderControl.deleteOrder);

//Transaction Routes
app.get("/transaction", verifyUser, transactionControler.viewTransaction);
app.post("/transaction", verifyUser, transactionControler.createRazorpayOrder);
// app.post("/transaction/verify", verifyUser, transactionControler.verifyPayment);

//Product routes
app.post(
  "/product/add-product",
  upload.array("images", 12),
  verifyUser,
  productControl.addProduct
);
app.get("/product/list-product", verifyUser, productControl.listProduct);
app.get(
  "/product/get-product/:id",
  verifyUser,
  productControl.listSingleProduct
);
app.delete(
  "/product/remove-product/:id",
  verifyUser,
  productControl.removeProduct
);
app.put(
  "/product/update-product/:id",
  verifyUser,
  productControl.updateProduct
);

app.listen(port, () => {
  console.log(
    `Server started on port ${port} and URL is ${`http://localhost:${port}`}`
  );
});
