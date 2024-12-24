import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../contexts/porductContext.jsx";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UpdateProduct({ id }) {
  const { updateProduct, url } = useContext(ProductContext);
  const [imgURl, setImgURl] = useState("");
  const [isWait, setWait] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let urlImage = import.meta.env.VITE_APP_URL_IMAGE;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const categoryOptions = ["CNG", "LPG"];

  useEffect(() => {
    (async function () {
      try {
        const product = await axios.get(`${url}/product/get-product/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            id: localStorage.getItem("id"),
          },
        });
        setWait(true);
        setValue("title", product.data.title);
        setValue("price", product.data.price);
        setValue("quantity", product.data.quantity);
        setValue("category", product.data.category);
        setValue("description", product.data.description);
        setValue("brand", product.data.brand);
        setImgURl(product.data.images[0]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    })();
  }, [id]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateProduct(id, data);
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-3/6 flex-col items-center p-12 gap-3 ">
      <h2 className="text-base">Update Product</h2>
      <img src={`${urlImage}${imgURl}`} className="h-24" alt="Product" />
      {isWait ? (
        <form
          className="flex w-full flex-col justify-start gap-5 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="title">Product Name:</label>
              <input
                type="text"
                placeholder="Enter Product Name"
                {...register("title", { required: "Product name is required" })}
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200 border-gray-400 focus:border-black"
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="brand">Brand Name:</label>
              <input
                type="text"
                placeholder="Enter Brand Name"
                {...register("brand", { required: "Brand name is required" })}
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200 border-gray-400 focus:border-black"
              />
              {errors.brand && (
                <p className="text-red-400 text-sm">{errors.brand.message}</p>
              )}
            </div>
          </div>
          <div className="flex w-full gap-2">
            <div className="flex w-1/2 flex-col gap-2">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                placeholder="Enter Price"
                {...register("price", { required: "Price is required" })}
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200 border-gray-400 focus:border-black"
              />
              {errors.price && (
                <p className="text-red-400 text-sm">{errors.price.message}</p>
              )}
            </div>
          </div>
          <div className="flex w-full gap-2 items-center">
            <div className="flex w-full flex-col gap-2">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                placeholder="Enter Quantity"
                {...register("quantity", { required: "Quantity is required" })}
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200 border-gray-400 focus:border-black"
              />
              {errors.quantity && (
                <p className="text-red-400 text-sm">{errors.quantity.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="category">Category:</label>
              <select
                {...register("category", { required: "Category is required" })}
                className="p-2 rounded bg-gray-200 border-2 border-gray-400 focus:border-black w-full"
              >
                {categoryOptions.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm">{errors.category.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description:</label>
            <textarea
              placeholder="Enter Description"
              rows="4"
              {...register("description", { required: "Description is required" })}
              className="p-2 rounded focus:outline-none bg-gray-200 border-2 border-gray-400 focus:border-black w-full"
            ></textarea>
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="text-white p-2 bg-red-500 rounded-lg w-full hover:bg-red-600"
          >
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </form>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
