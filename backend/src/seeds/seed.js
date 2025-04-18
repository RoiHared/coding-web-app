import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import bcrypt from "bcrypt";
import CodeBlock from "../models/codeBlockModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

config();

const passwordHash = await bcrypt.hash("123456", 10);

const seedMentors = [
  { username: "mentor1", password: passwordHash, role: "mentor" },
  { username: "mentor2", password: passwordHash, role: "mentor" },
];

const seedStudents = [
  { username: "student1", password: passwordHash, role: "student" },
  { username: "student2", password: passwordHash, role: "student" },
  { username: "student3", password: passwordHash, role: "student" },
  { username: "student4", password: passwordHash, role: "student" },
];

const seedCodeBlocks = [
  {
    title: "Async Case",
    templateCode: `async function fetchData() {\n  // your code here\n}`,
    solutionCode: `async function fetchData() {\n  const res = await fetch("https://api.com");\n  const data = await res.json();\n  return data;\n}`,
  },
  {
    title: "Array Map",
    templateCode: `const numbers = [1, 2, 3];\n// your code here`,
    solutionCode: `const numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);`,
  },
  {
    title: "Promise Chain",
    templateCode: `getUser()\n  // your code here`,
    solutionCode: `getUser()\n  .then(user => getPosts(user.id))\n  .then(posts => console.log(posts));`,
  },
  {
    title: "Class Example",
    templateCode: `class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  // your code here\n}`,
    solutionCode: `class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    console.log(this.name + ' makes a sound');\n  }\n}`,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await CodeBlock.deleteMany({});

    await User.insertMany(seedMentors);
    await User.insertMany(seedStudents);
    await CodeBlock.insertMany(seedCodeBlocks);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDatabase();
