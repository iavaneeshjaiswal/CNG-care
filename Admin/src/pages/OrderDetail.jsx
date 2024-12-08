import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

function OrderDetail() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const url = import.meta.env.VITE_APP_URL;
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const { data } = await axios.get(`${url}/order/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrderDetail(data.order);
        setDeliveryStatus(data.order.orderStatus);
      } catch (error) {
        console.error("Error fetching order detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const handleDeliveryStatusChange = async (e) => {
    try {
      await axios.post(
        `${url}/order/update-order-status/${id}`,
        { orderStatus: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDeliveryStatus(e.target.value);
      alert(`Order status updated to ${e.target.value}`);
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <Navbar />
      <div className="p-2 box-border bg-white mt-5 rounded-sm w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="px-4 py-2">
            <h1 className="text-2xl w-full text-center font-bold">
              Order Detail
            </h1>
            {orderDetail && (
              <div>
                <div className="flex flex-col gap-2">
                  <p className="font-semibold">Order ID: {orderDetail._id}</p>
                  <p className="font-semibold">
                    Customer Name: {orderDetail.userID.fullName}
                  </p>
                  <p className="font-semibold">
                    Transaction ID: {orderDetail.transactionID}
                  </p>
                  <p className="font-semibold">
                    Delivery Address: {orderDetail.address}
                  </p>
                  <p className="font-semibold">
                    Customer Phone Number: +91{orderDetail.userID.number}
                  </p>
                  <p className="flex items-center gap-2">
                    Delivery Status:{" "}
                    <select
                      value={deliveryStatus}
                      onChange={handleDeliveryStatusChange}
                      className="p-2 border-2 rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Order Shipped">Order Shipped</option>
                      <option value="Out For Delevery">Out For Delevery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </p>
                  <p className="font-semibold">Products:</p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 text-start">Product Image</th>
                      <th className="p-2 text-start">Product Name</th>
                      <th className="p-2 text-start">Brand Name</th>
                      <th className="p-2 text-start">Quantity</th>
                      <th className="p-2 text-start">Amount</th>
                      <th className="p-2 text-start">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetail.products.map((product) => (
                      <tr key={product._id} className="border">
                        <td className="p-2 text-lg">
                          <img
                            src={product.product.images[0]}
                            alt={product.product.images[0]}
                            className="h-24 w-24"
                          />
                        </td>
                        <td className="p-2 font-semibold text-lg border">
                          {product.product.title}
                        </td>
                        <td className="p-2 font-semibold text-lg border">
                          {product.product.brand}
                        </td>
                        <td className="p-2 font-semibold text-lg border">
                          {product.quantity}
                        </td>
                        <td className="p-2 font-semibold text-lg border">
                          {product.product.price.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                        <td className="p-2 font-semibold text-lg border">
                          {(
                            product.product.price * product.quantity
                          ).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                      </tr>
                    ))}
                    <tr className="border">
                      <td
                        className="p-2 font-semibold text-lg text-end border"
                        colSpan="5"
                      >
                        Total Amount :
                      </td>
                      <td className="p-2 font-semibold text-lg">
                        {orderDetail.totalAmount.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetail;
