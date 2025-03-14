require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

//connect database
mongoose.connect("mongodb://127.0.0.1:27017/time-credit-platform",)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//connect API

app.use(express.static(path.join(__dirname, "..", "Frontend")));

const userRoutes = require("./Routes/userRoutes");
app.use("/users", userRoutes);

const taskRoutes = require("./Routes/taskRoutes");
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "index.html"));
});

app.get("/tasks.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "tasks.html"));
});

app.get("/signup.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "signup.html"));
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});