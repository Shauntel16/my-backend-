import express from "express";
import { createStudentAssistant, getStudentAssistants } from "../controllers/studentAssistantController.js";

const router = express.Router();

router.post("/", createStudentAssistant);
router.get("/", getStudentAssistants);

export default router;
