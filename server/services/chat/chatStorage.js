// Node.js modules for file system and path handling
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname and __filename setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory where chat JSON files are stored
const chatsPath = path.join(__dirname, "../../data/conversations");

/**
 * Load a chat from storage by ID
 * @param {string|number} id - Chat ID
 * @returns {Array} - Array of messages, empty if chat does not exist or fails to load
 */
export function loadChat(id) {
    const chatPath = path.join(chatsPath, `${id}.json`);
    
    if (!fs.existsSync(chatPath)) return []; // Return empty array if file doesn't exist

    try {
        const raw = fs.readFileSync(chatPath, 'utf-8'); // read file
        return JSON.parse(raw); // parse JSON into array of messages
    } catch (err) {
        console.error('[ERROR] loadChat failed for', id, err);
        return []; // fallback to empty array if parsing fails
    }
}

/**
 * Append a message to a chat file
 * @param {string} chatFilePath - Full path to chat JSON file
 * @param {Object} messageObj - Message object to append
 */
export function appendChat(chatFilePath, messageObj) {
    try {
        let arr = [];
        
        if (fs.existsSync(chatFilePath)) {
            const raw = fs.readFileSync(chatFilePath, 'utf-8');
            arr = raw ? JSON.parse(raw) : [];
        } else {
            // Ensure directory exists if file is missing
            const dir = path.dirname(chatFilePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        }

        arr.push(messageObj); // add new message
        fs.writeFileSync(chatFilePath, JSON.stringify(arr, null, 2)); // write back atomically
    } catch (err) {
        console.error('[ERROR] appendChat failed for', chatFilePath, err);
    }
}

/**
 * List all saved chat IDs
 * @returns {Array<string>} - Array of chat IDs (filenames without extension)
 */
export function listChats() {
    try {
        const files = fs.readdirSync(chatsPath).filter(f => f.endsWith('.json'));
        return files.map(f => path.basename(f, '.json'));
    } catch (err) {
        console.error('[ERROR] listChats failed', err);
        return [];
    }
}

/**
 * Generate a new unique chat ID
 * @returns {number} - Chat ID (timestamp)
 */
export function generateChatID() {
    return Date.now(); // simple timestamp-based ID
}

/**
 * Get full path for a chat file and ensure it exists
 * @param {string|number} id - Chat ID
 * @returns {string} - Full file path
 */
export function getChatFullPath(id) {
    const chatPath = path.join(chatsPath, `${id}.json`);

    // Ensure directory exists
    if (!fs.existsSync(chatsPath)) fs.mkdirSync(chatsPath, { recursive: true });

    // If file doesn't exist, create empty chat file
    if (!fs.existsSync(chatPath)) {
        fs.writeFileSync(chatPath, JSON.stringify([], null, 2));
    }

    return chatPath;
}
