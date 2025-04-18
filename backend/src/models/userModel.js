import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // שמור כהאש
  role: { type: String, enum: ["mentor", "student"], required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
