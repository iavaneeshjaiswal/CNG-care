import cluster from "cluster";
import os from "os";
import express from "express";
import bodyParser from "body-parser";
import connectDb from "./connectDb.js";
import cors from "cors";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {
  userLogin,
  signup,
  sendOtp,
  listUser,
  removeUser,
  logout,
  resetpassword,
  updateAddress,
  fetchUserDetail,
  getUserLocation,
} from "./controler/userControl.js";
import adminControl from "./controler/adminControl.js";
import productControl from "./controler/productControl.js";
import orderControl from "./controler/orderControl.js";
import transactionControler from "./controler/transactionControler.js";
import { verifyUser } from "./middleware/verifyUser.js";
import checkRole from "./middleware/authAdmin.js";
import {
  createWorkshop,
  loginWorkshop,
  logoutWorkshop,
} from "./controler/workshopController.js";
import { refreshTokens } from "./utils/Tokens.js";

dotenv.config();

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  console.log(`Master process is running with PID ${process.pid}`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart a worker if it dies
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    cluster.fork();
  });
} else {
  // Storage configuration for multer
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

  // Connect to the database
  connectDb();

  // Constants
  const upload = multer({ storage: storage });
  const app = express();
  const port = process.env.PORT || 3000;

  // Middlewares
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(cors());
  app.use((_, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
  app.use("/uploads", express.static("uploads"));
  app.use("/public", express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Define Routes (Unchanged)
  app.post("/api/user/login", userLogin);
  app.get("/api/user/all-users", verifyUser, listUser);
  app.get("/api/user/user-detail", verifyUser, fetchUserDetail);
  app.post("/api/user/register", signup);
  app.get("/api/user/orderhistory", verifyUser, orderControl.orderHistory);
  app.delete("/api/user/remove-user/:id", verifyUser, removeUser);
  app.post("/api/user/send-otp", sendOtp);
  app.post("/api/user/reset-password", resetpassword);
  app.put("/api/user/update-address", verifyUser, updateAddress);
  app.get("/api/user/location", verifyUser, getUserLocation);
  app.post("/api/user/logout", verifyUser, logout);

  // Admin routes
  app.post("/api/admin/login", adminControl.adminLogin);
  app.post(
    "/api/admin/add-admin",
    verifyUser,
    checkRole("super admin"),
    adminControl.addAdmin
  );
  app.get(
    "/api/admin/list-admin",
    verifyUser,
    checkRole("super admin"),
    adminControl.listAdmin
  );
  app.get(
    "/api/admin/admindetail/:id",
    verifyUser,
    checkRole("super admin"),
    adminControl.admindetail
  );
  app.delete(
    "/api/admin/remove-admin/:id",
    verifyUser,
    checkRole("super admin"),
    adminControl.removeAdmin
  );
  app.put(
    "/api/admin/update-admin/:id",
    verifyUser,
    checkRole("super admin"),
    adminControl.updateAdmin
  );
  app.post("/api/admin/logout", verifyUser, adminControl.logout);

  // Order routes
  app.post("/api/verifyandorder", verifyUser, orderControl.VerifyAndAddOrder);
  app.get("/api/order", verifyUser, orderControl.viewOrders);
  app.get("/api/order/:id", verifyUser, orderControl.viewOrder);
  app.patch(
    "/api/order/update-order-status/:id",
    verifyUser,
    orderControl.updateOrderStatus
  );
  app.delete("/api/order/:id", verifyUser, orderControl.deleteOrder);
  app.patch("/api/cancel-order/:id", verifyUser, orderControl.cancelOrder);

  // Transaction routes
  app.get("/api/transaction", verifyUser, transactionControler.viewTransaction);
  app.post(
    "/api/transaction",
    verifyUser,
    transactionControler.createRazorpayOrder
  );

  // Product routes
  app.post(
    "/api/product/add-product",
    upload.array("images", 12),
    verifyUser,
    productControl.addProduct
  );
  app.get("/api/product/search", verifyUser, productControl.searchProduct);
  app.get("/api/product/list-products", verifyUser, productControl.listProduct);
  app.get(
    "/api/product/get-product/:id",
    verifyUser,
    productControl.listSingleProduct
  );
  app.delete(
    "/api/product/remove-product/:id",
    verifyUser,
    productControl.removeProduct
  );
  app.put(
    "/api/product/update-product/:id",
    verifyUser,
    productControl.updateProduct
  );

  // Protection route
  app.post("/api/protected", refreshTokens);

  //workshop Routes
  app.post("/api/workshop", upload.array("images", 2), createWorkshop);
  app.post("/api/workshop/login", loginWorkshop);
  app.post("/api/workshop/logout", verifyUser, logoutWorkshop);

  // Start the server
  app.listen(port, () => {
    console.log(
      `Worker ${process.pid} started server on http://localhost:${port}`
    );
  });
}
