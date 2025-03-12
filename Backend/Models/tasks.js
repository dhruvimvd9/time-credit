const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    description: String,
    createdBy: String,
    category: String,
    assignedTo: String,
    completed: { type: Boolean, default: false },
    credits: Number
});

module.exports = mongoose.model("Tasks", TaskSchema);