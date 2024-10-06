import React, { useEffect, useState } from "react";
import { getTasksForEmployee, updateTaskStatus, addComment } from "../helpers";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";

const EmployeeDashboard = () => {
  const cookies = new Cookies();
  const employeeId = cookies.get("employeeId");

  const [tasks, setTasks] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      if (employeeId) {
        const tasksForEmployee = await getTasksForEmployee(employeeId);
        setTasks(tasksForEmployee);
      }
    };

    fetchTasks();
  }, [employeeId]);

  const handleStatusUpdate = async (taskId) => {
    const newStatus = statusUpdate[taskId] || "Yet to start";
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      setStatusUpdate((prev) => ({ ...prev, [taskId]: "" }));
      toast.success("Task status updated successfully!");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleCommentSubmit = async (taskId) => {
    const comment = comments[taskId] || "";
    if (comment) {
      try {
        await addComment(taskId, comment);
        setComments((prev) => ({ ...prev, [taskId]: "" }));
        toast.success("Comment added successfully!");
        const tasksForEmployee = await getTasksForEmployee(employeeId);
        setTasks(tasksForEmployee);
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment. Please try again.");
      }
    }
  };

  const handleRefreshTasks = async () => {
    if (employeeId) {
      const tasksForEmployee = await getTasksForEmployee(employeeId);
      setTasks(tasksForEmployee);
      toast.info("Tasks refreshed successfully!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>

      <button
        onClick={handleRefreshTasks}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
      >
        Refresh Tasks
      </button>

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
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
              <th className="border border-gray-300 p-2">Comments</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border border-gray-300 p-2">
                  {task.description}
                </td>
                <td className="border border-gray-300 p-2">
                  {task.assignedBy || "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {task.createdAt
                    ? task.createdAt.toDate().toLocaleString()
                    : "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {task.deadline
                    ? task.deadline.toDate().toLocaleString()
                    : "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    value={statusUpdate[task.id] || task.status}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        [task.id]: e.target.value,
                      }))
                    }
                    className="border rounded p-1"
                  >
                    <option value="Yet to start">Yet to start</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                  <button
                    onClick={() => handleStatusUpdate(task.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Update Status
                  </button>
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={comments[task.id] || ""}
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [task.id]: e.target.value,
                      }))
                    }
                    className="border rounded p-1"
                    placeholder="Add comment"
                  />
                  <button
                    onClick={() => handleCommentSubmit(task.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Submit Comment
                  </button>
                </td>
                <td className="border border-gray-300 p-2">
                  {task.comments && task.comments.length > 0 ? (
                    <ul>
                      {task.comments.map((comment, index) => (
                        <li key={index} className="text-gray-600">
                          {comment}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeDashboard;
