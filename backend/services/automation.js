import mongoose from "mongoose";
import Service from "../models/service.js";
import { rejectservice } from "../utils/emailTemplate.js";
import sendMail from "../utils/sendMail.js";

const automationForService = async () => {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    // Debugging: Ensure the connection is established
    if (!mongoose.connection.readyState) {
      throw new Error("MongoDB connection not established");
    }

    console.log("Querying services older than:", fiveMinutesAgo);

    // Find all services that are pending and older than five minutes
    const pendingServices = await Service.find({
      status: "Pending",
      createdAt: { $lte: fiveMinutesAgo },
    }).populate({ path: "customerID", select: "email fullName" });

    if (pendingServices.length > 0) {
      console.log(
        `${pendingServices.length} pending requests found for rejection.`
      );

      for (const service of pendingServices) {
        try {
          const emailContent = rejectservice(
            service._id,
            service.customerID.fullName,
            service.serviceType,
            new Date().toISOString().split("T")[0]
          );

          await sendMail(
            service.customerID.email,
            emailContent,
            "Service Reject Notification"
          );

          console.log(`Rejection email sent to ${service.customerID.email}`);

          service.status = "Rejected";
          await service.save();
        } catch (error) {
          console.error(
            `Failed to process service ID ${service._id}:`,
            error.message
          );
        }
      }
    } else {
      console.log("No pending requests to reject.");
    }
  } catch (error) {
    console.error("Error in auto-rejection job:", error.message);
  }
};

export default automationForService;
