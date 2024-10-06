// CreateEmployee.jsx
import React, { useState } from "react";
import { signUpWithRole } from "../helpers"; // Adjust the path if needed

const CreateEmployee = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await signUpWithRole(email, password, "employee"); // Create employee
      setSuccess("Employee account created successfully!");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Error creating employee:", err);
      setError("Failed to create employee account. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Employee</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleCreateEmployee}>
        <label htmlFor="email" className="block mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
          required
        />

        <label htmlFor="password" className="block mb-2">
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Employee
        </button>
      </form>
    </div>
  );
};

export default CreateEmployee;
