// Import fetch for HTTP requests and dotenv to load environment variables
import fetch from "node-fetch";
import 'dotenv/config';

// ------------------------
// Model configuration
// ------------------------

// HuggingFace Inference API model name
// Uses env variable HF_MODEL, defaults to Mistral-7B if not set
const MODEL_NAME = process.env.HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai";

// HuggingFace API URL for chat completions
const HF_URL = "https://router.huggingface.co/v1/chat/completions";

// API token stored in environment variable
const HF_TOKEN = process.env.HF_API_KEY;

// Limit for AI-generated tokens (prevents extremely long responses)
const max_tokens = 500;

// System prompt to instruct the AI on persona and behavior
const SYSTEM_PROMPT = `
You are Leonardo da Vinci.
Speak with clarity, curiosity, and poetic precision, as if recording thoughts in your notebook.
Use metaphors from nature, anatomy, geometry, and engineering.
Avoid modern slang, but allow natural conversation.
You must not speak of concepts that are ahead of your time (you died in 1519). If user does ask anything about it, apologise and let them know you are not familiar with it.
Keep your responses short (50-100 words)
When you explain ideas, relate them to motion, observation, proportion, and the laws of nature.
Be warm, thoughtful, and reflective.

Maintain conversational continuity:
- Remember the user's previous statement within this chat history.
- Refer back to what they said earlier.
- Ask thoughtful follow-up questions when appropriate.
- Keep the dialogue fluid, as if speaking with a friend in your workshop.

Avoid breaking character.
`;

/**
 * Sends a conversation to the HuggingFace API and returns Leonardo's response
 * @param {Array} conversationHistory - Array of previous messages in format { role: "user"|"assistant", content: "..." }
 * @param {string} userPrompt - The latest user message
 * @returns {string} - AI response
 */
async function getAIResponse(conversationHistory, userPrompt) {
    // Build messages array in the API's expected format
    const messages = [
        { role: "system", content: SYSTEM_PROMPT }, // persona + instructions
        ...conversationHistory,                     // previous messages for context
        { role: "user", content: userPrompt }       // latest user input
    ];

    // Request payload for the HuggingFace inference API
    const data = {
        messages: messages,
        model: MODEL_NAME,
        max_tokens: max_tokens,
        temperature: 0.7,   // randomness of AI replies
        top_p: 0.9           // nucleus sampling
    };

    // Send request to HuggingFace
    const response = await fetch(HF_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    // Check for HTTP errors
    if (!response.ok) {
        const text = await response.text();
        console.error("[ERROR]: ", text);
        throw new Error("HF model error"); // propagate error
    }

    const result = await response.json();

    // HuggingFace chat completions return:
    // { choices: [{ message: { content: "..." } }] }
    if (result?.choices?.[0]?.message?.content) {
        return result.choices[0].message.content; // return AI reply
    }

    // If unexpected format, log and return raw response as string
    console.error("[WARNING] Unexpected response format:", result);
    return typeof result === "string" ? result : JSON.stringify(result);
}

// Export function for use elsewhere
export default getAIResponse;
