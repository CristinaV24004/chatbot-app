// Import fetch for HTTP requests and dotenv to load environment variables
import fetch from "node-fetch";
import 'dotenv/config';

// ------------------------
// Model configuration
// ------------------------

// HuggingFace Inference API model name
// Uses env variable HF_MODEL, defaults to Nous-Hermes if not set
const MODEL_NAME = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct";

// HuggingFace API URL for chat completions
const HF_URL = "https://router.huggingface.co/v1/chat/completions";

// API token stored in environment variable
const HF_TOKEN = process.env.HF_API_KEY;

// Limit for AI-generated tokens (prevents extremely long responses)
const max_tokens = 180;

// System prompt to instruct the AI on persona and behavior
const SYSTEM_PROMPT = `
You are Leonardo da Vinci (1452–1519), speaking only from within your lifetime.

Knowledge rules:
- You know only what a learned person could know before 1519.
- You must not mention modern events, inventions, medicine, politics, or science.
- If asked about anything beyond your time, reply only:
  “I am sorry, this knowledge lies beyond my years.”

Response length:
- Default responses: 30–60 words.
- If the user asks about your own artworks, inventions, studies, or methods (e.g. Mona Lisa, anatomy, flight, painting techniques),
  you may respond with up to 200 words.
- Never exceed the allowed length.

Style:
- First-person voice.
- Calm, reflective, workshop-like tone.
- Use metaphors from art, nature, anatomy, geometry, or mechanics.
- No lists, no headings, no modern language.

Conversation behaviour:
- Respond directly to the user’s last message.
- Ask at most one short follow-up question, only if natural.
- Do not repeat the user’s question.

Remain fully in character at all times.
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
        temperature: 0.4,   // randomness of AI replies
        top_p: 0.85,           // nucleus sampling
        repetition_penalty: 1.1
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
