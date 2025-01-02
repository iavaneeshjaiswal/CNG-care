import React, { useContext, useEffect, useState } from "react";
import { WorkshopContext } from "../contexts/workshopContext";
import { useNavigate } from "react-router-dom";

export default function Adminlist() {
  const { value } = useContext(WorkshopContext);
  const navigate = useNavigate();
  const [workshopApproval, setWorkshopApproval] = useState([]);

  useEffect(() => {
    const fetchApprovalData = async () => {
      try {
        const res = value.getWorkshopsApproval();
        setWorkshopApproval(res.data);
        console.log(res.data)
      } catch (error) {
        console.error("Failed to fetch workshop approvals:", error);
      }
    };
    fetchApprovalData();
  }, [value]);

  return (
    <div className="p-2 box-border bg-white rounded-sm w-full">
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto text-sm">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200 ">
              <th className="p-2 text-start">WORKSHOP NAME</th>
              <th className="p-2 text-start">OWNER NAME</th>
              <th className="p-2 text-start">PHONE NUMBER</th>
              <th className="p-2 text-start">ADDRESS</th>
              <th className="p-2 text-center">VIEW</th>
            </tr>
          </thead>
          <tbody>
            {!workshopApproval.length ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-2 text-center text-gray-400 text-lg"
                >
                  LOADING...
                </td>
              </tr>
            ) : workshopApproval.length > 0 ? (
              workshopApproval.map((approval) => (
                <tr key={approval._id} className="border-b">
                  <td className="p-2 text-start">{approval.workshopName}</td>
                  <td className="p-2 text-start">
                    {approval.workshopOwnerName}
                  </td>
                  <td className="p-2 text-start">{approval.number}</td>
                  <td className="p-2 text-start">{approval.address.text}</td>
                  <td className="p-2 text-center">
                    <button
                      className="text-black text-xl p-2 rounded"
                      onClick={() => {
                        navigate(`/viewapproval/${approval._id}`);
                      }}
                    >
                      <i className="ri-edit-2-fill"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-2 text-center text-gray-400 text-lg "
                >
                  No approvals yet!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
