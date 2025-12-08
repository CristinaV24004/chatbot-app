import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chatsPath = path.join(__dirname, "data/conversations");

export function loadChat(id) {
    const chatPath = path.join(chatsPath, `${id}.json`);
    if (!fs.existsSync(chatPath)) return [];
    try {
        const raw = fs.readFileSync(chatPath, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('[ERROR] loadChat failed for', id, err);
        return [];
    }
}

export function appendChat(chatFilePath, messageObj) {
    // load current array, append, and write back atomically
    try {
        let arr = [];
        if (fs.existsSync(chatFilePath)) {
            const raw = fs.readFileSync(chatFilePath, 'utf-8');
            arr = raw ? JSON.parse(raw) : [];
        } else {
            // ensure directory exists
            const dir = path.dirname(chatFilePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        }

        arr.push(messageObj);
        fs.writeFileSync(chatFilePath, JSON.stringify(arr, null, 2));
    } catch (err) {
        console.error('[ERROR] appendChat failed for', chatFilePath, err);
    }
}

export function listChats() {
    if (!fs.existsSync(chatsPath)) return [];
    try {
        const files = fs.readdirSync(chatsPath).filter(f => f.endsWith('.json'));
        return files.map(f => path.basename(f, '.json'));
    } catch (err) {
        console.error('[ERROR] listChats failed', err);
        return [];
    }
}

export function generateChatID() {
    return Date.now();
}

export function getChatFullPath(id) {
    let chatPath = chatsPath + "/" + id + ".json"
    // ensure directory exists
    if (!fs.existsSync(chatsPath)) fs.mkdirSync(chatsPath, { recursive: true });

    // create file with empty array if missing
    if (!fs.existsSync(chatPath)) {
        fs.writeFileSync(chatPath, JSON.stringify([], null, 2));
    }
    return chatPath;
}