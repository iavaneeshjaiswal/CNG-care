import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../contexts/porductContext.jsx";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UpdateProduct({ id }) {
  const { updateProduct, url } = useContext(ProductContext);
  const [imgURl, setImgURl] = React.useState("");
  const [isWait, setWait] = useState(false);

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
      const product = await axios.get(`${url}/product/get-product/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          id: localStorage.getItem("id"),
        },
      });
      setWait(!isWait);
      setValue("title", product.data.title);
      setValue("price", product.data.price);
      setValue("quantity", product.data.quantity);
      setValue("category", product.data.category);
      setValue("description", product.data.description);
      setValue("brand", product.data.brand);
      setImgURl(product.data.images[0]);
    })();
  }, [id]);

  const onSubmit = async (data) => {
    await updateProduct(id, data);
    navigate("/products");
  };

  return (
    <div className="flex w-3/6 flex-col items-center p-12 gap-3 ">
      <h2 className="text-base">Update Product</h2>
      <img src={imgURl} className="h-24" />
      {isWait ? (
        <form
          className="flex w-full flex-col justify-start gap-5 "
          onSubmit={handleSubmit(onSubmit)}
        >
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
              <label htmlFor="price">Price :</label>
              <input
                type="number"
                placeholder="Enter Price"
                id="price"
                {...register("price", { required: "Price is required" })}
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
              />
              {errors.price && (
                <p className="text-red-400 text-sm">{errors.price?.message}</p>
              )}
            </div>
          </div>

          <div className="flex w-full gap-2 ltems-center">
            <div className="flex w-full flex-col gap-2 ">
              <label htmlFor="quantity">Quantity :</label>
              <input
                type="number"
                placeholder="Enter Quantity"
                id="quantity"
                {...register("quantity", { required: "Quantity is required" })}
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
              />
              {errors.quantity && (
                <p className="text-red-400 text-sm">
                  {errors.quantity?.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-1/2 ">
              <label htmlFor="category">Category :</label>
              <select
                name="category"
                id="category"
                {...register("category", {
                  required: "category is required",
                })}
                className="text-black border p-2 rounded-lg w-full bg-gray-200  border-gray-400  focus:border-black"
              >
                {categoryOptions.map((item) => {
                  return <option value={item}>{item}</option>;
                })}
              </select>
              {/* Error message */}
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <label htmlFor="description">Description:</label>
            <textarea
              placeholder="Enter Description"
              id="description"
              name="description"
              rows="4"
              {...register("description", {
                required: "Description is required",
              })}
              className="p-2 rounded focus:outline-none bg-gray-200 w-full border-2  border-gray-400 focus:border-black"
              onChange={(e) => {
                const textArea = e.target;
                const characterCount = textArea.value.length;
                textArea.setCustomValidity(
                  characterCount > 500
                    ? "Description should not exceed 250 characters"
                    : ""
                );
                textArea.setCustomValidity("");
                textArea.nextSibling.innerText = `Characters: ${characterCount}`;
              }}
            ></textarea>
            <p className="text-sm text-gray-500">Characters: 0</p>
            {errors.description && (
              <p className="text-red-400 text-sm">
                {errors.description.message}
              </p>
            )}{" "}
            {/* Error message */}
          </div>
          <input
            type="submit"
            value="Update Product"
            style={{ background: "#FC370F" }}
            className="text-white p-1 px-4 text-lg  rounded-lg cursor-pointer"
          />
        </form>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}
