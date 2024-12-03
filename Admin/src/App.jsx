import React from "react";
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Product from "./pages/Product";
import ProductActions from "./pages/ProductActions";
import User from "./pages/User";
import Admin from "./pages/Admin";
import NewAdmin from "./pages/NewAdmin";
import UpdateAdmin from "./pages/UpdateAdmin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Product />} />
        <Route path="/" element={<User />} />
        <Route path="/admins" element={<Admin />} />
        <Route path="/addproduct" element={<ProductActions add />} />
        <Route path="/addadmins" element={<NewAdmin />} />
        <Route path="/updateproduct/:id" element={<ProductActions />} />
        <Route path="/updateadmin/:id" element={<UpdateAdmin />} />
      </Routes>
    </Router>
  );
}
