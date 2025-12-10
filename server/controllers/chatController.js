import generateReply from "../chat.js";
import {
  appendChat,
  generateChatID,
  getChatFullPath,
  listChats,
  loadChat,
} from "../chatSaveLoad.js";

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
    const convo = loadChat(chatId) || [];
    return res.json(convo);
  } catch (err) {
    console.error("[ERROR] getChatById", err);
    return res.status(500).json({ error: "failed to load chat" });
  }
}

export async function createChat(req, res) {
  try {
    const id = generateChatID();
    getChatFullPath(id); // ensures file exists
    return res.status(201).json({ chatId: id });
  } catch (err) {
    console.error("[ERROR] createChat", err);
    return res.status(500).json({ error: "failed to create chat" });
  }
}

export async function addMessageToChat(req, res) {
  try {
    const chatId = req.params.id;
    let chatPath;
    let convo = [];

    const messageObj = req.body?.message;
    if (!messageObj || !messageObj.text) {
      return res.status(400).json({ error: "missing message in request body" });
    }

    if (chatId) {
      chatPath = getChatFullPath(chatId);
      convo = loadChat(chatId) || [];
    } else {
      // create new chat if no id provided
      const newId = generateChatID();
      chatPath = getChatFullPath(newId);
      convo = [];
      // send back the generated id later
      req.generatedChatId = newId;
    }

    // append user message locally
    appendChat(chatPath, messageObj);
    convo.push(messageObj);

    // generate reply using recent context
    const replyObj = await generateReply(messageObj.text, convo.slice(-contextWindowMessages));
    appendChat(chatPath, replyObj);

    const responsePayload = { reply: replyObj };
    if (req.generatedChatId) responsePayload.chatId = req.generatedChatId;

    return res.json(responsePayload);
  } catch (err) {
    console.error("[ERROR] addMessageToChat", err);
    return res.status(500).json({ error: "failed to add message" });
  }
}
