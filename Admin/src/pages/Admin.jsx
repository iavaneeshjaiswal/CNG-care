import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Adminlist from "../components/adminlist";
import { useNavigate } from "react-router-dom";
import { Admincontext } from "../contexts/admincontext";

export default function Admin() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    setRole(localStorage.getItem("role"));
  }, []);
  const [role, setRole] = useState("");

  return (
    <div className="flex w-full">
      <Navbar />

      {role == "superAdmin" ? (
        <Adminlist />
      ) : (
        <div className="flex flex-col justify-center items-center p-3 w-full text-red-600 text-lg">
          <p>Auth Failed : Only super admin can see this.</p>
        </div>
      )}
    </div>
  );
}
