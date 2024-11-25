import React, { useState, useEffect, createContext } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const UserProvider = (props) => {
  const [users, setUsers] = useState([]);

  const url = "http://localhost:4000";

  useEffect(() => {
    axios
      .get(`${url}/admin/all-users`)
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
  }, []);


  const updateUserState = async () => {
    const res = await axios.get(`${url}/admin/all-users`);
    setUsers(res.data.users);
  };
  const remove_user = (id) => {
    axios
      .delete(`${url}/user/remove-user/${id}`)
      .then(() => updateUserState())
      .catch((err) => console.log(err));
  };

  return (
    <UserContext.Provider value={{ users, remove_user, url }}>
      {props.children}
    </UserContext.Provider>
  );
};
