import express from "express";
import { getChatById, listAllChats, createChatMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/chat/:id", getChatById);
router.get("/chats", listAllChats);
router.post("/chat", createChatMessage);

export default router;