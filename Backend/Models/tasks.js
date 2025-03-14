const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    description: String,
    createdBy: String,
    category: String,
    completedBy: String,
    completed: { type: Boolean, default: false },
    creatorRating: { type: Number, min: 1, max: 5 },
    completerRating: { type: Number, min: 1, max: 5 },
    credits: { type: Number, default: "1" }
});

module.exports = mongoose.model("Tasks", TaskSchema);