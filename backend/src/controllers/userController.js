import User from "../models/userModel.js";

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};
