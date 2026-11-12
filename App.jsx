import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const showSuccess = (message) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 3000);
  };

  const fetchTasks = async () => {
    try {
      setError("");
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Could not fetch tasks:", err);
      setError("Could not fetch tasks. Check that the Render backend is running and VITE_API_URL is correct.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    try {
      const response = await api.post("/tasks", { title: title.trim() });
      setTasks((current) => [...current, response.data]);
      setTitle("");
      setError("");
      showSuccess("Task created successfully!");
    } catch (err) {
      console.error("Could not create task:", err);
      setError(err.response?.data?.message || "Could not create task. Check your backend and database.");
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const response = await api.patch(`/tasks/${id}`, { status: newStatus });
      setTasks((current) => current.map((task) => task._id === id ? response.data : task));
      setError("");
      showSuccess("Task status updated successfully!");
    } catch (err) {
      console.error("Could not update task:", err);
      setError(err.response?.data?.message || "Could not update task status.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((current) => current.filter((task) => task._id !== id));
      setError("");
      showSuccess("Task deleted successfully!");
    } catch (err) {
      console.error("Could not delete task:", err);
      setError(err.response?.data?.message || "Could not delete task.");
    }
  };

  const statuses = ["Pending", "Ongoing", "Completed"];

  return (
    <main className="container py-5">
      <h1 className="text-center mb-4">Task Manager</h1>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="status">{success}</div>}

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && createTask()}
          placeholder="Enter task title"
          aria-label="Task title"
        />
        <button className="btn btn-primary" onClick={createTask}>Add Task</button>
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading tasks...</p>
      ) : (
        <div className="row">
          {statuses.map((status) => {
            const statusTasks = tasks.filter((task) => task.status === status);
            return (
              <section className="col-md-4 mb-3" key={status}>
                <div className="card h-100">
                  <div className="card-header">
                    <h5 className="mb-0">{status} Tasks ({statusTasks.length})</h5>
                  </div>
                  <div className="card-body">
                    {statusTasks.length ? statusTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onUpdateStatus={updateTaskStatus}
                        onDelete={deleteTask}
                      />
                    )) : (
                      <p className="text-muted mb-0">No tasks in this category.</p>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

function TaskCard({ task, onUpdateStatus, onDelete }) {
  return (
    <article className="card task-card mb-3">
      <div className="card-body">
        <h6 className="card-title">{task.title}</h6>
        <p className="card-text">Status: {task.status}</p>
        <div className="d-flex flex-wrap gap-2">
          {task.status !== "Ongoing" && (
            <button className="btn btn-info btn-sm" onClick={() => onUpdateStatus(task._id, "Ongoing")}>
              Mark as Ongoing
            </button>
          )}
          {task.status !== "Completed" && (
            <button className="btn btn-success btn-sm" onClick={() => onUpdateStatus(task._id, "Completed")}>
              Mark as Completed
            </button>
          )}
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>
            Delete Task
          </button>
        </div>
      </div>
    </article>
  );
}

export default App;
