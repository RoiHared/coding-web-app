import { Server } from "socket.io";
import http from "http";
import express from "express";
import CodeBlock from "../models/codeBlockModel.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const codeBlocks = {};
const roomsRoles = {};
const socketRoles = {};
const codeBlockSolutions = {};

function updateStudentCount(codeBlockId) {
  const students = Object.values(socketRoles).filter(
    (info) => info.codeBlockId === codeBlockId && info.role === "student"
  );
  io.to(codeBlockId).emit("student_count", students.length);
}

function broadcastUsersInRoom(codeBlockId) {
  const users = Object.values(socketRoles)
    .filter((info) => info.codeBlockId === codeBlockId)
    .map((info) => ({
      username: info.username,
      role: info.role,
    }));
  io.to(codeBlockId).emit("users_in_room", users);
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", async ({ codeBlockId, userId, username }) => {
    socket.join(codeBlockId);
    console.log(`${username} (${userId}) joined room: ${codeBlockId}`);

    let role = "student";
    if (!roomsRoles[codeBlockId]) {
      roomsRoles[codeBlockId] = userId;
      role = "mentor";
    }

    try {
      const codeBlock = await CodeBlock.findById(codeBlockId);
      console.log(codeBlock);
      codeBlockSolutions[codeBlockId] = codeBlock.solutionCode;
      const latestCode = codeBlocks.hasOwnProperty(codeBlockId)
        ? codeBlocks[codeBlockId]
        : codeBlock.templateCode;

      socket.emit("init_data", {
        title: codeBlock.title,
        code: latestCode,
        role,
        solutionCode: codeBlock.solutionCode,
      });

      socket.codeBlockId = codeBlockId;
      socket.userId = userId;
      socketRoles[socket.id] = { role, codeBlockId, userId, username };

      updateStudentCount(codeBlockId);
      broadcastUsersInRoom(codeBlockId);
    } catch (err) {
      console.error("Error loading code block:", err.message);
      socket.emit("init_data", {
        title: "Error",
        code: "// Error loading code block...",
        role,
        solutionCode: "",
      });
    }
  });

  socket.on("send_message", ({ code, codeBlockId }) => {
    codeBlocks[codeBlockId] = code;
    socket.to(codeBlockId).emit("receive_message", code);

    const solution = codeBlockSolutions[codeBlockId];
    if (solution && code.trim() === solution.trim()) {
      io.to(codeBlockId).emit("show_smiley");
    } else {
      io.to(codeBlockId).emit("hide_smiley");
    }
  });

  socket.on("send_chat_message", ({ codeBlockId, msg }) => {
    socket.to(codeBlockId).emit("receive_chat_message", msg);
  });

  socket.on("leave_room", ({ codeBlockId, userId }) => {
    console.log(`${userId} left room ${codeBlockId}`);

    if (roomsRoles[codeBlockId] === userId) {
      delete roomsRoles[codeBlockId];
      delete codeBlocks[codeBlockId];
      delete codeBlockSolutions[codeBlockId];
      io.to(codeBlockId).emit("mentor_left");
    }

    Object.entries(socketRoles).forEach(([sid, info]) => {
      if (info.userId === userId && info.codeBlockId === codeBlockId) {
        delete socketRoles[sid];
      }
    });

    updateStudentCount(codeBlockId);
    broadcastUsersInRoom(codeBlockId);
  });

  socket.on("disconnect", () => {
    const codeBlockId = socket.codeBlockId;
    const userId = socket.userId;

    console.log(`Disconnected: ${socket.id} (${userId})`);

    // נוודא שהמנטור באמת מחובר לחדר הזה
    if (codeBlockId && userId && roomsRoles[codeBlockId] === userId) {
      console.log("Mentor left – clearing room:", codeBlockId);
      delete roomsRoles[codeBlockId];
      delete codeBlocks[codeBlockId];
      delete codeBlockSolutions[codeBlockId];
      io.to(codeBlockId).emit("mentor_left");
    }

    if (socketRoles[socket.id]) {
      delete socketRoles[socket.id];
      updateStudentCount(codeBlockId);
      broadcastUsersInRoom(codeBlockId);
    }
  });
});

export { io, app, server };
