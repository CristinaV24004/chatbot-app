import fs from "fs";

export function saveConversation(filePath, conversation) {
    fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));
}

export function loadConversation(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
