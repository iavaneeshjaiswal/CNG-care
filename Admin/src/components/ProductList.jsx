import React, { useEffect, useState, useContext } from "react";
import { ProductContext } from "../contexts/porductContext";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const { Products, remove_product, isLoaded } = useContext(ProductContext);
  const [products, setProducts] = useState(Products);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    filterProducts();
  }, [Products, category, searchTerm]);

  let urlImage = import.meta.env.VITE_APP_URL_IMAGE;

  const filterProducts = () => {
    let filtered = Products;
    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setProducts(filtered);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-2 box-border bg-white mt-5 rounded-sm w-full h-screen">
      <div className="max-h-[90vh] overflow-auto px-4 text-center ">
        <div className="flex gap-2 mb-4 w-3/6">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border-2 rounded focus:outline-none w-full"
          />
          <select
            className="bg-gray-200 p-2 rounded outline-none px-3 w-2/6"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="all">ALL</option>
            <option value="LPG">LPG</option>
            <option value="CNG">CNG</option>
            <option value="SPARE">SPARE</option>
          </select>
        </div>
        <table className="w-full mx-auto ">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200 ">
              <th className="p-2 text-start">IMAGES</th>
              <th className="p-2 text-start">NAME</th>
              <th className="p-2 text-start">BRAND</th>
              <th className="p-2 text-start">PRICE</th>
              <th className="p-2 text-center">CATEGORY</th>
              <th className="p-2 text-center">QUANTITY</th>
              <th className="p-2 text-center">STOCKS</th>
              <th className="p-2 text-center">UPDATE</th>
              <th className="p-2 text-center">REMOVE</th>
            </tr>
          </thead>
          <tbody>
            {!isLoaded ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-2 text-center text-gray-400 text-lg"
                >
                  LOADING...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-2 text-start">
                    <img
                      src={`${urlImage}${product.images[0]}`}
                      alt={product.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </td>
                  <td className="p-2 text-start">{product.title}</td>
                  <td className="p-2 text-start">{product.brand}</td>
                  <td className="p-2 text-start">
                    {product.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </td>
                  <td className="p-2 text-center">{product.category}</td>
                  <td className="p-2 text-center">{product.quantity}</td>
                  <td className="p-2 text-center">
                    {product.quantity != 0 ? (
                      <span className="text-green-600">Available</span>
                    ) : (
                      <span className="text-red-400">Out of Stock</span>
                    )}
                  </td>
                  <td className="p-2 text-CENTER">
                    <button
                      className=" text-black text-xl p-2 rounded"
                      onClick={() => {
                        navigate(`/updateproduct/${product._id}`);
                      }}
                    >
                      {<i className="ri-edit-2-fill"></i>}
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className=" text-red-600 p-2 text-black text-xl rounded"
                      onClick={() => {
                        remove_product(product._id);
                        setProducts(
                          products.filter((p) => p._id !== product._id)
                        );
                      }}
                    >
                      {<i className="ri-delete-bin-6-line"></i>}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="p-2 text-center text-gray-400 text-lg "
                >
                  No Products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
