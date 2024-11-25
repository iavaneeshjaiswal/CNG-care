import React, { useState, useEffect, createContext } from "react"; // React 16
import axios from "axios";

export const Admincontext = createContext(null);

export const AdminProvider = (props) => {
  const [Admins, setAdmins] = useState([]);
  const url = "http://localhost:4000";

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${url}/admin/list-admin`);
        setAdmins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAdmins();
  }, []);

  const updateadminState = async () => {
    try {
      const res = await axios.get(`${url}/admin/list-admin`);
      setAdmins(res.data);
    } catch (error) {
      console.error("Error fetching admin list:", error);
    }
  };

  const remove_Admin = (id) => {
    axios
      .delete(`${url}/admin/remove-admin/${id}`)
      .then(() => updateadminState())
      .catch((err) => console.log(err));
  };

  const addAdmin = async (data) => {
    try {
      await axios
        .post(`${url}/admin/add-admin`, data)
        .then(() => {
          updateadminState();
        })
        .then(() => {
          alert("User added successfully");
        });
    } catch (error) {
      alert("Error adding user:", error);
    }
  };

  const updateAdmin = async (id, data) => {
    try {
      await axios
        .put(`${url}/admin/update-admin/${id}`, data)
        .then(() => updateadminState())
        .then(() => alert("Admin Updated Successfully"));
    } catch (error) {
      alert("Error updating Admin:", error);
    }
  };

  const login = async (data) => {
    try {
      const response = await axios.post(`${url}/admin/login`, { data });
      console.log(response);
      if (response && response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.admin.role);
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      
    } catch (error) {
      console.error("Error deleting cookie:", error);
    }
  };
  const role = ["superAdmin", "subAdmin", "manager", "admin"];

  return (
    <Admincontext.Provider
      value={{
        Admins,
        addAdmin,
        remove_Admin,
        updateAdmin,
        setAdmins,
        login,
        url,
        role,
        logout,
      }}
    >
      {props.children}
    </Admincontext.Provider>
  );
};
