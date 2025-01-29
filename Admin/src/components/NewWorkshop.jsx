import React, { useState } from "react";
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
  const navigate = useNavigate();
  const url = import.meta.env.VITE_APP_URL;
  const addWorkshop = async (data) => {
    try {
      await axios
        .post(`${url}/workshop`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then(() => alert("Workshop Added successfully"));
    } catch (error) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  const onSubmit = async (data) => {
    if (data.images && data.images.length > 0) {
      const formData = new FormData();
      formData.append("workshopName", data.workshopName);
      formData.append("ownerName", data.ownerName);
      formData.append("numbers", data.numbers);
      formData.append("email", data.email);
      formData.append("text", data.addressText);
      formData.append("username", data.username);
      formData.append("password", data.password);
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
        // navigate("/workshops");
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
            <label className=" font-semibold" htmlFor="workshopName">
              Workshop Name:
            </label>
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
              <p className="text-red-400 text-sm font-semibold">
                {errors.workshopName.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className=" font-semibold" htmlFor="ownerName">
              Owner Name:
            </label>
            <input
              type="text"
              placeholder="Enter owner Name"
              id="ownerName"
              {...register("ownerName", { required: "Owner name is required" })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.ownerName && (
              <p className="text-red-400 text-sm font-semibold">
                {errors.ownerName.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 ">
          <div className="flex flex-col gap-2 w-full">
            <label className=" font-semibold" htmlFor="username">
              Workshop Username:
            </label>
            <input
              type="text"
              placeholder="Enter workshop Username"
              id="username"
              {...register("username", {
                required: "Workshop username is required",
                minLength: {
                  value: 9,
                  message: "Username must be at least 9 characters long",
                },
                pattern: {
                  value: /[a-zA-Z]/,
                  message: "Username must contain at least one letter",
                },
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.username && (
              <p className="text-red-400 text-sm font-semibold">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className=" font-semibold" htmlFor="password">
              Workshop Password:
            </label>
            <input
              type="text"
              placeholder="Enter Password"
              id="password"
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                  message:
                    "Password must be between 8 and 16 characters long, contain at least one uppercase letter, one number, and one special character",
                },
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.password && (
              <p className="text-red-400 text-sm font-semibold">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full gap-2 ">
          <div className="flex flex-col w-full gap-2 ">
            <label className=" font-semibold" htmlFor="numbers">
              Phone Numbers :
            </label>
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
              <p className="text-red-400 text-sm font-semibold">
                {errors.numbers.message}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full gap-2 ">
            <label className=" font-semibold" htmlFor="email">
              Email ID :
            </label>
            <input
              type="email"
              placeholder="Enter Email ID"
              id="email"
              {...register("email", {
                required: "email are required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Please enter a valid email",
                },
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.email && (
              <p className="text-red-400 text-sm font-semibold">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full ">
          <label className=" font-semibold" htmlFor="addressText">
            Address in text :
          </label>
          <input
            type="text"
            placeholder="Enter Address in text."
            id="addressText"
            {...register("addressText", { required: "Address is required" })}
            className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
          />
          {errors.addressText && (
            <p className="text-red-400 text-sm font-semibold">
              {errors.addressText.message}
            </p>
          )}
        </div>

        <div className="flex w-full gap-2 ">
          <div className="flex w-full flex-col gap-2 ">
            <label className=" font-semibold" htmlFor="longitude">
              Longitude :
            </label>
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
              <p className="text-red-400 text-sm font-semibold">
                {errors.longitude.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 ">
            <label className=" font-semibold" htmlFor="latitude">
              Latitude :
            </label>
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
              <p className="text-red-400 text-sm font-semibold">
                {errors.latitude.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ">
          <label className="font-semibold" htmlFor="images">
            Workshop Images:
          </label>
          <input
            type="file"
            id="images"
            multiple
            {...register("images", { required: "Please select images" })}
          />
          {errors.images && (
            <p className="text-red-400 text-sm font-semibold">
              {errors.images.message}
            </p>
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
