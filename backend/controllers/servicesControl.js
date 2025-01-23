import Service from "../models/service.js";

const createService = async (req, res) => {
  try {
    const { workshopID, serviceType } = req.body;

    if (!workshopID || !serviceType) {
      return res.status(401).json({
        message: "All fields are required",
        status: false,
      });
    }

    const newService = new Service({
      customerID: req.user.userId,
      workshopID,
      serviceType,
    });

    await newService.save();

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
    const services = await Service.find({}).populate("workshopID customerID");
    res.status(200).json({
      services,
      status: true,
      message: "Service list fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const updateServiceStatus = async (req, res) => {
  try {
    const { serviceID, status } = req.body;

    if (!serviceID || !status) {
      return res.status(401).json({
        message: "All fields are required",
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

    service.status = status;
    await service.save();

    res.status(200).json({
      service,
      message: "Service updated successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const updateService = async (req, res) => {
  try {
    const { serviceID, transactionID, amount, paymentStatus } = req.body;

    if (!serviceID || !transactionID || !amount || !paymentStatus) {
      return res.status(401).json({
        message: "All fields are required",
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

    service.transactionID = transactionID;
    service.amount = amount;
    service.paymentStatus = paymentStatus;
    await service.save();

    res.status(200).json({
      service,
      message: "Service updated successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
        status: false,
      });
    }

    await service.remove();
    res.status(200).json({
      message: "Service deleted successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const completeService = async (req, res) => {
  try {
    const { serviceID, amount } = req.body;

    if (!serviceID || !amount) {
      return res.status(401).json({
        message: "All fields are required",
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

    service.status = "completed";
    service.amount = amount;
    await service.save();

    res.status(200).json({
      service,
      message: "Service completed successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

export default {
  createService,
  listService,
  updateServiceStatus,
  updateService,
  deleteService,
  completeService,
};
