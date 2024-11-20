import React from "react";
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Product from "./pages/Product";
import NewProduct from "./pages/NewProduct";
import User from "./pages/User";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import UpdateProduct from "./pages/UpdateProduct";
export default function App() {
  return (

    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Product />} />
        <Route path="/" element={<User />} />
        <Route path="/admins" element={<Admin />} />
        <Route path="/addproduct" element={<NewProduct />} />
        <Route path="/updateproduct/:id" element={<UpdateProduct />} />
      </Routes>
    </Router>

  );
}
