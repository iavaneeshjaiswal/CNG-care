import React, { useState, useEffect } from "react";
import axios from "axios";

function WorkshopList() {
  const [workshop, setworkshop] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const url = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${url}/workshop`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setworkshop(data.workshops);
        setIsLoading(false);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchWorkshop();
    const interval = setInterval(fetchWorkshop, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredworkshop = workshop.filter((workshop) => {
    if (
      searchTerm &&
      !workshop.workshopName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-2 box-border bg-white mt-5 rounded-sm w-full">
      <div className="max-h-[77vh] overflow-auto px-4 text-center">
        <div className="w-full mb-4 gap-4 flex">
          <input
            type="text"
            placeholder="Search by WorkShop Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-4/6 border-2 rounded focus:outline-none col-span-1"
          />
        </div>
        <p className="text-lg font-bold text-start my-2 w-full ">
          Total Workshops: {workshop.length || 0}
        </p>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <table className="w-full mx-auto text-sm">
            <thead>
              <tr className="bg-primary bold-14 sm:regular-22 text-start py-12 bg-gray-200">
                <th className="p-2 text-start">Workshop ID</th>
                <th className="p-2 text-start">WORKSHOP NAME</th>
                <th className="p-2 text-start">OWNER NAME</th>
                <th className="p-2 text-start">ADDRESS TEXT</th>
              </tr>
            </thead>
            <tbody>
              {filteredworkshop.length > 0 ? (
                filteredworkshop.map((workshop) => (
                  <tr key={workshop._id} className="border-b">
                    <td className="p-2 text-start">{workshop._id}</td>
                    <td className="p-2 text-start">{workshop.workshopName}</td>
                    <td className="p-2 text-start">{workshop.ownerName}</td>
                    <td className="p-2 text-start">{workshop.address.text}</td>
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

export default WorkshopList;
