import generateReply from "../services/chat/chatService.js";
import {
    appendChat,
    generateChatID,
    getChatFullPath,
    listChats,
    loadChat,
} from "../services/chat/chatStorage.js";

// How many last messages get passed into the AI request
const contextWindowMessages = 4;

export async function listAllChats(req, res) {
    try {
        const files = listChats();
        return res.json(files);
    } catch (err) {
        console.error("[ERROR] listAllChats", err);
        return res.status(500).json({ error: "failed to list chats" });
    }
}

export async function getChatById(req, res) {
    try {
        const chatId = req.params.id;
        if (!chatId) return res.status(400).json({ error: "missing chat id" });
        const chat = loadChat(chatId) || [];
        return res.json(chat);
    } catch (err) {
        console.error("[ERROR] getChatById", err);
        return res.status(500).json({ error: "failed to load chat" });
    }
}

export async function createChatMessage(req, res) {
    let fullConverstaion = [];
    const userMessageObj = req.body.message;
    const userMessageText = userMessageObj.text;
    let chatID = req.body.chatID;
    console.log(chatID);
    let chatPath = null;

    if (chatID) {
        chatPath = getChatFullPath(chatID);
        fullConverstaion = loadChat(chatID);
    }

    fullConverstaion.push(userMessageObj);
    
    const recentContext = fullConverstaion.slice(-contextWindowMessages);
    const responseObj = await generateReply(userMessageText, recentContext);
    fullConverstaion.push(responseObj);

    if (!chatID) {
        chatID = generateChatID();
        chatPath = getChatFullPath(chatID);
    }

    appendChat(chatPath, userMessageObj);
    appendChat(chatPath, responseObj);

    return res.json({
        reply: responseObj,
        chatID
    });
}