import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
export const Admincontext = createContext();

export const AdminProvider = (props) => {
  const notify = (msg) => toast(`${msg}`);
  const [Admins, setAdmins] = useState([]);
  const [isloaded, setIsloaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const url = import.meta.env.VITE_APP_URL;

  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [refreshtoken, setRefreshtoken] = useState(
    localStorage.getItem("refreshtoken")
  );
  const admintype = useState(localStorage.getItem("role"));

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${url}/admin/list-admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(res.data);
        setIsloaded(true);
      } catch (err) {
        console.log(err);
        if (err.response.status === 403 || err.response.status === 401) {
          localStorage.removeItem("accessToken");
          setToken(null);
        }
      }
    };
    fetchAdmins();
  }, []);

  const updateadminState = async () => {
    try {
      const res = await axios.get(`${url}/admin/list-admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(res.data);
      setIsloaded(true);
    } catch (error) {
      console.error("Error fetching admin list:", error);
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        setToken(null);
      }
    }
  };

  const remove_Admin = (id) => {
    axios
      .delete(`${url}/admin/remove-admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => updateadminState())
      .then(() => setIsloaded(true))
      .catch((err) => {
        console.log(err);
        if (err.response.status === 403 || err.response.status === 401) {
          localStorage.removeItem("accessToken");
          setToken(null);
        }
      });
  };

  const addAdmin = async (data) => {
    try {
      const res = await axios
        .post(`${url}/admin/add-admin`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
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
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        setToken(null);
      }
    }
  };

  const updateAdmin = async (id, data) => {
    try {
      await axios
        .put(`${url}/admin/update-admin/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => updateadminState())
        .then(() => setIsloaded(true))
        .then(() => alert("Admin Updated Successfully"));
    } catch (error) {
      alert("Error updating Admin:", error);
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        setToken(null);
      }
    }
  };

  const login = async (data) => {
    try {
      const response = await axios.post(`${url}/admin/login`, { data });
      console.log(response);
      if (response && response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("role", response.data.admin.role);
        window.location.href = "/";
      }
      return response;
    } catch (error) {
      console.log(error);
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        setToken(null);
      }
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${url}/admin/logout`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(response);
      if (response && response.data.status) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refressToken");
        localStorage.removeItem("role");
      }
    } catch (error) {
      console.error("Error deleting cookie:", error);
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem("accessToken");
        setToken(null);
      }
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

