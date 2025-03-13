const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Database Model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 0 }
});

//hash password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("User", UserSchema);