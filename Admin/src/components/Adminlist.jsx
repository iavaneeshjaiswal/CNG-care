import React, { useContext, useEffect, useState } from "react";
import { Admincontext } from "../contexts/admincontext";
import { useNavigate } from "react-router-dom";

export default function Adminlist() {
  const { Admins, remove_Admin, setAdmins } = useContext(Admincontext);
  const navigate = useNavigate();
  return (
    <div className="p-2 box-border bg-white rounded-sm w-full">
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <p className="font-bold p-2 text-sm">
          NOTE :
          <span className="text-red-600 text-sm">
            ONLY SUPER ADMIN CAN UPDATE AND REMOVE ADMIN LIST
          </span>
        </p>
        <table className="w-full mx-auto text-sm">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200 ">
              <th className="p-2 text-start">NAME</th>
              <th className="p-2 text-start">USERNAME</th>
              <th className="p-2 text-start">PASSWORD</th>
              <th className="p-2 text-start">ROLE</th>
              <th className="p-2 text-center">UPDATE</th>
              <th className="p-2 text-center">REMOVE</th>
            </tr>
          </thead>
          <tbody>
            {Admins.length > 0 ? (
              Admins.map((admin) => (
                <tr key={admin._id} className="border-b">
                  <td className="p-2 text-start">{admin.name}</td>
                  <td className="p-2 text-start">{admin.username}</td>
                  <td className="p-2 text-start">{admin.password}</td>
                  <td className="p-2 text-start">{admin.role}</td>
                  <td className="p-2 text-CENTER">
                    <button
                      className=" text-black text-xl p-2 rounded"
                      onClick={() => {
                        navigate(`/updateadmin/${admin._id}`);
                      }}
                    >
                      {<i class="ri-edit-2-fill"></i>}
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className="text-red-500 p-2 text-black text-xl rounded"
                      onClick={() => {
                        remove_Admin(admin._id);
                        setAdmins(Admins.filter((a) => a._id !== admin._id));
                      }}
                    >
                      {<i class="ri-delete-bin-6-line"></i>}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="p-2 text-center text-gray-400 text-lg "
                >
                  No admins yet!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
