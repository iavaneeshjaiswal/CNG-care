import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Adminlist from "../components/Adminlist";
export default function Admin() {
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);
  const [role, setRole] = useState("");

  return (
    <div className="flex w-full">
      <Navbar />

      {role == "super admin" ? (
        <Adminlist />
      ) : (
        <div className="flex flex-col justify-center items-center p-3 w-full text-red-600 text-lg">
          <p>Auth Failed : Only super admin can see this.</p>
        </div>
      )}
    </div>
  );
}
