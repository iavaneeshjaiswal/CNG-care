import workshopModel from "../models/workshop.js";

const createWorkshop = async (req, res) => {
  try {
    const { workshopName, ownerName, numbers, text, longitude, latitude } =
      req.body;
    if (
      !workshopName ||
      !ownerName ||
      !numbers ||
      !text ||
      !longitude ||
      !latitude
    ) {
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
    if (imageUrls.length < 1) {
      return res.status(402).json({
        message: "Please upload at least one image.",
        status: false,
      });
    }
    const numberArray = numbers.split(",");
    if (numberArray.length < 1) {
      return res
        .status(401)
        .json({ status: false, message: "Please provide at least one number" });
    }
    const existingWorkshop = await workshopModel.findOne({
      numbers: numberArray[0],
    });
    if (existingWorkshop) {
      return res.status(403).json({
        message: "Workshop already exists",
        status: false,
      });
    }
    const newWorkshop = new workshopModel({
      workshopName,
      ownerName,
      numbers: numberArray,
      address: {
        text,
        coordinates: [
          parseFloat(req.body.latitude),
          parseFloat(req.body.longitude),
        ],
      },
      workshopImage: imageUrls,
    });

    await newWorkshop.save();

    res.status(201).json({
      newWorkshop,
      message: "Workshop created successfully",
      status: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, status: false });
  }
};

const listWorkshop = async (req, res) => {
  try {
    const workshops = await workshopModel.find({});
    if (workshops.length === 0) {
      return res
        .status(404)
        .json({ message: "No workshops found", status: false });
    }
    return res
      .status(200)
      .json({ workshops, status: true, message: "Workshops found" });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};
const findNearbyWorkshops = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
        status: false,
      });
    }

    const { page = 1, limit = 10 } = req.query;

    // Ensure that the longitude and latitude are numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        message: "Invalid latitude or longitude",
        status: false,
      });
    }

    const workshops = await workshopModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat], // [longitude, latitude]
          },
          distanceField: "distance",
          maxDistance: 15000, // 15 km in meters
          spherical: true,
        },
      },
      {
        $skip: (page - 1) * parseInt(limit),
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    if (workshops.length === 0) {
      return res.status(404).json({
        message: "No workshops found within 15 km",
        status: false,
      });
    }

    return res.status(200).json({
      workshops: workshops.map((workshop) => ({
        ...workshop,
        distance: workshop.distance.toFixed(2),
        googleMapLink: `https://www.google.com/maps/search/?api=1&query=${workshop.address.coordinates[1]},${workshop.address.coordinates[0]}`,
      })),
      status: true,
      message: "Workshops found within 15 km",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: false });
  }
};

export default { createWorkshop, listWorkshop, findNearbyWorkshops };
