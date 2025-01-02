import React from "react";
import Login from "./pages/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Product from "./pages/Product";
import ProductActions from "./pages/ProductActions";
import User from "./pages/User";
import Admin from "./pages/Admin";
import NewAdmin from "./pages/NewAdmin";
import UpdateAdmin from "./pages/UpdateAdmin";
import Order from "./pages/Order";
import Transaction from "./pages/Transaction";
import OrderDetail from "./pages/OrderDetail";
import ProtectRoute from "./components/ProtectRoute";
import Approval from "./pages/Approval";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/products"
          element={
            <ProtectRoute>
              <Product />
            </ProtectRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectRoute>
              <User />
            </ProtectRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectRoute>
              <Admin />
            </ProtectRoute>
          }
        />
        <Route
          path="/addproduct"
          element={
            <ProtectRoute>
              <ProductActions add />
            </ProtectRoute>
          }
        />
        <Route
          path="/addadmins"
          element={
            <ProtectRoute>
              <NewAdmin />
            </ProtectRoute>
          }
        />
        <Route
          path="/updateproduct/:id"
          element={
            <ProtectRoute>
              <ProductActions />
            </ProtectRoute>
          }
        />
        <Route
          path="/updateadmin/:id"
          element={
            <ProtectRoute>
              <UpdateAdmin />
            </ProtectRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectRoute>
              <Order />
            </ProtectRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectRoute>
              <OrderDetail />
            </ProtectRoute>
          }
        />
        <Route
          path="/transaction"
          element={
            <ProtectRoute>
              <Transaction />
            </ProtectRoute>
          }
        />
        <Route
          path="/approval"
          element={
            <ProtectRoute>
              <Approval />
            </ProtectRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
