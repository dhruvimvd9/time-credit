const express = require("express");
const User = require("../Models/user");
const Task = require("../Models/tasks");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
require("dotenv").config();

//signup
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ username, password });
        await user.save();
        res.json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(404).json({ message: "Inavalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/rate", authMiddleware, async (req, res) => {
    try {
        const { taskId, rating } = req.body;
        const task = await Task.findById(taskId);

        if (!task) return res.status(404).json({ message: "Task not found" });
        if (!task.completed) return res.status(400).json({ message: "Task must be completed to rate" });

        task.rating = rating;
        await task.save();

        res.json({ message: "Rating submitted successfully", task });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;