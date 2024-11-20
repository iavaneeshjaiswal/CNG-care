import React, { useEffect, useState, useContext } from "react";
import { ProductContext } from "../contexts/porductContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const { Products, remove_product, updateProduct } =
    useContext(ProductContext);

  const [products, setProducts] = useState(Products);

  const navigate = useNavigate();
  useEffect(() => {
    setProducts(Products);
  }, [Products]);

  return (
    <div className="p-2 box-border bg-white mt-5 rounded-sm w-full h-screen">
      <div className="max-h-[90vh] overflow-auto px-4 text-center ">
        <table className="w-full mx-auto ">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200 ">
              <th className="p-2 text-start">IMAGES</th>
              <th className="p-2 text-start">TITLE</th>
              <th className="p-2 text-start">PRICE</th>
              <th className="p-2 text-start">OFFER PRICE</th>
              <th className="p-2 text-start">CATEGORY</th>
              <th className="p-2 text-center">UPDATE</th>
              <th className="p-2 text-center">REMOVE</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-2 text-start">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </td>
                  <td className="p-2 text-start">{product.title}</td>
                  <td className="p-2 text-start">{product.price}</td>
                  <td className="p-2 text-start">{product.offerPrice}</td>
                  <td className="p-2 text-start">{product.category}</td>
                  <td className="p-2 text-CENTER">
                    <button
                      className=" text-black text-xl p-2 rounded"
                      onClick={() => {
                        navigate(`/updateproduct/${product._id}`);
                      }}
                    >
                      {<i class="ri-edit-2-fill"></i>}
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
                      {<i class="ri-delete-bin-6-line"></i>}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
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
