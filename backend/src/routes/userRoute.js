import express from "express";
import { getStudents } from "../controllers/userController.js";

const router = express.Router();

router.get("/students", getStudents);

export default router;
