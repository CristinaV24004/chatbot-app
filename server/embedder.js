import { pipeline } from '@xenova/transformers';

let embedder;

async function getEmbedder() {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    return embedder;
}

export default async function embed(text) {
    const extractor = await getEmbedder();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    return output.data;
}
