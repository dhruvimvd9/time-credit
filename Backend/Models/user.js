const mongoose = require("mongoose");

//Database Model
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    credits: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", UserSchema);