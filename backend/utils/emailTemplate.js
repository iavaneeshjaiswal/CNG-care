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
                <p>Thank you for your purchase!</p>
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
                <p>We're sorry, but your order could not be processed.</p>
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

export { getSuccessEmailTemplate, getFailureEmailTemplate };
