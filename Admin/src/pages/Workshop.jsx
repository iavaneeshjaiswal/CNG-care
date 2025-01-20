import React from "react";
import Navbar from "../components/Navbar";
import WorkshopList from "../components/WorkshopList";

export default function Workshop() {
  return (
    <div>
      <div className="flex gap-3 w-full">
        <Navbar />
        <WorkshopList />
      </div>
    </div>
  );
}
