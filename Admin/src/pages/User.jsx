import React from "react";
import Navbar from "../components/Navbar";
import Userlist from "../components/Userlist";

export default function User() {
  return (
    <div className="flex w-full">
      <Navbar />
      <Userlist />
    </div>
  );
}
