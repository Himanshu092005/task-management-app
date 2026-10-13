require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Task Management Backend is running!");
});

// Task routes
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB, then start the server
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
