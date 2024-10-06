import React from "react";
import { Link } from "react-router-dom";
import { logOut } from "../helpers"; // Import the logOut function from helpers.js

const Navbar = ({ role }) => {
  // Accept role as a prop
  const handleLogout = async () => {
    try {
      await logOut(); // Call the logout function
      // You can choose to add a redirect here if needed
    } catch (error) {
      console.error("Logout failed:", error); // Handle any errors
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between">
        <h1 className="text-white font-bold text-lg">Admin Panel</h1>
        <div className="flex items-center">
          <Link to="/admin-dashboard" className="text-white mr-4">
            Dashboard
          </Link>
          {role === "admin" && ( // Conditionally render the Create Employee link
            <Link to="/create-employee" className="text-white mr-4">
              Create Employee
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 p-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
