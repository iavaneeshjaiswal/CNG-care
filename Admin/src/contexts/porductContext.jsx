import React, { useState, useEffect, createContext } from "react"; // React 16
import axios from "axios";

export const ProductContext = createContext(null);

export const ProductProvider = (props) => {
  const [Products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [token] = useState(localStorage.getItem("accessToken"));
  const url = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${url}/product/list-products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data.products);
        setIsLoaded(true);
      } catch (error) {
        console.log(error);
        if (error.response.status === 403 || error.response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
        }
      }
    };
    fetchProducts();
  }, []);

  const updateproductState = async () => {
    try {
      const res = await axios.get(`${url}/product/list-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data.products);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        setToken(null);
      }
    }
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
      .catch((error) => {
        console.log(error);
        if (error.response.status === 403 || error.response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("role");
          setToken(null);
        }
      });
  };

  const addProduct = async (data) => {
    try {
      const res = await axios
        .post(`${url}/product/add-product`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => updateproductState())
        .then(() => setIsLoaded(true))
        .then(() => alert("Product uploaded successfully"));
    } catch (error) {
      alert("Error uploading product:", error);
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        setToken(null);
      }
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
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        setToken(null);
      }
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
