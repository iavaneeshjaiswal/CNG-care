import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const WorkshopContext = createContext();

export const WorkshopProvider = ({ children }) => {
  const [workshops, setWorkshops] = useState([]);
  const url = import.meta.env.VITE_APP_URL;

  // useEffect(() => {
  //   const getWorkshops = async () => {
  //     const response = await axios.get(url + "/workshop", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });
  //     console.log(response);
  //     setIsloaded(true);
  //   };
  //   getWorkshops();
  // }, []);

  // useEffect(() => {
  //   const getWorkshopsForapproval = async () => {
  //     const response = await axios.get(url + "/approval", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });
  //     console.log(response);
  //     setIsloaded(true);
  //   };
  //   getWorkshopsForapproval();
  // }, []);

  const addWorkshop = async (data) => {
    try {
      const res = await axios
        .post(`${url}/workshop`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then(() => updateproductState())
        .then(() => alert("Workshop Added successfully"));
    } catch (error) {
      alert("Error Adding Workshop:", error);
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        setToken(null);
      }
    }
  };

  return (
    <WorkshopContext.Provider value={addWorkshop}>
      {children}
    </WorkshopContext.Provider>
  );
};
