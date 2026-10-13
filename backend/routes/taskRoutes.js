const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET: Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
});

// POST: Create a new task
router.post("/", async (req, res) => {
    try {
        const { title, description } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description ?? ""
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create task" });
    }
});

// PUT: Update an existing task
router.put("/:id", async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        if (title !== undefined &&
            (typeof title !== "string" || !title.trim())) {
            return res.status(400).json({
                message: "Title must be a non-empty string"
            });
        }

        if (description !== undefined &&
            typeof description !== "string") {
            return res.status(400).json({
                message: "Description must be a string"
            });
        }

        if (completed !== undefined &&
            typeof completed !== "boolean") {
            return res.status(400).json({
                message: "Completed must be true or false"
            });
        }

        const updates = {};

        if (title !== undefined) updates.title = title.trim();
        if (description !== undefined) updates.description = description;
        if (completed !== undefined) updates.completed = completed;

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        res.status(500).json({ message: "Failed to update task" });
    }
});

// DELETE: Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({
            message: "Task deleted successfully",
            task
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        res.status(500).json({ message: "Failed to delete task" });
    }
});

module.exports = router;