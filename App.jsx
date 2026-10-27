import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/tasks"
      );

      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError("Could not fetch tasks.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
  const createTask = async () => {
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/tasks",
        { title }
      );

      setTasks([...tasks, response.data]);
      setTitle("");
      setError(null);
      setSuccess("Task created successfully!");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Could not create task.");
      console.error(err);
    }
  };

  // Update task status
  const updateTaskStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/tasks/${id}`,
        { status: newStatus }
      );

      setTasks(
        tasks.map((task) =>
          task._id === id ? response.data : task
        )
      );

      setSuccess("Task status updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Could not update task status.");
      console.error(err);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/tasks/${id}`
      );

      setTasks(
        tasks.filter((task) => task._id !== id)
      );

      setSuccess("Task deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Could not delete task.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Task Manager</h1>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />

        <button
          className="btn btn-primary"
          onClick={createTask}
        >
          Add Task
        </button>
      </div>

      <div className="row">
        {["Pending", "Ongoing", "Completed"].map(
          (status) => (
            <div className="col-md-4" key={status}>
              <div className="card mb-4">
                <div className="card-header">
                  <h5>{status} Tasks</h5>
                </div>

                <div className="card-body">
                  {tasks
                    .filter(
                      (task) => task.status === status
                    )
                    .map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onUpdateStatus={updateTaskStatus}
                        onDelete={deleteTask}
                      />
                    ))}

                  {tasks.filter(
                    (task) => task.status === status
                  ).length === 0 && (
                    <p className="text-muted">
                      No tasks in this category.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const TaskCard = ({
  task,
  onUpdateStatus,
  onDelete
}) => {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h6 className="card-title">{task.title}</h6>

        <p className="card-text">
          Status: {task.status}
        </p>

        <div className="btn-group" role="group">
          {task.status !== "Ongoing" && (
            <button
              className="btn btn-info"
              onClick={() =>
                onUpdateStatus(task._id, "Ongoing")
              }
            >
              Mark as Ongoing
            </button>
          )}

          {task.status !== "Completed" && (
            <button
              className="btn btn-success"
              onClick={() =>
                onUpdateStatus(task._id, "Completed")
              }
            >
              Mark as Completed
            </button>
          )}

          <button
            className="btn btn-danger"
            onClick={() => onDelete(task._id)}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;