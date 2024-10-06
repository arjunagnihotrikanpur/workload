import React, { useEffect, useState } from "react";
import {
  getAllEmployees,
  getTasksForEmployee,
  assignTask,
  deleteTask,
} from "../helpers"; // Ensure deleteTask is imported

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeList = await getAllEmployees();
        setEmployees(employeeList);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (selectedEmployee) {
        const tasksForEmployee = await getTasksForEmployee(selectedEmployee);
        setTasks(tasksForEmployee);
      }
    };

    fetchTasks();
  }, [selectedEmployee]);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedEmployee || !taskDescription || !deadline) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await assignTask(selectedEmployee, taskDescription, deadline);
      setSuccess("Task assigned successfully!");
      setTaskDescription("");
      setDeadline("");

      // Refresh tasks for the selected employee
      const tasksForEmployee = await getTasksForEmployee(selectedEmployee);
      setTasks(tasksForEmployee);
    } catch (err) {
      console.error("Error assigning task:", err);
      setError("Failed to assign task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId); // Ensure deleteTask is implemented in helpers.js
      setTasks(tasks.filter((task) => task.id !== taskId));
      setSuccess("Task deleted successfully!");
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleAssignTask} className="mb-6">
        <label htmlFor="employee" className="block mb-2">
          Select Employee:
        </label>
        <select
          id="employee"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border rounded p-2 mb-4"
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.email}
            </option>
          ))}
        </select>

        <label htmlFor="taskDescription" className="block mb-2">
          Task Description:
        </label>
        <input
          type="text"
          id="taskDescription"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
          required
        />

        <label htmlFor="deadline" className="block mb-2">
          Deadline:
        </label>
        <input
          type="datetime-local"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Assign Task
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Assigned By</th>
              <th className="border border-gray-300 p-2">Created At</th>
              <th className="border border-gray-300 p-2">Deadline</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border border-gray-300 p-2">
                  {task.description}
                </td>
                <td className="border border-gray-300 p-2">
                  {task.assignedBy}
                </td>
                <td className="border border-gray-300 p-2">
                  {task.createdAt.toDate().toLocaleString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {task.deadline.toDate().toLocaleString()}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
