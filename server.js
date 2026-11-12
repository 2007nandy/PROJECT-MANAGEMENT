// server.js
// server.js
constexpress=require("express");
constmongoose=require("mongoose");
constcors=require("cors");

constapp=express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB (change the connection string as needed)
mongoose
  .connect("mongodb://localhost:27017/taskmanager", {})
  .then(() =>console.log("MongoDB connected"))
  .catch((err) =>console.log("MongoDB connection error:", err));

// Define Task Schema and Model
constTaskSchema=newmongoose.Schema(
  {
    title:{ type:String, required:true },
    status: {
      type:String,
      enum: ["Pending", "Ongoing", "Completed"],
      default:"Pending",
    },
  },
  { timestamps:true }
); // Added timestamps for createdAt and updatedAt

constTask=mongoose.model("Task", TaskSchema);

// Routes
// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    consttasks=awaitTask.find(); // Fetch all tasks from the database
    res.json(tasks); // Send the tasks as JSON response
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message:"Server error. Could not fetch tasks." });
  }
});

// Create a new task
app.post("/tasks", async (req, res) => {
  const{ title } =req.body;
  consttask=newTask({ title }); // Create a new task
  try {
    constnewTask=awaittask.save(); // Save task to the database
    res.status(201).json(newTask); // Respond with the created task
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(400).json({ message:"Invalid data. Could not create task." });
  }
});

// Update task status
app.patch("/tasks/:id", async (req, res) => {
  const{ status } =req.body;
  try {
    constupdatedTask=awaitTask.findByIdAndUpdate(
      req.params.id,
      { status },
      { new:true }
    ); // Update task and return the updated task
    if(!updatedTask)
      returnres.status(404).json({ message:"Task not found." });
    res.json(updatedTask); // Respond with the updated task
  } catch (err) {
    console.error("Error updating task status:", err);
    res
      .status(500)
      .json({ message:"Server error. Could not update task status." });
  }
});

// Delete a task by ID
app.delete("/tasks/:id", async (req, res) => {
 try {
   constdeletedTask=awaitTask.findByIdAndDelete(req.params.id); // Find and delete the task
   if(!deletedTask)
     returnres.status(404).json({ message:"Task not found." });
   res.json({ message:"Task deleted." }); // Respond with a success message
 } catch (err) {
   console.error("Error deleting task:", err);
   res.status(500).json({ message:"Server error. Could not delete task." });
 }
});

// Server configuration
constPORT=process.env.PORT||5000;
app.listen(PORT, () =>console.log(`Server running on port ${PORT}`));
