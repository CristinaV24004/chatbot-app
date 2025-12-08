import fetch from "node-fetch";
import 'dotenv/config';

// Official HF inference API format
const MODEL_NAME = process.env.HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai";
const HF_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TOKEN = process.env.HF_API_KEY;

const max_tokens = 300;

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

async function getAIResponse(conversationHistory, userPrompt) {
    // Build messages array in official format
    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: "user", content: userPrompt }
    ];

    const data = {
        messages: messages,
        model: MODEL_NAME,
        max_tokens: max_tokens,
        temperature: 0.5,
        top_p: 0.9
    };

    const response = await fetch(HF_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("[ERROR]: ", text);
        throw new Error("HF model error");
    }

    const result = await response.json();

    // Official format returns { choices: [{ message: { content: "..." } }] }
    if (result?.choices?.[0]?.message?.content) {
        return result.choices[0].message.content;
    }

    console.error("[WARNING] Unexpected response format:", result);
    return typeof result === "string" ? result : JSON.stringify(result);
}

export default getAIResponse;
