import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function TransactionList() {
  const [transaction, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true);
      const { data } = await axios.get(
        "http://localhost:3000/transaction/list-transaction",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data);
      setTransactions(data);
      setIsLoading(false);
    };
    fetchTransaction();
  }, []);

  const filteredTransaction = transaction.filter((trans) =>
    trans._id
      .replace(/\s+/g, "")
      .toLowerCase()
      .includes(searchTerm.replace(/\s+/g, "").toLowerCase())
  );

  return (
    <div className="p-2 box-border bg-white mt-5 rounded-sm w-full">
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search by Transaction ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-full border-2 rounded focus:outline-none"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <table className="w-full mx-auto text-sm">
            <thead>
              <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200">
                <th className="p-2 text-start">TRANSACTION ID</th>
                <th className="p-2 text-start">ORDER ID</th>
                <th className="p-2 text-start">CUSTOMER NAME</th>
                <th className="p-2 text-start">PAYMENT ID (Gateway)</th>
                <th className="p-2 text-start">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransaction.length > 0 ? (
                filteredTransaction.map((transaction) => (
                  <tr key={transaction._id} className="border-b">
                    <td className="p-2 text-start">{transaction._id}</td>
                    <td className="p-2 text-start">{transaction.orderID}</td>
                      {transaction.userID.fullName}
                    <td className="p-2 text-start">{transaction.paymentID}</td>
                    <td className="p-2 text-start">₹{transaction.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-2 text-center text-gray-400 text-lg"
                  >
                    NO ORDERS
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TransactionList;

