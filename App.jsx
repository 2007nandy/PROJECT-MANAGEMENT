//src/app.js

importReact, { useState, useEffect } from"react";
importaxiosfrom"axios";
import'bootstrap/dist/css/bootstrap.min.css';
import'./App.css';

constApp= () => {
 const [tasks, setTasks] =useState([]);
 const [title, setTitle] =useState("");
 const [error, setError] =useState(null);
 const [success, setSuccess] =useState(null);

 // Fetch tasks
 constfetchTasks=async () => {
   try {
     constresponse=awaitaxios.get("http://localhost:5000/tasks");
     setTasks(response.data);
   } catch (err) {
     setError("Could not fetch tasks.");
     console.error(err);
   }
 };

 useEffect(() => {
  fetchTasks();
 }, []);

 // Create a new task
 constcreateTask=async () => {
   if(!title.trim()) {
     setError("Task title cannot be empty.");
     return;
   }
   try {
     constresponse=awaitaxios.post("http://localhost:5000/tasks", { title });
     setTasks([...tasks, response.data]);
    setTitle(""); // Clear input
    setError(null); // Clear error
    setSuccess("Task created successfully!"); // Show success message
    setTimeout(() =>setSuccess(null), 3000); // Clear success message after 3 seconds
  } catch (err) {
    setError("Could not create task.");
    console.error(err);
  }
 };

 // Update task status
 constupdateTaskStatus=async (id, newStatus) => {
   try {
     constresponse=awaitaxios.patch(`http://localhost:5000/tasks/${id}`, { status:newStatus });
     setTasks(tasks.map(task=> (task._id===id?response.data:task))); // Update task in state
     setSuccess("Task status updated successfully!");
     setTimeout(() =>setSuccess(null), 3000); // Clear success message after 3 seconds
   } catch (err) {
     setError("Could not update task status.");
     console.error(err);
   }
 };

 // Delete a task
 constdeleteTask=async (id) => {
   try {
     awaitaxios.delete(`http://localhost:5000/tasks/${id}`);
     setTasks(tasks.filter(task=>task._id!==id)); // Remove deleted task from state
     setSuccess("Task deleted successfully!");
     setTimeout(() =>setSuccess(null), 3000); // Clear success message after 3 seconds
   } catch (err) {
     setError("Could not delete task.");
     console.error(err);
   }
 };

 return (
  <divclassName="container mt-5">
    <h1className="text-center">Task Manager</h1>

   {error&&<divclassName="alert alert-danger">{error}</div>}{/* Show error message */}
   {success&&<divclassName="alert alert-success">{success}</div>}{/* Show success
message */}

   <divclassName="input-group mb-3">
    <input
     type="text"
     className="form-control"
     value={title}
     onChange={(e) =>setTitle(e.target.value)}
     placeholder="Enter task title"
    />
    <buttonclassName="btnbtn-primary"onClick={createTask}>Add Task</button>
   </div>
    <divclassName="row">
     {["Pending", "Ongoing", "Completed"].map((status) => (
       <divclassName="col-md-4"key={status}>
        <divclassName="card mb-4">
          <divclassName="card-header">
           <h5>{status} Tasks</h5>
          </div>
          <divclassName="card-body">
           {tasks.filter(task=>task.status === status).map((task) => (
             <TaskCard
              key={task._id}
              task={task}
              onUpdateStatus={updateTaskStatus}
              onDelete={deleteTask}
             />
           ))}
           {tasks.filter(task=>task.status === status).length === 0&& (
             <pclassName="text-muted">No tasks in this category.</p>
           )}
          </div>
        </div>
       </div>
     ))}
    </div>
   </div>
 );
};
constTaskCard=({ task, onUpdateStatus, onDelete }) => {
 return (
   <divclassName="card mb-2">
    <divclassName="card-body">
     <h6className="card-title">{task.title}</h6>
     <pclassName="card-text">Status: {task.status}</p>
     <divclassName="btn-group"role="group">
       {task.status !== "Ongoing"&& (
        <button
          className="btnbtn-info"
          onClick={() =>onUpdateStatus(task._id, "Ongoing")}
        >
          Mark as Ongoing
        </button>
       )}
       {task.status !== "Completed"&& (
        <button
          className="btnbtn-success"
          onClick={() =>onUpdateStatus(task._id, "Completed")}
        >
          Mark as Completed
        </button>
       )}
       <buttonclassName="btnbtn-danger"onClick={() =>onDelete(task._id)}>
        Delete Task
       </button>
     </div>
    </div>
   </div>
 );
};


exportdefaultApp;
