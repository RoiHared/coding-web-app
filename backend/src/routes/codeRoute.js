import express from "express";
import {
  getCodeblockById,
  getCodeblocks,
} from "../controllers/codeController.js";

const router = express.Router();

router.get("/", getCodeblocks);
router.get("/:roomId", getCodeblockById);
export default router;
