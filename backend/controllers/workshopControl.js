import workshopModel from "../models/workshop.js";

const createWorkshop = async (req, res) => {
  try {
    const { workshopName, ownerName, numbers, address } = req.body;

    if (!workshopName || !ownerName || !numbers || !address) {
      return res.status(401).json({
        message: "All fields are required",
        status: false,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(401).json({
        message: "Please upload at least one image.",
        status: false,
      });
    }
    const imageUrls = req.files.map((file) => `uploads/${file.filename}`);

    const existingWorkshop = await workshopModel.findOne({ email });
    if (existingWorkshop) {
      return res.status(401).json({
        message: "Workshop already exists",
        status: false,
      });
    }

    const newWorkshop = new workshopModel({
      workshopName,
      ownerName,
      numbers: numbers.split(","),
      address: {
        text: address.text,
        coordinates: {
          longitude: address.coordinates.longitude,
          latitude: address.coordinates.latitude,
        },
      },
      images: imageUrls,
    });

    await newWorkshop.save();

    res.status(201).json({
      savedWorkshop,
      message: "Workshop created successfully",
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

const listWorkshop = async (req, res) => {
  try {
    const workshops = await workshopModel.find(
      {},
      "_id workshopName workshopOwnerName number address email wallet workshopImage services"
    );
    if (workshops.length === 0) {
      return res
        .status(404)
        .json({ message: "No workshops found", status: false });
    }
    return res.status(200).json({ workshops, status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export default { createWorkshop, listWorkshop };