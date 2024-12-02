import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const UserProvider = (props) => {
  const [users, setUsers] = useState([]);
  const [token] = useState(localStorage.getItem("token"));
  const [iswait, setIswait] = useState(true);
  const url = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    axios
      .get(`${url}/user/all-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: localStorage.getItem("id"),
        },
      })
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
  }, []);

  const updateUserState = async () => {
    if (!token) return;
    const res = await axios.get(`${url}/user/all-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        id: localStorage.getItem("id"),
      },
    });
    setUsers(res.data.users);
  };
  const remove_user = (id) => {
    axios
      .delete(`${url}/user/remove-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: localStorage.getItem("id"),
        },
      })
      .then(() => updateUserState())
      .catch((err) => console.log(err));
  };

  return (
    <UserContext.Provider
      value={{ users, remove_user, url, iswait, setIswait }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
