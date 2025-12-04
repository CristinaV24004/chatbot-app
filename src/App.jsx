import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Chat from "./pages/Chat.jsx";
import History from "./pages/MessageHistory.jsx";
import About from "./pages/About.jsx";
import ChatHeader from "./components/chat/ChatHeader.jsx";

import { generateLocalReply } from "./services/leonardoLocal.js";
import "./App.css";

import background from "./assets/background.mp4"

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

      <video autoPlay muted loop playsInline preload="auto" id="myVideo">
        <source src={background} type="video/mp4" />
      </video>

      <main className="chat-shell" aria-label="Leonardo da Vinci chatbot">
        <ChatHeader />
        <Routes>
          <Route
            path="/"
            element={
              <Chat
                messages={messages}
                isLoading={isLoading}
                handleSendMessage={handleSendMessage}
              />
            }
          />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
