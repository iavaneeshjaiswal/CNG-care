import express from "express";
const router = express.Router();
import userControl from "../controllers/userControl.js";
import verifyUser from "../middleware/verifyUser.js";
import orderControl from "../controllers/orderControl.js";

router.post("/login", userControl.userLogin);
router.get("/all-users", verifyUser, userControl.listUser);
router.get("/user-detail", verifyUser, userControl.fetchUserDetail);
router.post("/register", userControl.signup);
router.get("/orderhistory", verifyUser, orderControl.orderHistory);
router.delete("/remove-user/:id", verifyUser, userControl.removeUser);
router.post("/send-otp", userControl.sendOtp);
router.post("/reset-password", userControl.resetpassword);
router.put("/update-address", verifyUser, userControl.updateAddress);
router.get("/location", verifyUser, userControl.getUserLocation);
router.post("/logout", verifyUser, userControl.logout);
router.post("/addtocart", verifyUser, userControl.addToCart);
router.get("/viewcarts", verifyUser, userControl.viewcarts);
router.delete("/removeFromCart", verifyUser, userControl.removeFromCart);
router.put("/updateCartQuantity", verifyUser, userControl.updateCartQuantity);
router.post("/addtofev", verifyUser, userControl.addtofev);
router.delete("/removefromfev", verifyUser, userControl.removefromfev);
router.get("/viewfavorites", verifyUser, userControl.viewFavorites);

export default router;
