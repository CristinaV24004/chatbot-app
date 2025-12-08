import classifyIntent, { intents } from "./classifier.js";
import getAIResponse from "./services/apiClient.js";


const fallbackReply = `
I am terribly sorry, I cannot provide an answer to your question.
`

const PRECISION_THRESHOLD = 0.65;
let reply = null;

export default async function generateReply(message, chatSlice) {
    
    reply = null;
    reply = await generateLocalReply(message);

    if (!reply) {
        reply = await generateAIReply(message, chatSlice);
    }

    if (!reply) {
        return fallbackReply;
    }

    return reply;

}

export async function generateLocalReply(message) {
    const { intent, score } = await classifyIntent(message);
    
    // TWEAK THIS FOR MORE/LESS PRECISE CLASSIFICATION PRECISION
    
    if (intent && score >= PRECISION_THRESHOLD) {
        console.log(`Local classifier passed the threshold ${score}>${PRECISION_THRESHOLD}`);
        const topic = intents.topics.find(t => t.id === intent);
        const response = topic?.reply;

        if (response) {
            reply = {
                id: Date.now(),
                sender: "assistant",
                text: response,
                timestamp: new Date().toLocaleTimeString(),
            };
            return reply;
        }
    }
    
    return null;
}

export async function generateAIReply(message, conversationSlice) {
    try {

        conversationSlice = conversationSlice.map(msg => ({
            role: msg.sender,
            content: msg.text
        }));

        const aiResponse = await getAIResponse(conversationSlice, message);
        console.log("[OK] Got response");
        reply = ({
            id: Date.now(),
            sender: "assistant",
            text: aiResponse,
            timestamp: new Date().toLocaleTimeString(),
        });

        return reply;
    } catch (err) {
        console.error("[ERROR] Calling HF API did not go well:", err);
        return null;
    }
}