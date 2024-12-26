import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import TransactionList from "../components/transactionList";
import { useNavigate } from "react-router-dom";

export default function Transaction() {
  return (
    <div>
      <div className="flex gap-3 w-full">
        <Navbar />
        <TransactionList />
      </div>
    </div>
  );
}
