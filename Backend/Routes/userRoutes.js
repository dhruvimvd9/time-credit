const express = require("express");
const User = require("../Models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

//signup
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User created successfully" });
});

//login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).json({ message: "Inavalid credentials" });

    res.json({ message: "Login successful" });
});

module.exports = router;