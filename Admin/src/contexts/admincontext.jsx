import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
export const Admincontext = createContext();

export const AdminProvider = (props) => {
  const notify = (msg) => toast(`${msg}`);
  const [Admins, setAdmins] = useState([]);
  const [isloaded, setIsloaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const url = import.meta.env.VITE_APP_URL;

  const [token] = useState(localStorage.getItem("token"));
  const admintype = useState(localStorage.getItem("role"));
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${url}/admin/list-admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            id: localStorage.getItem("id"),
          },
        });
        setAdmins(res.data);
        setIsloaded(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAdmins();
  }, []);

  const updateadminState = async () => {
    try {
      const res = await axios.get(`${url}/admin/list-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: localStorage.getItem("id"),
        },
      });
      setAdmins(res.data);
      setIsloaded(true);
    } catch (error) {
      console.error("Error fetching admin list:", error);
    }
  };

  const remove_Admin = (id) => {
    axios
      .delete(`${url}/admin/remove-admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: localStorage.getItem("id"),
        },
      })
      .then(() => updateadminState())
      .then(() => setIsloaded(true))
      .catch((err) => console.log(err));
  };

  const addAdmin = async (data) => {
    try {
      const res = await axios
        .post(`${url}/admin/add-admin`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            id: localStorage.getItem("id"),
          },
        })
        .then(() => {
          updateadminState();
          setIsloaded(true);
        })
        .then(() => {
          alert("User added successfully");
        });
      console.log(res);
    } catch (error) {
      alert("Error adding user:", error);
    }
  };

  const updateAdmin = async (id, data) => {
    try {
      await axios
        .put(`${url}/admin/update-admin/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            id: localStorage.getItem("id"),
          },
        })
        .then(() => updateadminState())
        .then(() => setIsloaded(true))
        .then(() => alert("Admin Updated Successfully"));
    } catch (error) {
      alert("Error updating Admin:", error);
    }
  };

  const login = async (data) => {
    try {
      const response = await axios.post(
        `${url}/admin/login`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response && response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.admin.role);
        localStorage.setItem("id", response.data.admin._id);
        window.location.href = "/";
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
      localStorage.removeItem("id");
    } catch (error) {
      console.error("Error deleting cookie:", error);
    }
  };
  const role = ["super admin", "sub Admin", "manager", "admin"];

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
        admintype,
        isloaded,
        isAuthenticated,
      }}
    >
      {props.children}
    </Admincontext.Provider>
  );
};
