import React from "react";
import Navbar from "../components/Navbar.jsx";

export default function NewProduct() {

  return (
    <div className="flex gap-3 w-full">
      <Navbar />
      <div className="flex w-full flex-col items-center p-12 gap-3 ">
        <h2>Add Product</h2>
        <form className="flex w-full h-screen flex-col justify-start gap-5 ">
          <div className="flex flex-col gap-2 ">
            <label htmlFor="title">Product Name:</label>
            <input
              type="text"
              placeholder="Enter Product Name"
              id=""
              required
              className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
            />
          </div>

          <div className="flex w-full gap-2 ">
            <div className="flex w-1/2 flex-col gap-2 ">
              <label htmlFor="Price">Price :</label>
              <input
                type="number"
                placeholder="Enter Price"
                id="Price"
                required
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
              />
            </div>
            <div className="flex w-1/2  flex-col gap-2 ">
              <label htmlFor="OfferPrice">Offer Price :</label>
              <input
                type="number"
                placeholder="Enter Offer Price"
                id="OfferPrice"
                required
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
              />
            </div>
          </div>

          <div className="flex w-full gap-2 ">
            <div className="flex w-1/2 flex-col gap-2 ">
            <label htmlFor="quantity">Quantity :</label>
              <input
                type="number"
                placeholder="Enter Quantity"
                id="quantity"
                required
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
              />
            </div>
            <div className="flex w-1/2  flex-col gap-2 ">
              <label htmlFor="category">Category :</label>
              <input
                type="text"
                placeholder="Enter Category"
                id="category" 
                required
                className="p-2 rounded focus:outline-none w-full border-2 bg-gray-200  border-gray-400  focus:border-black"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <label htmlFor="description ">Description:</label>
            <textarea
              placeholder="Enter Description"
              id="description"
              name="description"
              rows="4"
              required
              className="p-2 rounded focus:outline-none bg-gray-200 w-full border-2  border-gray-400 focus:border-black"
            ></textarea>
          </div>

          <div className="flex flex-col gap-2 ">
            <label htmlFor="upload">Product Images:</label>
            <input type="file" id="upload" multiple />
          </div>
          <input
            type="submit"
            value="Add Product"
            style={{ background: "#FC370F" }}
            className="text-white p-1 px-4 text-lg  rounded-lg cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}
