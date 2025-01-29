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

const serviceRequest = (
  workshopName,
  customerName,
  customerNumber,
  serviceType,
  requestedDate
) => {
  return `<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 20px;
    }
    .email-body {
      padding: 20px;
    }
    .email-body p {
      margin: 0 0 15px;
      line-height: 1.6;
    }
    .email-footer {
      background-color: #f1f1f1;
      padding: 10px 20px;
      text-align: center;
      font-size: 14px;
      color: #777;
    }
    .btn {
      display: inline-block;
      margin: 10px 5px;
      padding: 12px 20px;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .btn-accept {
      background-color: #4CAF50;
    }
    .btn-reject {
      background-color: #E74C3C;
    }
    .btn:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Service Request Notification</h1>
    </div>
    <div class="email-body">
      <p>Dear <strong>${workshopName}</strong>,</p>
      <p>You have received a new service request that requires your attention. Please review the details below and take action by accepting or rejecting the request:</p>
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Contact Number:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${customerNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service Type:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${serviceType}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Requested On:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${requestedDate}</td>
        </tr>
      </table>
      <p>Do check your <strong>Workshop Pannel</strong> to <strong>accept</strong> or <strong>recject</strong> the service.</p>
      <p>If no action is taken within <strong>5 minutes</strong>, the request will be automatically rejected.</p>
      <p>Thank you,</p>
      <p><strong>Cng Care Team</strong></p>
    </div>
    <div class="email-footer">
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>`;
};
const rejectservice = (serviceID, customerName, serviceType, requestedDate) => {
  return `<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Service Request Rejected</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333333;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #d9534f;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
      }
      .content p {
        margin: 10px 0;
        font-size: 16px;
        line-height: 1.6;
      }
      .content .important {
        font-weight: bold;
        color: #d9534f;
      }
      .footer {
        background-color: #f4f4f4;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        Service Request Rejected
      </div>
      <div class="content">
        <p>Dear <span class="important">${customerName}</span>,</p>

        <p>
          We regret to inform you that your service request with the following
details has been <span class="important">rejected</span>:
        </p>

        <ul>
          <li><strong>Service ID:</strong> ${serviceID}</li>
          <li><strong>Requested Service:</strong> ${serviceType}</li>
          <li><strong>Requested Date:</strong> ${requestedDate}</li>
        </ul>

        <p>
          We apologize for any inconvenience caused.
        </p>

        <p>Thank you for understanding.</p>

        <p>Best regards,</p>
        <p><strong>CNG CARE</strong></p>
      </div>
      <div class="footer">
        &copy; 2025 CNG CARE. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
};
const acceptService = (serviceID, customerName, serviceType, requestedDate) => {
  return `<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Service Request Accepted</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        color: #333333;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #5cb85c;
        color: #ffffff;
        padding: 20px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
      }
      .content p {
        margin: 10px 0;
        font-size: 16px;
        line-height: 1.6;
      }
      .content .important {
        font-weight: bold;
        color: #5cb85c;
      }
      .footer {
        background-color: #f4f4f4;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        Service Request Accepted
      </div>
      <div class="content">
        <p>Dear <span class="important">${customerName}</span>,</p>

        <p>
          We are pleased to inform you that your service request with the following
          details has been <span class="important">accepted</span>:
        </p>

        <ul>
          <li><strong>Service ID:</strong> ${serviceID}</li>
          <li><strong>Requested Service:</strong> ${serviceType}</li>
          <li><strong>Requested Date:</strong> ${requestedDate}</li>
        </ul>

        <p>Thank you for choosing us.</p>

        <p>Best regards,</p>
        <p><strong>CNG CARE</strong></p>
      </div>
      <div class="footer">
        &copy; 2025 CNG CARE. All rights reserved.
      </div>
    </div>
  </body>
</html>
`;
};

export {
  getSuccessEmailTemplate,
  getFailureEmailTemplate,
  getOtpEmailtemp,
  serviceRequest,
  rejectservice,
  acceptService,
};
