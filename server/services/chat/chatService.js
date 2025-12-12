// Import local intent classifier and predefined intents
import classifyIntent, { intents } from "./classifierService.js";

// Import function to get AI response (HuggingFace / OpenAI)
import getAIResponse from "../api/apiClient.js";

// Import validation function to filter inappropriate/unexpected AI responses
import validateResponse from "../validation/responseValidator.js";

// Custom logger utility
import superlog from "../../utils/beautifulLogs.js";
import { getRandomValues } from "crypto";

// Fallback reply when no suitable response is found
const fallbackReply = `
I am terribly sorry, I cannot provide an answer to your question.
`;

// Minimum confidence score required for local intent classifier
const PRECISION_THRESHOLD = 0.65;

// Holds the final reply object
let replyObj = null;

/**
 * Main function to generate a reply to a user's message
 * Tries local intent classifier first, then AI if needed
 * Validates the response before returning
 * @param {string} message - User's message
 * @param {Array} chatSlice - Recent conversation messages for context
 * @returns {Object} - Reply object { id, sender, text, timestamp }
 */
export default async function generateReply(message, chatSlice) {
    let response = null;

    // First, try generating a reply using local rules / intent classifier
    response = await generateLocalReply(message);

    // If no valid local reply, fall back to AI
    if (!response) {
        response = await generateAIReply(message, chatSlice);
    }

    // Validate the response (check for forbidden words, extreme length)
    const validationResult = validateResponse(response);
    console.log("Response validation returned: ", validationResult ? "response" : validationResult);

    // Nullify response if it fails validation
    response = validationResult ? response : null;

    // If still no response, use fallback
    if (!response) {
        response = fallbackReply;
    }

    // Build standardized reply object
    replyObj = {
        id: Date.now(),          // unique id for this message
        sender: "assistant",     // sender label
        text: response,          // the actual reply text
        timestamp: new Date().toLocaleTimeString(), // readable timestamp
    };

    return replyObj;
}

/**
 * Attempts to generate a reply using local intent classification
 * @param {string} message - User message
 * @returns {string|null} - Reply string if matched, otherwise null
 */
export async function generateLocalReply(message) {
    const { intent, score } = await classifyIntent(message); // Predict intent & confidence
    let response = null;

    // Only use local reply if confidence exceeds threshold
    if (intent && score >= PRECISION_THRESHOLD) {
        superlog("OUTCOME", `Local classifier passed the threshold ${score}>${PRECISION_THRESHOLD}`);

        // Find matching topic and its predefined reply
        const topic = intents.topics.find(t => t.id === intent);
        response = getRandomReply(topic);    
    }
    
    return response;
}

/**
 * Generates a reply using AI (LLM)
 * @param {string} message - Latest user message
 * @param {Array} conversationSlice - Recent chat history for context
 * @returns {string|null} - AI response text, or null if API fails
 */
export async function generateAIReply(message, conversationSlice) {
    try {
        // Convert local message format to API format: { role, content }
        conversationSlice = conversationSlice.map(msg => ({
            role: msg.sender,
            content: msg.text
        }));

        // Call AI API
        const aiResponse = await getAIResponse(conversationSlice, message);
        console.log("[OK] Got response");
        
        return aiResponse;

    } catch (err) {
        console.error("[ERROR] Calling HF API did not go well:", err);
        return null; // Return null so fallback or validation can handle it
    }
}

// Returns a random reply for the topic
function getRandomReply(topic) {
    const replies = topic.replies;
    return replies[Math.floor(Math.random() * replies.length)];
}