import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Userlist from "../components/Userlist";
import { useNavigate } from "react-router-dom";
export default function User() {
  return (
    <div className="flex w-full">
      <Navbar />
      <Userlist />
    </div>
  );
}
