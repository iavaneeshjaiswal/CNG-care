import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewWorkshop() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const url = import.meta.env.VITE_APP_URL;
  const addWorkshop = async (data) => {
    try {
      await axios
        .post(`http://localhost:3000/api/workshop`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then(() => alert("Workshop Added successfully"));
    } catch (error) {
      alert("Error Adding Workshop:", error);
    }
  };

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    if (data.images && data.images.length > 0) {
      const formData = new FormData();
      formData.append("workshopName", data.workshopName);
      formData.append("ownerName", data.ownerName);
      formData.append("numbers", data.numbers);
      formData.append("text", data.addressText);
      formData.append("longitude", data.longitude);
      formData.append("latitude", data.latitude);

      Array.from(data.images).forEach((image) => {
        formData.append("images", image);
      });

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      try {
        setIsLoading(true);
        await addWorkshop(formData);
        setIsLoading(false);
        navigate("/addworkshop");
      } catch (error) {
        console.error("Error adding Workshop:", error);
      }
    } else {
      console.error("No images uploaded");
    }
  };
  return (
    <div className="flex w-3/6 flex-col items-center p-12 gap-3 ">
      <h2 className="text-2xl font-bold">Add Workshop</h2>
      <form
        className="flex w-full h-screen flex-col justify-start gap-5 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-2 ">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="workshopName">Workshop Name:</label>
            <input
              type="text"
              placeholder="Enter workshop Name"
              id="workshopName"
              {...register("workshopName", {
                required: "Workshop name is required",
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.workshopName && (
              <p className="text-red-400 text-sm">
                {errors.workshopName.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="ownerName">Owner Name:</label>
            <input
              type="text"
              placeholder="Enter owner Name"
              id="ownerName"
              {...register("ownerName", { required: "Owner name is required" })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.ownerName && (
              <p className="text-red-400 text-sm">{errors.ownerName.message}</p>
            )}
          </div>
        </div>

        <div className="flex w-full gap-2 ">
          <div className="flex flex-col w-full gap-2 ">
            <label htmlFor="numbers">Phone Numbers :</label>
            <input
              type="text"
              placeholder="Enter Phone Numbers separated by commas"
              id="numbers"
              {...register("numbers", {
                required: "Phone Numbers are required",
                validate: (value) => {
                  const phoneNumbers = value
                    .split(",")
                    .map((num) => num.trim());
                  const isValid = phoneNumbers.every((num) =>
                    /^[6-9]\d{9}$/.test(num)
                  );
                  return isValid || "Please enter valid Indian phone numbers";
                },
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.numbers && (
              <p className="text-red-400 text-sm">{errors.numbers.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full ">
          <label htmlFor="addressText">Address in text :</label>
          <input
            type="text"
            placeholder="Enter Address in text."
            id="addressText"
            {...register("addressText", { required: "Address is required" })}
            className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
          />
          {errors.addressText && (
            <p className="text-red-400 text-sm">{errors.addressText.message}</p>
          )}
        </div>

        <div className="flex w-full gap-2 ">
          <div className="flex w-full flex-col gap-2 ">
            <label htmlFor="longitude">Longitude :</label>
            <input
              type="text"
              placeholder="Enter longitude"
              id="longitude"
              {...register("longitude", {
                required: "Longitude is required",
                pattern: {
                  value: /^-?\d+(\.\d+)?$/,
                  message: "Please enter a valid longitude",
                },
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.longitude && (
              <p className="text-red-400 text-sm">{errors.longitude.message}</p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 ">
            <label htmlFor="latitude">Latitude :</label>
            <input
              type="text"
              placeholder="Enter latitude"
              id="latitude"
              {...register("latitude", {
                required: "Latitude is required",
                pattern: {
                  value: /^-?\d+(\.\d+)?$/,
                  message: "Please enter a valid latitude",
                },
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.latitude && (
              <p className="text-red-400 text-sm">{errors.latitude.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ">
          <label htmlFor="images">Workshop Images:</label>
          <input
            type="file"
            id="images"
            multiple
            {...register("images", { required: "Please select images" })}
          />
          {errors.images && (
            <p className="text-red-400 text-sm">{errors.images.message}</p>
          )}
        </div>
        <input
          type="submit"
          value="Add Workshop"
          onClick={(e) => {
            e.target.disable = true;
          }}
          style={{ background: "#FC370F" }}
          className="text-white p-1 px-4 text-lg  rounded-lg cursor-pointer"
        />
      </form>
      {isLoading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}
