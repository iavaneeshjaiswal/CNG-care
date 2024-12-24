const getSuccessEmailTemplate = (
  orderId,
  totalAmount,
  orderDate,
  shippingAddress,
  transactionid
) => {
  return `
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Success</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; }
            .header h1 { color: #28a745; }
            .order-details { padding: 15px; background-color: #f9f9f9; border-radius: 4px; margin-bottom: 20px; }
            .footer { text-align: center; font-size: 12px; color: #888; }
            .footer a { color: #007bff; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmed</h1>
                <p>Thanks for your purchase! We appreciate it and hope you love your order!</p>
            </div>
            <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Transaction ID:</strong> ${transactionid}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
            </div>
            <div class="footer">
                <p>If you have any questions, feel free to <a href="mailto:cngcareofficial@gmail.com">contact us</a>.</p>
                <p>&copy; 2024 CNG Care</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const getFailureEmailTemplate = (
  orderId,
  totalAmount,
  orderDate,
  shippingAddress,
  transactionid
) => {
  return `
        <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Failed</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; }
            .header h1 { color: #dc3545; }
            .order-details { padding: 15px; background-color: #f9f9f9; border-radius: 4px; margin-bottom: 20px; }
            .footer { text-align: center; font-size: 12px; color: #888; }
            .footer a { color: #007bff; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Failed</h1>
                <p>Oops, something went wrong with your order! We're sorry – please try again, and we're here to help!</p>
            </div>
            <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Transaction ID:</strong> ${transactionid}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
            </div>
                <div class="footer">
                    <p>If you believe this is an error, please <a href="mailto:cngcareofficial@gmail.com">contact us</a>.</p>
                    <p>&copy; 2024 CNG Care</p>
                </div>
        </div>
    </body>
    </html>
  `;
};

const getOtpEmailtemp = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f8ff; /* Soft light blue */
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff; /* White background */
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #4a90e2; /* Soft blue */
        }
        .otp {
            font-size: 26px;
            font-weight: bold;
            color: #333; /* Dark gray */
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #e6f7ff; /* Light blue background */
            border-radius: 6px;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #333; /* Dark gray */
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999; /* Light gray */
            margin-top: 30px;
        }
        .footer a {
            color: #4a90e2; /* Soft blue */
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>OTP Verification</h1>
        </div>
        <div class="message">
            <p>Hello,</p>
            <p>We received a request to verify your identity. Please use the OTP below to complete your action:</p>
        </div>
        <div class="otp">
            <p>${otp}</p>
        </div>
        <div class="message">
            <p>This OTP is valid for the next 60 seconds. If you didn’t request this, please ignore this message.</p>
        </div>
        <div class="footer">
            <p>If you need help, feel free to <a href="mailto:cngcareofficial@gmail.com">contact us</a>.</p>
            <p>&copy; 2024 CNG Care</p>
        </div>
    </div>
</body>
</html>

`;
};

export { getSuccessEmailTemplate, getFailureEmailTemplate, getOtpEmailtemp };
