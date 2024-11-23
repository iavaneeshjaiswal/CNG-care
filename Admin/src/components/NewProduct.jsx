import React, { useContext } from "react";
import { ProductContext } from "../contexts/porductContext.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function NewProduct() {
  const { addProduct } = useContext(ProductContext);
  const url = "http://localhost:6000";
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.images && data.images.length > 0) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price);
      formData.append("offerPrice", data.offerPrice);
      formData.append("quantity", data.quantity);
      formData.append("category", data.category);
      formData.append("brand", data.brand);
      formData.append("description", data.description);

      Array.from(data.images).forEach((image) => {
        formData.append("images", image);
      });

      await addProduct(formData);
      navigate("/products");
    } else {
      console.error("No images uploaded");
    }
  };
  return (
    <div className="flex w-full flex-col items-center p-12 gap-3 ">
      <h2 className="text-2xl font-bold">Add Product</h2>
      <form className="flex w-full h-screen flex-col justify-start gap-5 " onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 ">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="title">Product Name:</label>
            <input
              type="text"
              placeholder="Enter Product Name"
              id=""
              {...register("title", { required: "Product name is required" })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.title && (
              <p className="text-red-400 text-sm">{errors.title.message}</p>
            )}{" "}
            {/* Error message */}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="brand">Brand Name:</label>
            <input
              type="brand"
              placeholder="Enter Product Name"
              id="brand"
              {...register("brand", { required: "Brand name is required" })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.Brand && (
              <p className="text-red-400 text-sm">{errors.Brand.message}</p>
            )}{" "}
            {/* Error message */}
          </div>
        </div>

        <div className="flex w-full gap-2 ">
          <div className="flex w-1/2 flex-col gap-2 ">
            <label htmlFor="Price">Price :</label>
            <input
              type="number"
              placeholder="Enter Price"
              id="Price"
              {...register("price", { required: "Price is required" })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.price && (
              <p className="text-red-400 text-sm">{errors.price.message}</p>
            )}{" "}
            {/* Error message */}
          </div>
          <div className="flex w-1/2  flex-col gap-2 ">
            <label htmlFor="OfferPrice">Offer Price :</label>
            <input
              type="number"
              placeholder="Enter Offer Price"
              id="OfferPrice"
              {...register("offerPrice", {
                required: "Offer Price is required",
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.offerPrice && (
              <p className="text-red-400 text-sm">
                {errors.offerPrice.message}
              </p>
            )}{" "}
            {/* Error message */}
          </div>
        </div>

        <div className="flex w-full gap-2 ">
          <div className="flex w-1/2 flex-col gap-2 ">
            <label htmlFor="quantity">Quantity :</label>
            <input
              type="number"
              placeholder="Enter Quantity"
              id="quantity"
              {...register("quantity", { required: "Quantity is required" })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.quantity && (
              <p className="text-red-400 text-sm">{errors.quantity.message}</p>
            )}{" "}
            {/* Error message */}
          </div>
          <div className="flex w-1/2  flex-col gap-2 ">
            <label htmlFor="category">Category :</label>
            <input
              type="text"
              placeholder="Enter Category"
              id="category"
              {...register("category", {
                required: "Product Category is required",
              })}
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
            {errors.category && (
              <p className="text-red-400 text-sm">{errors.category.message}</p>
            )}{" "}
            {/* Error message */}
          </div>
        </div>

        <div className="flex flex-col gap-2 ">
          <label htmlFor="description ">Description:</label>
          <textarea
            placeholder="Enter Description"
            id="description"
            name="description"
            rows="4"
            {...register("description", {
              required: "Description is required",
            })}
            className="p-2 rounded focus:outline-none bg-gray-200 w-full border-2  border-gray-400 focus:border-black"
          ></textarea>
          {errors.description && (
            <p className="text-red-400 text-sm">{errors.description.message}</p>
          )}{" "}
          {/* Error message */}
        </div>

        <div className="flex flex-col gap-2 ">
          <label htmlFor="images">Product Images:</label>
          <input
            type="file"
            id="images"
            multiple
            {...register("images", { required: "Please select images" })}
          />
          {errors.images && (
            <p className="text-red-400 text-sm">{errors.images.message}</p>
          )}{" "}
          {/* Error message */}
        </div>
        <input
          type="submit"
          value="Add Product"
          style={{ background: "#FC370F" }}
          className="text-white p-1 px-4 text-lg  rounded-lg cursor-pointer"
        />
      </form>
    </div>
  );
}
