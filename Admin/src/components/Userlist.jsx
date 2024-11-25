import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/userContext";

export default function Userlist() {
  const { users, remove_user } = useContext(UserContext);
  const [Users, setUsers] = useState(users);

  useEffect(() => {
    setUsers(users);
  }, [users]);
  return (
    <div className="box-border bg-white mt-5 rounded-sm w-full">
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <table className="w-full mx-auto text-sm">
          <thead>
            <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200 ">
              <th className="p-2 text-start">Name</th>
              <th className="p-2 text-start">Phone</th>
              <th className="p-2 text-start">Email</th>
              <th className="p-2 text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {Users.length > 0 ? (
              Users.map((user) => (
                <tr key={user._id} className="border-b text-sm  ">
                  <td className="p-2 text-start">{user.fullName}</td>
                  <td className="p-2 text-start">{user.number}</td>
                  <td className="p-2 text-start">{user.email}</td>
                  <td className="p-2 text-center">
                    <button
                      className=" text-red-600 text-lg p-2 rounded"
                      onClick={() => {
                        remove_user(user._id);
                        setUsers(products.filter((u) => u._id !== user._id));
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
                  colSpan="4"
                  className="p-2 text-center text-gray-400 text-lg"
                >
                  NO USERS ADDED YET!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
