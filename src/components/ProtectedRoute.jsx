// ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole, auth } from "../helpers"; // Import the getUserRole function from helpers.js
import Cookies from "universal-cookie";

const ProtectedRoute = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cookies = new Cookies();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser; // Get the current authenticated user
        if (user) {
          const role = await getUserRole(user.uid); // Fetch user role from Firestore
          setUserRole(role);
        } else {
          setUserRole(null); // If no user, set role to null
        }
      } catch (err) {
        setError("Failed to fetch user role");
      } finally {
        setLoading(false); // Ensure loading state is false
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user role
  }

  if (error) {
    return <div>{error}</div>; // Show error if there's an issue
  }

  // Check if the user is authenticated using the cookie
  const isAuthenticated = cookies.get("auth");

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated, render the child components
  return children;
};

export default ProtectedRoute;
