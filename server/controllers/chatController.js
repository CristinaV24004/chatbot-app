// Import service for generating AI replies
import generateReply from "../services/chat/chatService.js";

// Import functions for chat storage (saving/loading chats, listing, generating IDs, etc.)
import {
    appendChat,
    generateChatID,
    getChatFullPath,
    listChats,
    loadChat,
} from "../services/chat/chatStorage.js";

// Number of last messages to pass to AI for context (to maintain conversation flow)
// Higher number = better context, but may increase response time
const contextWindowMessages = 4;

/**
 * List all saved chats
 * GET /api/chats
 */
export async function listAllChats(req, res) {
    try {
        const files = listChats(); // Get an array of saved chat file names
        return res.json(files);    // Return the list to the client
    } catch (err) {
        console.error("[ERROR] listAllChats", err);
        return res.status(500).json({ error: "failed to list chats" });
    }
}

/**
 * Get messages from a specific chat by ID
 * GET /api/chat/:id
 */
export async function getChatById(req, res) {
    try {
        const chatId = req.params.id;        // Extract chat ID from route params
        if (!chatId) return res.status(400).json({ error: "missing chat id" });

        const chat = loadChat(chatId) || []; // Load chat messages from storage; fallback to empty array
        return res.json(chat);
    } catch (err) {
        console.error("[ERROR] getChatById", err);
        return res.status(500).json({ error: "failed to load chat" });
    }
}

/**
 * Handle sending a new message in a chat (and generating AI reply)
 * POST /api/chat
 */
export async function createChatMessage(req, res) {
    let fullConverstaion = [];                   // Holds all messages for this chat
    const userMessageObj = req.body.message;    // Incoming message object
    const userMessageText = userMessageObj.text; // Text content of user's message
    let chatID = req.body.chatID;               // Optional: existing chat ID
    console.log(chatID);                        // Debug: log chat ID
    let chatPath = null;                        

    // If a chatID exists, load previous conversation
    if (chatID) {
        chatPath = getChatFullPath(chatID);   // Get file path for chat storage
        fullConverstaion = loadChat(chatID);  // Load existing messages
    }

    fullConverstaion.push(userMessageObj);     // Add user's message to conversation

    // Take the last few messages for context and send to AI
    const recentContext = fullConverstaion.slice(-contextWindowMessages);
    const responseObj = await generateReply(userMessageText, recentContext); // Generate AI reply
    fullConverstaion.push(responseObj);       // Append AI reply to conversation

    // If this is a new chat, generate a new chat ID and file path
    if (!chatID) {
        chatID = generateChatID();
        chatPath = getChatFullPath(chatID);
    }

    // Save both user message and AI reply to storage
    appendChat(chatPath, userMessageObj);
    appendChat(chatPath, responseObj);

    // Return AI reply and chat ID to client
    return res.json({
        reply: responseObj,
        chatID
    });
};
