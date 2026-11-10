const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.send("Project Management Backend Running!");
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const newTask = {
    _id: String(nextId++),
    title,
    description: description || "",
    status: status || "Pending"
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch("/tasks/:id", (req, res) => {
  const task = tasks.find(
    (t) => t._id === req.params.id
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  Object.assign(task, req.body);
  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex(
    (t) => t._id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  tasks.splice(index, 1);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
