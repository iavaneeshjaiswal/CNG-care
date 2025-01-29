import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { WorkshopContext } from "../context/contextapi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogout, changeAvailability, state } =
    useContext(WorkshopContext);

  // Toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Toggle availability
  const toggleAvailability = async () => {
    try {
      await changeAvailability();
    } catch (error) {
      console.error(error);
      alert(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <nav className="bg-[#FC370F] p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-white font-bold text-xl">Workshop Pannel</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-white hover:bg-white hover:text-[#FC370F] px-3 py-2 rounded-md transition-all duration-300"
          >
            Services
          </Link>
          <Link
            to="/approval"
            className="text-white hover:bg-white hover:text-[#FC370F] px-3 py-2 rounded-md transition-all duration-300"
          >
            Approvals
          </Link>
          <Link
            to="/complete"
            className="text-white hover:bg-white hover:text-[#FC370F] px-3 py-2 rounded-md transition-all duration-300"
          >
            Complete
          </Link>
          <button
            onClick={toggleAvailability}
            className={`text-white px-3 py-2 rounded-md transition-all duration-300 cursor-pointer ${
              state.isAvailable ? "bg-green-500" : "bg-red-700"
            }`}
          >
            {state.isAvailable ? "Available" : "Unavailable"}
          </button>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-white hover:text-[#FC370F] px-3 py-2 rounded-md transition-all duration-300 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white transition-all duration-300 transform hover:scale-110"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`h-6 w-6 transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isOpen ? "block" : "hidden"
        } bg-[#FC370F] text-white p-4 space-y-4 transition-opacity duration-500 opacity-0 transform ${
          isOpen ? "opacity-100 translate-y-0" : "translate-y-4"
        }`}
      >
        <Link
          to="/"
          className="block px-3 py-2 rounded-md hover:bg-white hover:text-[#FC370F] transition-all duration-300"
        >
          Services
        </Link>
        <Link
          to="/approval"
          className="block px-3 py-2 rounded-md hover:bg-white hover:text-[#FC370F] transition-all duration-300"
        >
          Approvals
        </Link>
        <Link
          to="/complete"
          className="block px-3 py-2 rounded-md hover:bg-white hover:text-[#FC370F] transition-all duration-300"
        >
          Complete
        </Link>
        <button
          onClick={toggleAvailability}
          className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-300 ${
            state.isAvailable ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {state.isAvailable ? "Available" : "Unavailable"}
        </button>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-3 py-2 rounded-md hover:bg-white hover:text-[#FC370F] transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
