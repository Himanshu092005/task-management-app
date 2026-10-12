
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = 5000;

// Allow requests from React frontend
app.use(cors());

// Middleware to read JSON requests
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Task Management Backend is running!");
});

// Task routes
app.use("/api/tasks", taskRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
