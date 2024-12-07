import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const { data } = await axios.get(
        "http://localhost:3000/order/view-allOrders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders(data.orders);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order._id
      .replace(/\s+/g, "")
      .toLowerCase()
      .includes(searchTerm.replace(/\s+/g, "").toLowerCase())
  );

  return (
    <div className="p-2 box-border bg-white mt-5 rounded-sm w-full">
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-full border-2 rounded focus:outline-none"
          />
        </div>

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
                    <td className="p-2 text-start">₹{order.totalAmount}</td>
                    <td className="p-2 text-start">{order.orderStatus}</td>
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
