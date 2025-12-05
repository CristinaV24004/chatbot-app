import express from "express";
import cors from "cors";
import classifyIntent, { intents } from "./classifier.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("SERVER UP!");
});

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;

    await console.log("Request has been received! Looking for the best match...")
    const {intent, score} = await classifyIntent(userMessage);
    await console.log(`INTENT: ${intent}, SCORE: ${score}`);
    
    // TWEAK THIS FOR MORE/LESS PRECISE CLASSIFICATION PRECISION
    const threshold = 0.55;
    
    if (intent && score >= threshold) {
        const topic = intents.topics.find(t => t.id === intent);
        const response = topic?.reply;
        if (response) return res.json({ reply: response });
    }

    return res.json({ reply: "Oopsies... Something went completely wrong!" });
})

app.listen(port, () => {
    console.log(`Server is up and runnin' on port ${port}`);
});