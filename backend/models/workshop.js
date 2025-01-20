import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    workshopName: {
      type: String,
      required: [true, "Workshop name is required"],
      minlength: [3, "Workshop name must be at least 3 characters long"],
      maxlength: [50, "Workshop name can't exceed 50 characters"],
    },
    ownerName: {
      type: String,
      required: [true, "Workshop owner name is required"],
      minlength: [3, "Workshop owner name must be at least 3 characters long"],
      maxlength: [50, "Workshop owner name can't exceed 50 characters"],
    },
    numbers: [
      {
        type: String,
        required: [true, "Phone number is required"],
        sparse: true,
        unique: true,
        validate: {
          validator: function (v) {
            const re = /^[6-9]\d{9}$/;
            return re.test(v);
          },
          message: "Phone number must be a valid 10 digit Indian phone number",
        },
      },
    ],
    address: {
      text: {
        type: String,
        required: [true, "Address is required"],
        default: "",
      },
      coordinates: {
        type: [Number], // Array of numbers [longitude, latitude]
        required: [true, "Coordinates are required"],
      },
    },
    workshopImage: [
      {
        type: String,
        required: [true, "Image is required"],
      },
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },
  { timestamps: true }
);

workshopSchema.index({ "address.coordinates": "2dsphere" });

const workshopModel = mongoose.model("Workshop", workshopSchema);
export default workshopModel;
