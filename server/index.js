import express from "express";
import cors from "cors";

import superlog from "./utils/beautifulLogs.js";
import chatRoutes from "./routes/chatRoutes.js";
import { initClassifierCache } from "./services/chat/classifierService.js";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

app.get("/", (req, res) => {
    res.status(200);
});

app.listen(port, () => {
    superlog("OK", `Server is up and runnin' on port ${port}`);
    superlog("LOAD", "Precaching classification embeddings...");
    initClassifierCache();
    superlog("OK", "Precaching done!");
});
