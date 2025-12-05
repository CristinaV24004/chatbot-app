import express from "express";
import cors from "cors";
import classifyIntent, { intents } from "./classifier.js";
import getAIResponse from "../services/apiClient.js";

const app = express();
const port = 5000;

// How many last messages get passed into the AI request (for smoother converssation flow)
const messageCount = 4;

let fullConversation = [];

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("SERVER UP!");
});

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;

    fullConversation.push({
        id: Date.now(),
        role: "user",
        content: userMessage
    });

    console.log("Request has been received! Looking for the best match...")
    const { intent, score } = await classifyIntent(userMessage);
    console.log(`INTENT: ${intent}, SCORE: ${score}`);

    // TWEAK THIS FOR MORE/LESS PRECISE CLASSIFICATION PRECISION
    const threshold = 0.65;

    if (intent && score >= threshold) {
        const topic = intents.topics.find(t => t.id === intent);
        const response = topic?.reply;

        if (response) {
            fullConversation.push({
                id: Date.now(),
                role: "assistant",
                content: response
            });
            return res.json({ reply: response });
        }
    }

    console.log("Local classifier did not pass the threshold... Time to abuse AI!");
    console.log("Sending request");

    // Fallback to AI response
    try {
        let conversationSlice = fullConversation.slice(-messageCount);

        conversationSlice = conversationSlice.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const aiResponse = await getAIResponse(conversationSlice, userMessage);
        console.log("[OK] Got response");
        fullConversation.push({
            id: Date.now(),
            role: "assistant",
            content: aiResponse
        });
        return res.json({ reply: aiResponse });
    } catch (err) {
        console.error("[ERROR] Calling AI API did not go well:", err);
        return res.json({ reply: "Oopsies... Something went completely wrong!" });
    }
})

app.listen(port, () => {
    console.log(`Server is up and runnin' on port ${port}`);
});