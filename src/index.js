import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AdminSignUp from "./components/AdminSignUp";
import CreateEmployee from "./components/CreateEmployee";
import Navbar from "./components/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Cookies from "universal-cookie";
import { getUserRole } from "./helpers"; // Import the function to get user role
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

// Create a layout component that includes the Navbar
const Layout = ({ children, role }) => {
  return (
    <div>
      <Navbar role={role} />
      <div>{children}</div>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
};

const AppRouter = () => {
  const [role, setRole] = useState(null);
  const cookies = new Cookies();
  const employeeId = cookies.get("employeeId"); // Assuming you set the employee ID in the cookie after login

  useEffect(() => {
    const fetchRole = async () => {
      if (employeeId) {
        try {
          const userRole = await getUserRole(employeeId);
          setRole(userRole);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchRole();
  }, [employeeId]);

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/admin-dashboard",
          element: (
            <ProtectedRoute>
              <Layout role={role}>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          ),
        },
        {
          path: "/employee-dashboard",
          element: (
            <ProtectedRoute>
              <Layout role={role}>
                <EmployeeDashboard />
              </Layout>
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin-signup",
          element: (
            <Layout role={role}>
              <AdminSignUp />
            </Layout>
          ),
        },
        {
          path: "/create-employee",
          element: (
            <ProtectedRoute>
              <Layout role={role}>
                <CreateEmployee />
              </Layout>
            </ProtectedRoute>
          ),
        },
      ])}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
