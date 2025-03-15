const express = require("express");
const Task = require("../Models/tasks");
const User = require("../Models/user");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const path = require("path");
const user = require("../Models/user");
require("dotenv").config();

//create a task
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { description, category } = req.body;
        const userId = req.user;
        if (!description || !category) {
            return res.status(400).json({ message: "Description and category are required." });
        }
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const task = new Task({ description, createdBy: user.username, category, credits: 1 });
        await task.save();
        res.status(201).json({ message: "Task created", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//complete a task & update credits
router.post("/complete/:id", authMiddleware, async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.completed) return res.status(400).json({ message: "Task is already completed" });

        const taskCreator = await User.findOne({ username: task.createdBy });
        if (!taskCreator) return res.status(404).json({ message: "Task creator not found" });

        const taskCompleter = await User.findById(req.user);
        if (!taskCompleter) return res.status(404).json({ message: "Completer user not found" });


        task.completed = true;
        task.completedBy = req.user;
        await task.save();

        if (taskCreator.credits > 0) {
            taskCreator.credits--;
        }
        taskCompleter.credits++;
        await taskCreator.save();
        await taskCompleter.save();

        res.json({
            message: "Task completed and credits updated",
            task,
            creatorCredits: taskCreator.credits,
            completerCredits: taskCompleter.credits
        });

    } catch (error) {
        console.error("Error completing task:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
});

router.post("/rate/:id", authMiddleware, async (req, res) => {
    try {
        const { creatorRating, completerRating, } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (!task.completed) return res.status(400).json({ message: "Task is not completed yet" });

        task.creatorRating = creatorRating;
        task.completerRating = completerRating;

        await task.save();
        res.json({ message: "Rating submitted successfully", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;