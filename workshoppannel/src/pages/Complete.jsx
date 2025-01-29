import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/navbar";
import { WorkshopContext } from "../context/contextapi";

function Complete() {
  const { fetchAcceptedServices, completeService } =
    useContext(WorkshopContext);
  const [acceptedServices, setAcceptedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [serviceID, setServiceID] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Complete - Workshop Pannel";
    loadAcceptedServices();
  }, []);

  const loadAcceptedServices = async () => {
    try {
      const data = await fetchAcceptedServices();
      setAcceptedServices(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      await completeService(serviceID, amount);
      setShowModal(false);
      loadAcceptedServices();
    } catch (error) {
      console.log("Error updating service status:", error);
    }
  };

  const openModal = (id) => {
    setServiceID(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Filtered services based on search query
  const filteredServices = acceptedServices.filter((service) =>
    service._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 w-full text-center">
          Mark Complete Services
        </h2>

        {/* Search Input */}
        <div className="mb-4 w-full text-center">
          <input
            type="text"
            placeholder="Search by Service ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full sm:w-1/3 mx-auto"
          />
        </div>

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
                  <th className="py-2 px-4 border-b text-left">Service ID</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-center">Complete</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length !== 0 ? (
                  filteredServices.map((service, index) => (
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
                        {service._id}
                      </td>
                      <td className="py-2 px-4 border-b text-left">
                        {service.status}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 cursor-pointer"
                          onClick={() => openModal(service._id)}
                        >
                          Complete
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

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Mark Service as Completed
            </h3>
            <div className="mb-4">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                min={0}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                required
              />
            </div>
            <div className="flex justify-between gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded w-full hover:bg-gray-600"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
                onClick={handleComplete}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Complete;
