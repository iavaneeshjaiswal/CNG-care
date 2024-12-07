import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";

function OrderDetail() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/order/view-order/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrderDetail(data.order);
        console.log(data.order);
      } catch (error) {
        console.error("Error fetching order detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  return (
    <div className="flex gap-3 w-full">
      <Navbar />
      <div className="p-4 box-border bg-white mt-5 rounded-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <p className="flex items-center justify-start mb-2">
          <strong>Order ID:</strong>
          <span className="font-medium">{orderDetail?._id}</span>
        </p>
        <p className="flex items-center justify-start mb-2">
          <strong>User ID:</strong>
          <span className="font-medium">{orderDetail?.userID}</span>
        </p>
        <p className="flex items-center justify-start mb-4">
          <strong>Total Amount:</strong>
          <span className="font-medium">${orderDetail?.totalAmount}</span>
        </p>
        <h3 className="text-xl font-bold mb-2">Products:</h3>
        <ul className="list-disc pl-8">
          {orderDetail?.products.map(({ product, quantity, _id }) => (
            <li key={_id} className="mb-2">
              <p className="flex items-center justify-start">
                <strong>Product ID:</strong>
                <span className="font-medium">{product}</span>
              </p>
              <p className="flex items-center justify-start">
                <strong>Quantity:</strong>
                <span className="font-medium">{quantity}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="flex items-center justify-start mt-4">
          <strong>Transaction ID:</strong>
          <span className="font-medium">{orderDetail?.transactionID}</span>
        </p>
      </div>
    </div>
  );
}

export default OrderDetail;
