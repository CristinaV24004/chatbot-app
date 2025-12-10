import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data', 'forbiddenWords.txt');

const forbiddenWords = fs.readFileSync(dataPath,  "utf-8")
        .split("\n")
        .map(w => w.trim().toLowerCase())
        .filter(Boolean);

// Returns true if response alignes with the set rules; 
// otherwise returns a code
export default function validateResponse(response) {
    const lower = response.toLowerCase();
    
    // Check if the answer is too long
    if (response.split(" ").length > 150) return "Answer too long";

    // Check if response contains word from forbidden
    // words list
    if (forbiddenWords.some(word => lower.includes(word))) return "Answer got forbidden words";

    return true;
}