const express = require("express");
const Task = require("../Models/tasks");
const User = require("../Models/user");
const router = express.Router();

//create a task
router.post("/create", async (req, res) => {
    try {
        const { description, createdBy, category, credits } = req.body;
        const task = new Task({ description, createdBy, category, credits });
        await task.save();
        res.status(201).json({ message: "Task created", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//complete a task & update credits
router.post("/complete/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.completed = true;
        await task.save();

        const taskCreator = await User.findOne({ username: task.createdBy });
        if (!taskCreator) return res.status(404).json({ message: "Task creator not found" });

        const taskCompleter = await User.findById(req.body.userId);
        if (!taskCompleter) return res.status(404).json({ message: "Completer user not found" });

        taskCompleter.credits++;
        taskCreator.credits--;

        await taskCompleter.save();
        await taskCreator.save();

        res.json({
            message: "Task completed and credits updated",
            task,
            creatorCredits: taskCreator.credits,
            competerCredits: taskCompleter.credits
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;