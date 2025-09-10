const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
 {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // later you can hash it with bcrypt
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
