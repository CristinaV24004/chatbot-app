// Node.js modules for file system and path handling
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Custom embedding function (likely returns vector for text)
import embed from "./embedderService.js";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Leonardo scripts JSON, containing topics and example phrases
const dataPath = path.join(__dirname, '..', '..', 'data', 'leonardoScripts.json');
const intents = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Array to cache embeddings of topic examples
const cachedEmbeddings = [];

/**
 * Precompute embeddings for all topic examples to speed up classification.
 * Stores results in `cachedEmbeddings` for later use.
 */
export async function initClassifierCache() {
    for (let topic of intents.topics) {
        let topicEmbeddings = [];

        for (let example of topic.examples) {
            const exampleVec = await embed(example.toLowerCase()); // convert example to vector
            topicEmbeddings.push(exampleVec);
        }

        cachedEmbeddings.push({ "topicID": topic.id, "embeddings": topicEmbeddings });
    }
}

/**
 * Cosine similarity between two vectors
 * @param {Array<number>} a 
 * @param {Array<number>} b 
 * @returns {number} similarity score between -1 and 1
 */
function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Classifies user message into an intent using cosine similarity.
 * @param {string} message - User's input
 * @returns {Object} - { intent: topicID, score: similarity score }
 */
export default async function classifyIntent(message) {
    const messageVec = await embed(message.toLowerCase());

    let bestIntent = null;
    let bestScore = 0;

    for (const topic of intents.topics) {
        if (!topic.examples) continue; // skip if no examples

        for (const example of topic.examples) {
            const exampleVec = await embed(example.toLowerCase()); // compute vector
            const sim = cosineSimilarity(messageVec, exampleVec);

            if (sim > bestScore) {
                bestScore = sim;
                bestIntent = topic.id;
            }
        }
    }

    return { intent: bestIntent, score: bestScore };
}

// Export the intents object for reference elsewhere
export { intents };
