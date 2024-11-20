import React, { useState, useEffect, createContext } from "react"; // React 16
import axios from "axios";

export const Admincontext = createContext(null);

export const AdminProvider = (props) => {
  const [Admins, setAdmins] = useState([]);
  console.log(Admins);
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
    const res = await axios.get(`${url}/admin/list-admin`).then(() => {
      setProducts(res.data);
    });
  };

  const remove_Admin = (id) => {
    axios
      .delete(`${url}/admin/remove-admin/${id}`)
      .then(() => updateadminState())
      .catch((err) => console.log(err));
  };

  const addAdmin = async (data) => {
    try {
      console.log(data)
      await axios
        .post(`${url}/admin/add-admin`, data)
        .then(() => updateadminState())
        .then(() => alert("User added successfully"));
    } catch (error) {
      alert("Error adding user:", error);
    }
  };

  const updateAdmin = async (id, data) => {
    try {
      const response = await axios
        .put(`${url}/admin/update-admin/${id}`, data)
        .then(() => updateadminState())
        .then(() => alert("Admin Updated Successfully"));
    } catch (error) {
      alert("Error updating Admin:", error);
    }
  };

  return (
    <Admincontext.Provider
      value={{ Admins, addAdmin, remove_Admin, updateAdmin }}
    >
      {props.children}
    </Admincontext.Provider>
  );
};
