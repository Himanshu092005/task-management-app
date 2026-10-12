
const express = require("express");
const router = express.Router();

// Temporary tasks data
let tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        description: "Understand backend basics",
        completed: false
    },
    {
        id: 2,
        title: "Build Task Management App",
        description: "Create backend APIs",
        completed: false
    }
];

// GET: Get all tasks
router.get("/", (req, res) => {
    res.json(tasks);
});

// POST: Create a new task
router.post("/", (req, res) => {
    const { title, description } = req.body;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: description || "",
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task created successfully",
        task: newTask
    });
});

// PUT: Update an existing task
router.put("/:id", (req, res) => {
    const taskId = Number(req.params.id);
    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const { title, description, completed } = req.body;

    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Title must be a non-empty string"
            });
        }

        task.title = title.trim();
    }

    if (description !== undefined) {
        if (typeof description !== "string") {
            return res.status(400).json({
                message: "Description must be a string"
            });
        }

        task.description = description;
    }

    if (completed !== undefined) {
        if (typeof completed !== "boolean") {
            return res.status(400).json({
                message: "Completed must be true or false"
            });
        }

        task.completed = completed;
    }

    res.json({
        message: "Task updated successfully",
        task
    });
});

// DELETE: Delete a task
router.delete("/:id", (req, res) => {
    const taskId = Number(req.params.id);
    const taskIndex = tasks.findIndex(
        (task) => task.id === taskId
    );

    if (taskIndex === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
        message: "Task deleted successfully",
        task: deletedTask
    });
});

module.exports = router;
