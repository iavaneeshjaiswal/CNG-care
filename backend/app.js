import cluster from "cluster";
import os from "os";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";
import automationForService from "./services/automation.js";

//routers
import userRoutes from "./routes/users.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import workshopRoutes from "./routes/workshop.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

//utils
import { refreshTokens } from "./utils/Tokens.js";
import connectDb from "./connectDb.js";

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`Master process is running with PID ${process.pid}`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart a worker if it dies
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    cluster.fork();
  });
} else {
  // Connect to the database
  connectDb();

  // Constants
  const app = express();
  const port = process.env.PORT || 3000;

  //node corn setup for automation
  cron.schedule("* * * * *", automationForService);

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

  //routes
  app.use("/api/user", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/transaction", transactionRoutes);
  app.use("/api/product", productRoutes);
  app.post("/api/protected", refreshTokens);
  app.use("/api/workshop", workshopRoutes);
  app.use("/api/service", serviceRoutes);

  // Start the server
  app.listen(port, () => {
    console.log(
      `Worker ${process.pid} started server on http://localhost:${port}`
    );
  });
}
