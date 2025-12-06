import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import embed from "./embedder.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data', 'leonardoScripts.json');
const intents = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i=0; i<a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default async function classifyIntent(message) {
    const messageVec = await embed(message.toLowerCase());

    let bestIntent = null;
    let bestScore = 0;

    for (const topic of intents.topics) {
        // make sure topic has examples
        if (!topic.examples) continue;

        for (const example of topic.examples) {
            const exampleVec = await embed(example.toLowerCase());
            const sim = cosineSimilarity(messageVec, exampleVec);
            if (sim > bestScore) {
                bestScore = sim;
                bestIntent = topic.id;
            }
        }
        
    }

    return { intent: bestIntent, score: bestScore };
}

export { intents };
