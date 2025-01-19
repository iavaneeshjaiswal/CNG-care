import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const WorkshopContext = createContext();

export const WorkshopProvider = ({ children }) => {
  const [workshops, setWorkshops] = useState([]);
  const [isloaded, setIsloaded] = useState(false);
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

  const addWorkshop = async (workshop) => {
    const response = await axios.post(url + "/workshop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workshop),
    });
    const data = await response.json();
    setWorkshops([...workshops, data]);
  };

  const value = {
    isloaded,
    workshops,
    addWorkshop,
  };

  return (
    <WorkshopContext.Provider value={value}>
      {children}
    </WorkshopContext.Provider>
  );
};
