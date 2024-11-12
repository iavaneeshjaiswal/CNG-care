import express from "express";
import bodyParser from "body-parser";
import connectDb from "./connectDb.js";
import userControl from './controler/userControl.js';
import adminControl from './controler/adminControl.js';
import productControl from './controler/productControl.js';
import orderControl from './controler/orderControl.js';
const { userLogin, signup, sendOtp, listUser } = userControl;
const { adminLogin, addAdmin, listAdmin, removeAdmin, updateAdmin } = adminControl;
const { addProduct, listProduct, removeProduct , updateProduct,addManyProduct} = productControl;
import dotenv from "dotenv";
dotenv.config();
 
// connect to database
connectDb()

const app = express();
app.use(bodyParser.json());

// User routes
app.post("/user/login", userLogin);
app.get("/user/all-users",listUser)
app.post("/user/register",signup );
app.post("/user/send-otp", sendOtp);

// Admin routes
app.post("/admin/login", adminLogin);
app.post("/admin/add-admin", addAdmin);
app.get("/admin/list-admin", listAdmin);
app.delete("/admin/remove-admin/:id", removeAdmin);
app.put("/admin/update-admin/:id", updateAdmin);
app.get("/admin/all-users",listUser)


//Order Routes
app.post("/order/add-order", orderControl);
//Product routes
app.post("/product/add-product", addProduct);
app.post("/product/add-bulk-product", addManyProduct);
app.get("/product/list-product", listProduct);
app.delete("/product/remove-product/:id", removeProduct);
app.put("/product/update-product/:id", updateProduct);

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on port ${process.env.PORT || 4000} and URL is ${`http://localhost:${process.env.PORT || 4000}`}`);
});