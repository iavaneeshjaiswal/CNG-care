import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const initialState = {
  username: "",
  workshopName: "",
  accessToken: "",
  isAuthenticated: false,
  error: null,
  isAvailable: null,
};
export const WorkshopContext = createContext(initialState);

const apiUrl = "http://localhost:3000";

const WorkshopProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const storedState = JSON.parse(localStorage.getItem("workshopAuth"));
    return storedState || initialState;
  });

  useEffect(() => {
    const storedState = JSON.parse(localStorage.getItem("workshopAuth"));
    if (storedState) {
      setState(storedState);
    }
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/service`, {
        headers: {
          Authorization: `Bearer ${state.accessToken}`,
        },
      });
      return response.data.services || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchPendingServices = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/service/getpendingrequests`,
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );
      return response.data.requests || [];
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
      return [];
    }
  };

  const updateservicestatus = async (id, status) => {
    try {
      await axios.patch(
        `${apiUrl}/api/service/updateservicestatus/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );
      alert("Service is " + status);
    } catch (error) {
      console.error(error);
      alert("Failed to Update: " + error.response.data.message);
    }
  };

  const workshopLogin = async (data) => {
    try {
      const { password } = data;

      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

      if (!passwordRegex.test(password)) {
        throw new Error(
          "Password must be at least 8 characters long, contain at least one letter, one number, and one special character."
        );
      }

      const response = await axios.post(`${apiUrl}/api/workshop/login`, data);
      if (response.status === 200) {
        const userData = {
          username: response.data.workshop.username,
          workshopName: response.data.workshop.workshopName,
          accessToken: response.data.accessToken,
          isAuthenticated: true,
          isAvailable: response.data.workshop.available,
        };

        localStorage.setItem("workshopAuth", JSON.stringify(userData));

        setState(userData);
        alert("Login successful!");
      }
    } catch (error) {
      console.error(error);
      setState({
        ...state,
        error: error.response ? error.response.data.message : error.message,
        isAuthenticated: false,
      });
      alert(error.response ? error.response.data.message : error.message);
      throw new Error(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${apiUrl}/api/workshop/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );
      localStorage.removeItem("workshopAuth");
      setState(initialState);
      alert("Logout successful!");
    } catch (error) {
      console.error(error);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  const changeAvailability = async () => {
    console.log("Changing availability");
    try {
      const response = await axios.patch(
        `${apiUrl}/api/workshop/availability`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        setState((prevState) => ({
          ...prevState,
          isAvailable: response.data.isAvailable,
        }));
        const updatedState = {
          ...state,
          isAvailable: response.data.isAvailable,
        };
        localStorage.setItem("workshopAuth", JSON.stringify(updatedState));
        setState(updatedState);
        return response.data.isAvailable;
      }
    } catch (error) {
      console.error(error);
      alert(error.response ? error.response.data.message : error.message);
      return false;
    }
  };

  const fetchAcceptedServices = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/service/getacceptedrequests`,
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );
      console.log(response.data);
      return response.data.requests || [];
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
      return [];
    }
  };

  const completeService = async (serviceID, amount) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/api/service/complete`,
        { serviceID, amount },
        {
          headers: {
            Authorization: `Bearer ${state.accessToken}`,
          },
        }
      );

      if (response.data.status) {
        alert("Service is completed successfully!");
      } else {
        alert("Error: " + response.data.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error completing service:", error);
      alert("An error occurred while completing the service.");
      return { status: false, message: "Error completing service" };
    }
  };

  return (
    <WorkshopContext.Provider
      value={{
        state,
        workshopLogin,
        handleLogout,
        changeAvailability,
        fetchServices,
        fetchPendingServices,
        updateservicestatus,
        fetchAcceptedServices,
        completeService,
      }}
    >
      {children}
    </WorkshopContext.Provider>
  );
};

export default WorkshopProvider;
