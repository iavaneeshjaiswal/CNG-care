import Service from "../models/service.js";
import mongoose from "mongoose";
import sendMail from "../utils/sendMail.js";
import {
  serviceRequest,
  rejectservice,
  acceptService,
} from "../utils/emailTemplate.js";
import workshopModel from "../models/workshop.js";
import userModel from "../models/user.js";

const createService = async (req, res) => {
  try {
    const { workshopID, serviceType } = req.body;

    if (!workshopID || !serviceType) {
      return res.status(400).json({
        message: "All fields are required",
        status: false,
      });
    }

    const existingPendingService = await Service.findOne({
      customerID: req.user.userId,
      status: "Pending",
    });

    if (existingPendingService) {
      return res.status(403).json({
        message:
          "You already have a pending service request. Wait until it is processed before creating a new one.",
        status: false,
      });
    }

    const workshop = await workshopModel.findOne({ _id: workshopID });
    const customer = await userModel.findOne({ _id: req.user.userId });

    if (!workshop || !customer) {
      return res.status(404).json({
        message: "Workshop or Customer not found",
        status: false,
      });
    }

    const newService = new Service({
      customerID: req.user.userId,
      workshopID,
      serviceType,
    });

    await newService.save();

    sendMail(
      workshop.email,
      serviceRequest(
        workshop.workshopName,
        customer.fullName,
        customer.number,
        serviceType,
        new Date().toISOString().split("T")[0]
      ),
      "Service Request Notification"
    );

    res.status(201).json({
      newService,
      message: "Service created successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const listService = async (req, res) => {
  try {
    const services = await Service.find({
      workshopID: req.user.userId,
    })
      .populate({
        path: "customerID",
        select: "_id fullName number email",
      })
      .select("-__v -createdAt -updatedAt");
    if (services.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Service list not found",
      });
    }
    return res.status(200).json({
      services,
      status: true,
      message: "Service list fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};
const listServiceForCustomer = async (req, res) => {
  try {
    const services = await Service.find({
      customerID: req.params.id,
    })
      .populate({
        path: "customerID",
        select: "_id fullName number email",
      })
      .select("-__v -createdAt -updatedAt");
    if (services.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Service list not found",
      });
    }
    return res.status(200).json({
      services,
      status: true,
      message: "Service list fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id: serviceID } = req.params;
    if (!serviceID || !status) {
      return res.status(401).json({
        message: "All fields are required",
        status: false,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(serviceID)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const service = await Service.findById(serviceID)
      .populate("workshopID")
      .populate("customerID");
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
        status: false,
      });
    }

    if (service.status === "Rejected") {
      return res.status(401).json({
        message: "Service is already rejected by automation",
        status: false,
      });
    }

    service.status = status;
    await service.save();

    if (service.status === "Rejected") {
      sendMail(
        service.customerID.email,
        rejectservice(
          service._id,
          service.customerID.fullName,
          service.serviceType,
          new Date().toISOString().split("T")[0]
        ),
        "Service Reject Notification"
      );
    } else if (service.status === "Accepted") {
      sendMail(
        service.customerID.email,
        acceptService(
          service._id,
          service.customerID.fullName,
          service.serviceType,
          new Date().toISOString().split("T")[0]
        ),
        "Service Accept Notification"
      );
    }

    res.status(200).json({
      service,
      message: "Service updated successfully",
      status: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, status: false });
  }
};

const completeService = async (req, res) => {
  try {
    const { serviceID, amount } = req.body;

    if (!serviceID || amount === undefined) {
      return res.status(400).json({
        message: "Service ID and amount are required",
        status: false,
      });
    }

    const service = await Service.findById(serviceID);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
        status: false,
      });
    }

    if (service.status !== "Accepted") {
      return res.status(400).json({
        message: "Service must be in 'Accepted' status to mark as 'Completed'",
        status: false,
      });
    }

    service.status = "Completed";
    service.amount = amount;
    await service.save();

    return res.status(200).json({
      message: "Service marked as completed successfully",
      service,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "Unauthorized access",
        status: false,
      });
    }

    const requests = await Service.find({
      workshopID: req.user.userId,
      status: "Pending",
    }).populate("customerID");

    res.status(200).json({
      requests,
      status: true,
      message: "Pending requests fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const getAcceptedRequests = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        message: "Unauthorized access",
        status: false,
      });
    }

    const requests = await Service.find({
      workshopID: req.user.userId,
      status: "Accepted",
    }).populate("customerID");

    res.status(200).json({
      requests,
      status: true,
      message: "Accepted requests fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export default {
  createService,
  listService,
  updateServiceStatus,
  completeService,
  getPendingRequests,
  getAcceptedRequests,
  listServiceForCustomer,
};
