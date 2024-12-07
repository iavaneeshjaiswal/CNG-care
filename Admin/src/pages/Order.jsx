import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import OrderList from "../components/OrderList";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <div>
      <div className="flex gap-3 w-full">
        <Navbar />
        <OrderList />
      </div>
    </div>
  );
}
