import express from "express";
import cors from "cors";

import superlog from "./beautifulLogs.js";

import generateReply from "./chat.js";
import { appendChat, generateChatID, getChatFullPath, listChats, loadChat } from "./chatSaveLoad.js";
import { initClassifierCache } from "./classifier.js";

let currentChatPath = null;
let currentChatID = null;

const app = express();
const port = 5000;

// How many last messages get passed into the AI request (for smoother converssation flow) 
// more > longer wait times!!!
const contextWindowMessages = 4;

let responseObj = null;
let fullConversation = [];

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    currentChatID = null;
    currentChatPath = null;
    res.json("SERVER UP!");
});

app.post("/api/chat/:id", (req, res) => {
    currentChatID = req.params.id;
    currentChatPath = getChatFullPath(currentChatID);
    fullConversation = loadChat(currentChatID);
    return res.json(fullConversation);
})

// Getting chats logic
app.post("/api/chats", (req, res) => {
    const files = listChats();
    return res.json(files);
});

app.post("/api/chat", async (req, res) => {
    const userMessageObj = req.body.message;
    const userMessageText = req.body.message.text;
    fullConversation.push(req.body.message);

    // Passing 4 last messages from the chat for context
    let responseObj = await generateReply(userMessageText, fullConversation.slice(-contextWindowMessages));
    fullConversation.push(responseObj);

    if (fullConversation.length == 2) {
        currentChatID = generateChatID();
        currentChatPath = getChatFullPath(currentChatID);
    }

    appendChat(currentChatPath, userMessageObj);
    appendChat(currentChatPath, responseObj);

    return res.json(responseObj);
})

app.listen(port, () => {
    superlog("OK", `Server is up and runnin' on port ${port}`);
    superlog("LOAD", "Precaching classification embeddings...");
    initClassifierCache();
    superlog("OK", "Precaching done!");
});
