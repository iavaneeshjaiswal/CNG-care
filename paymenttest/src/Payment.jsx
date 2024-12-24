// Payment.js
import React, { useState } from "react";

const Payment = () => {
  const products = [
    {
      _id: "675427adbae9ba1a95476fda",
      quantity: 1,
    },
    {
      _id: "675fbb7545ed49a97de5ab18",
      quantity: 2,
    },
  ];

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzRmMzIxZmZmYzBmOTc3NWFlMGVkNzgiLCJpYXQiOjE3MzQyODQ2MDd9.JlFwx-dgMJBGDYRjtK8jTUdVEhMs6ITHqge4Si-hE5g`,
        },
        body: JSON.stringify({ products }),
      });

      const data = await response.json();
      if (data.status && data.RazorpayOrderId) {
        // Razorpay order created successfully, now open the Razorpay checkout
        const options = {
          key: "rzp_test_KJT1gVRXpP4vOB", // Replace with your Razorpay key
          amount: data.amount, // Amount in paise
          currency: "INR",
          name: "CNG CARE",
          order_id: data.RazorpayOrderId,
          handler: async function (response) {
            // Send the payment details to your backend for verification
            await fetch("http://localhost:3000/api/verifyandorder", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzRmMzIxZmZmYzBmOTc3NWFlMGVkNzgiLCJpYXQiOjE3MzQyODQ2MDd9.JlFwx-dgMJBGDYRjtK8jTUdVEhMs6ITHqge4Si-hE5g`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                products,
                address: "cng care adress",
              }),
            })
              .then((res) => res.json())
              .then((verificationData) => {
                if (verificationData.status === true) {
                  alert("Payment Verified and Successful!");
                } else {
                  alert(
                    "Payment Verification Failed ",
                    verificationData.message
                  );
                }
              })
              .catch((error) => {
                alert("Payment Verification Failed");
                console.error("Verification Error:", error);
              });
          },
          prefill: {
            name: "John Doe",
            email: "john.doe@example.com",
            contact: "9876543210",
          },
          notes: {
            address: "CNG-CARE Address",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Failed to create Razorpay order");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error in payment process");
    }
  };

  return (
    <div>
      <h2>Payment for Products</h2>
      <button onClick={handlePayment}>Pay with Razorpay</button>
    </div>
  );
};

export default Payment;
