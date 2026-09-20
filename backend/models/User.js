const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: String,
    userEmail: String,
    password: String,
    role: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
