import React from "react";
import Navbar from "../components/Navbar";
import ApprovalList from "../components/ApprovalList";

function Approval() {
  return (
    <div className="flex w-full">
      <Navbar />
      <ApprovalList />
    </div>
  );
}

export default Approval;
