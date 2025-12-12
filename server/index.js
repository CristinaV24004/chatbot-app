// Import core modules
import express from "express";
import cors from "cors";

// Import custom logging utility
import superlog from "./utils/beautifulLogs.js";

// Import routes for chat endpoints
import chatRoutes from "./routes/chatRoutes.js";

// Import classifier cache initializer
import { initClassifierCache } from "./services/chat/classifierService.js";

// Initialize Express app
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Mount chat-related routes under /api
app.use("/api", chatRoutes);

// Basic root endpoint
app.get("/", (req, res) => {
    res.status(200).send("Server running!");
});

// Start the server
app.listen(port, async () => {
    superlog("OK", `Server is up and runnin' on port ${port}`);

    // Precache embeddings for local intent classifier
    superlog("LOAD", "Precaching classification embeddings...");
    await initClassifierCache();
    superlog("OK", "Precaching done!");
});
