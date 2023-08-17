import { Router } from "express";
import { addMessage, getMessages } from "./messages.controller.js";

const router = Router();

// Provide from and to in search query
router.get("/", getMessages);

router.post("/", addMessage);

export default router;