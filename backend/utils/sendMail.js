import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a single transport instance that can be reused
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendMail = async (userEmail, emailTemplate, subject) => {
  // Validate the email address format using a regex pattern
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (emailPattern.test(userEmail)) {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: userEmail.toLowerCase(),
        subject: subject,
        html: emailTemplate,
      };

      // Send email using the existing transporter
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error occurred while sending email: " + error.message);
      // You can handle this error more gracefully here
      throw new Error(`Error sending email: ${error.message}`);
    }
  } else {
    console.log("Invalid email format: " + userEmail);
    // Handle invalid email case
    throw new Error("Invalid email format");
  }
};

export default sendMail;
