import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/navbar";
import { WorkshopContext } from "../context/contextapi";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const { fetchServices } = useContext(WorkshopContext);

  useEffect(() => {
    document.title = "Services - Workshop Pannel";
    try {
      fetchServices().then((data) => {
        setServices(data);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredServices = services.filter((service) =>
    statusFilter ? service.status === statusFilter : true
  );

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 w-full text-center">Services</h2>
        <div className="mb-4 w-full text-center">
          <label htmlFor="statusFilter" className="mr-2">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border border-gray-300 p-2 rounded-lg"
          >
            <option value="">All</option>
            <option value="Rejected">Rejected</option>
            <option value="Accepted">Accepted</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        {loading ? (
          <div className="w-full text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Customer ID</th>
                  <th className="py-2 px-4 border-b text-left">
                    Customer Name
                  </th>
                  <th className="py-2 px-4 border-b text-left">
                    Customer Number
                  </th>
                  <th className="py-2 px-4 border-b text-left">Service Type</th>
                  <th className="py-2 px-4 border-b text-left">Service ID</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-right">Amount ₹</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-left">
                      {service.customerID ? service.customerID._id : "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {service.customerID ? service.customerID.fullName : "N/A"}
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
                    <td className={`py-2 px-4 border-b text-left`}>
                      {service.status}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {service.amount
                        ? parseFloat(service.amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "Not Defined"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Services;
