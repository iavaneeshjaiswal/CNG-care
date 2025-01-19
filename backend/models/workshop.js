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
        longitude: {
          type: Number,
          required: [true, "Longitude is required"],
        },
        latitude: {
          type: Number,
          required: [true, "Latitude is required"],
        },
      },
    },
    workshopImage: [
      {
        type: String,
        require: [true, "Image is required"],
        default: "",
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

const workshopModel = mongoose.model("Workshop", workshopSchema);
export default workshopModel;
