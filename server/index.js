import express from "express";
import cors from "cors";

import generateReply from "./chat.js";
import { appendChat, generateChatID, getChatFullPath, listChats, loadChat } from "./chatSaveLoad.js";

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
    res.json("SERVER UP!");
});

app.post("/api/chat/:id", (res, req) => {
    fullConversation = loadChat(req.params.id);
})

// Getting chats logic
app.post("/api/chats", (req, res) => {
    console.log("Running!");
    const files = listChats();
    console.log(files);
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
    console.log(`Server is up and runnin' on port ${port}`);
});
