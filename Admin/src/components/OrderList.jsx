import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("all");

  const url = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const { data } = await axios.get(`${url}/order`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setOrders(data.orders);
      setIsLoading(false);
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (deliveryStatus !== "all" && order.orderStatus !== deliveryStatus) {
      return false;
    }
    if (
      searchTerm &&
      !order._id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-2 box-border bg-white mt-5 rounded-sm w-full">
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <div className="w-full mb-4 gap-4 flex">
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-4/6 border-2 rounded focus:outline-none col-span-1"
          />
          <select
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
            className="p-2 w-2/6 border-2 rounded focus:outline-none col-span-1"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Order Shipped">Order Shipped</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <p className="text-lg font-bold text-start my-2 w-full ">
          Total Orders: {orders.length || 0}
        </p>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <table className="w-full mx-auto text-sm">
            <thead>
              <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200">
                <th className="p-2 text-start">ORDER ID</th>
                <th className="p-2 text-start">CUSTOMER NAME</th>
                <th className="p-2 text-start">TRANSACTION ID</th>
                <th className="p-2 text-start">AMOUNT</th>
                <th className="p-2 text-start">DELIVERY STATUS</th>
                <th className="p-2 text-start">PAYMENT STATUS</th>
                <th className="p-2 text-start">ORDER DATE</th>
                <th className="p-2 text-start">ORDER TIME</th>
                <th className="p-2 text-start">VIEW</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-2 text-start">{order._id}</td>
                    <td className="p-2 text-start">{order.userID.fullName}</td>
                    <td className="p-2 text-start">{order.transactionID}</td>
                    <td className="p-2 text-start">
                      {order.totalAmount.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    <td
                      className={`p-2 text-start font-bold ${
                        order.orderStatus === "Pending"
                          ? "text-red-500"
                          : order.orderStatus === "cancelled"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {order.orderStatus}
                    </td>
                    <td
                      className={`p-2 text-start font-bold ${
                        order.paymentStatus === "failed"
                          ? "text-red-500"
                          : order.paymentStatus === "refunded"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </td>
                    <td className="p-2 text-start ">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2 text-start ">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="p-2 text-start ">
                      <Link to={`/order/${order._id}`}>
                        <i className="ri-eye-line cursor-pointer"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-2 text-center text-gray-400 text-lg"
                  >
                    NO ORDERS
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrderList;
