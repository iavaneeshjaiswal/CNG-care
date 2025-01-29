import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/navbar";
import { WorkshopContext } from "../context/contextapi";

function Approval() {
  const [pendingServices, setPendingServices] = useState([]);
  const { fetchPendingServices, updateservicestatus } =
    useContext(WorkshopContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Approval - Workshop Pannel";
    loadPendingServices();
  }, []);

  // Function to fetch the services
  const loadPendingServices = async () => {
    try {
      const data = await fetchPendingServices();
      setPendingServices(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Function to handle status updates (Accept/Reject)
  const handleStatusChange = async (serviceID, newStatus) => {
    try {
      await updateservicestatus(serviceID, newStatus); // Update the status
      loadPendingServices(); // Refresh the pending services
    } catch (error) {
      console.log("Error updating service status:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 w-full text-center">
          Approvals Pending Services
        </h2>
        {loading ? (
          <div className="w-full text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">
                    Customer Name
                  </th>
                  <th className="py-2 px-4 border-b text-left">
                    Customer Number
                  </th>
                  <th className="py-2 px-4 border-b text-left">Service Type</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-center">Accept</th>
                  <th className="py-2 px-4 border-b text-center">Reject</th>
                </tr>
              </thead>
              <tbody>
                {pendingServices.length !== 0 ? (
                  pendingServices.map((service, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b text-left">
                        {service.customerID
                          ? service.customerID.fullName
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b text-left">
                        {service.customerID ? service.customerID.number : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b text-left">
                        {service.serviceType}
                      </td>
                      <td className="py-2 px-4 border-b text-left">
                        {service.status}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(service._id, "Accepted")
                          }
                        >
                          Accept
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(service._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-2 px-4 border-b text-center">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Approval;
