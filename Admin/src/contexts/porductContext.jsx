import React, { useState, useEffect, createContext } from "react"; // React 16
import axios from "axios";

export const ProductContext = createContext(null);

export const ProductProvider = (props) => {
  const [Products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const url = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${url}/product/list-product`, {
          headers: {
            Authorization: `Bearer ${token}`,
            id: localStorage.getItem("id"),
          },
        });
        setProducts(res.data);
        setIsLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  const updateproductState = async () => {
    const res = await axios.get(`${url}/product/list-product`, {
      headers: {
        Authorization: `Bearer ${token}`,
        id: localStorage.getItem("id"),
      },
    });
    setProducts(res.data);
    setIsLoaded(true);
  };

  const remove_product = (id) => {
    axios
      .delete(`${url}/product/remove-product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: localStorage.getItem("id"),
        },
      })
      .then(() => updateproductState())
      .then(() => setIsLoaded(true))
      .catch((err) => console.log(err));
  };

  const addProduct = async (data) => {
    try {
      await axios
        .post(`${url}/product/add-product`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            id: localStorage.getItem("id"),
          },
        })
        .then(() => updateproductState())
        .then(() => setIsLoaded(true))
        .then(() => alert("Product uploaded successfully"));
    } catch (error) {
      console.log("Error uploading product:", error);
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const response = await axios
        .put(`${url}/product/update-product/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            id: localStorage.getItem("id"),
          },
        })
        .then(() => updateproductState())
        .then(() => setIsLoaded(true))
        .then(() => alert("Product Updated Successfully"));
    } catch (error) {
      alert("Error updating product:", error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        Products,
        updateProduct,
        remove_product,
        addProduct,
        url,
        isLoaded,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};
