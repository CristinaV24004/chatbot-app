import { useState } from "react";
import "./App.css";
import ChatHeader from "./components/chat/ChatHeader.jsx";
import MessageList from "./components/chat/MessageList.jsx";
import ChatInput from "./components/chat/ChatInput.jsx";
import { generateLocalReply } from "./services/leonardoLocal.js";

const initialMessages = [
  {
    id: 1,
    sender: "bot",
    text: "Greetings. I am Leonardo da Vinci, engineer and student of nature’s mechanisms. Describe your problem or idea, and we will examine how it might work.",
    timestamp: new Date().toLocaleTimeString(),
  },
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // TEMPORARY: placeholder bot reply
    setTimeout(() => {
      const replyText = generateLocalReply(trimmed);
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="app">
      <main className="chat-shell" aria-label="Leonardo da Vinci chatbot">
        <ChatHeader />
        <section
          className="chat-main"
          aria-live="polite"
          aria-label="Chat messages"
          role="log"
        >
          <MessageList messages={messages} isLoading={isLoading} />
        </section>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </main>
    </div>
  );
}

export default App;