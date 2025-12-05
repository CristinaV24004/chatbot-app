import fs from "fs";

function saveConversation(filePath, conversation) {
    fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));
}

function loadConversation(filepath) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}