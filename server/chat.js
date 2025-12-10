import { response } from "express";
import classifyIntent, { intents } from "./classifier.js";
import getAIResponse from "./services/apiClient.js";
import validateResponse from "./services/responseValidator.js";
import superlog from "./beautifulLogs.js";

const fallbackReply = `
I am terribly sorry, I cannot provide an answer to your question.
`

const PRECISION_THRESHOLD = 0.65;
let replyObj = null;

export default async function generateReply(message, chatSlice) {
    let response = null;
    response = await generateLocalReply(message);

    if (!response) {
        response = await generateAIReply(message, chatSlice);
    }

    const validationResult = validateResponse(response);
    console.log("Response validation returned: ", validationResult ? "response" : validationResult);

    response = validationResult ? response : null;

    if (!response) {
        response = fallbackReply;
    }

    replyObj = ({
        id: Date.now(),
        sender: "assistant",
        text: response,
        timestamp: new Date().toLocaleTimeString(),
    });

    return replyObj;

}

export async function generateLocalReply(message) {
    const { intent, score } = await classifyIntent(message);
    let response = null;

    // TWEAK THIS FOR MORE/LESS PRECISE CLASSIFICATION PRECISION
    if (intent && score >= PRECISION_THRESHOLD) {
        superlog("OUTCOME", `Local classifier passed the threshold ${score}>${PRECISION_THRESHOLD}`);
        const topic = intents.topics.find(t => t.id === intent);
        response = topic?.reply;    
    }
    
    return response;
}

export async function generateAIReply(message, conversationSlice) {
    try {
        conversationSlice = conversationSlice.map(msg => ({
            role: msg.sender,
            content: msg.text
        }));

        const aiResponse = await getAIResponse(conversationSlice, message);
        console.log("[OK] Got response");
        
        return aiResponse;

    } catch (err) {
        console.error("[ERROR] Calling HF API did not go well:", err);
        return null;
    }
}