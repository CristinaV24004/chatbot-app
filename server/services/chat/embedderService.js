// Import pipeline from Xenova Transformers library
import { pipeline } from '@xenova/transformers';

// Singleton variable to hold the embedder instance
let embedder;

/**
 * Initialize and return the embedder pipeline.
 * Ensures only one instance is created (singleton pattern).
 */
async function getEmbedder() {
    if (!embedder) {
        // Load a pre-trained feature extraction model
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    return embedder;
}

/**
 * Generate embedding vector for a given text.
 * @param {string} text - Input text to embed
 * @returns {Array<number>} - Embedding vector
 */
export default async function embed(text) {
    const extractor = await getEmbedder(); // Get initialized embedder
    const output = await extractor(text, { pooling: "mean", normalize: true }); 
    // pooling: "mean" => average token embeddings to get single vector
    // normalize: true => vector is normalized (unit length)
    
    return output.data; // Return the numeric embedding array
}
