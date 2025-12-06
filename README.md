# Leonardo da Vinci Chatbot App

An interactive chatbot application powered by Leonardo da Vinci's wisdom on art, mechanics, nature, and invention. The app uses semantic similarity matching with embeddings to classify user intents and provide contextually relevant responses inspired by Leonardo's observations and teachings.

## Features

- **Intent Classification**: Uses transformer-based embeddings to understand user messages and match them to predefined topics (art, anatomy, mechanics, structures, water, invention, nature, learning, etc.)
- **Multi-Topic Support**: Covers topics ranging from artistic techniques to mechanical principles, building structures, and natural observation
- **Real-time Chat Interface**: Built with React for a responsive, interactive user experience
- **Server-Client Architecture**: Express backend handles intent classification and reply selection; React frontend manages chat UI
- **Adaptive Responses**: Returns scripted replies that adapt to user queries with configurable classification threshold

## Prerequisites

- **Node.js** v16+ (with ES modules support)
- **npm** package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CristinaV24004/chatbot-app.git
   cd chatbot-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Create **.env** file with HF_API_KEY=YOUR_API_KEY

### Development Mode

Run both the frontend dev server and backend simultaneously:

**Terminal 1 - Frontend (Vite dev server):**
```bash
npm run dev
```
The React app will start on `http://localhost:5173` (or the next available port).

**Terminal 2 - Backend (Express server):**
```bash
npm start
```
The API server will start on `http://localhost:5000`.

## How It Works

### Intent Classification Pipeline

1. **User Input**: User sends a message via the chat interface
2. **Embedding Generation**: The message is converted to a numerical embedding using transformer models from `@xenova/transformers`
3. **Similarity Matching**: Each example in the topic definitions is embedded and compared to the user message using cosine similarity
4. **Intent Selection**: The topic with the highest similarity score is selected (if it meets the threshold)
5. **Reply Generation**: The corresponding topic's reply is returned to the user
6. **Fallback**: If no intent matches above the threshold, a generic fallback response is returned

### API Endpoints

#### `GET /`
Health check endpoint. Returns `"SERVER UP!"`.

#### `POST /api/chat`
Classifies user intent and returns a contextual reply.

**Request:**
```json
{
  "message": "How do I get better at drawing?"
}
```

**Response:**
```json
{
  "reply": "Art begins with observing light and form. Start by deciding what should draw the eye first, then build your composition around that point..."
}
```

## Configuration

### Classification Threshold
Adjust the confidence threshold for intent classification in `server/index.js`:
```javascript
const threshold = 0.55;  // Range: 0 to 1 (higher = stricter matching)
```

### Topics
Add or modify topics in `src/data/leonardoScripts.json`. Each topic should include:
```json
{
  "id": "topic_id",
  "description": "Topic description",
  "keywords": ["keyword1", "keyword2"],
  "examples": ["Example sentence 1", "Example sentence 2"],
  "reply": "The response to provide"
}
```

## Author

Created by 2nd year Software Engineering students at Bournemouth University

---

**Inspired by Leonardo da Vinci's notebooks and teachings on art, science, and mechanical innovation.**
