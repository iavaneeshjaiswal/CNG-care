import React, { useState, useEffect, createContext } from "react"; // React 16
import axios from "axios";

export const ProductContext = createContext(null);

export const ProductProvider = (props) => {
  const [Products, setProducts] = useState([]);

  const url = "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${url}/product/list-product`);
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  const updateUserState = async () => {
    const res = await axios.get(`${url}/product/list-product`);
    setProducts(res.data);
  };

  const remove_product = (id) => {
    axios
      .delete(`${url}/product/remove-product/${id}`)
      .then(() => updateUserState())
      .catch((err) => console.log(err));
  };

  const addProduct = async (data) => {
    try {
      const response = await axios
        .post(`${url}/product/add-product`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => updateUserState())
        .then(() => alert("Product uploaded successfully"));
    } catch (error) {
      alert("Error uploading product:", error);
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const response = await axios
        .put(`${url}/product/update-product/${id}`, data)
        .then(() => updateUserState())
        .then(() => alert("Product Updated Successfully"));
    } catch (error) {
      alert("Error updating product:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{ Products, updateProduct, remove_product, addProduct }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};
