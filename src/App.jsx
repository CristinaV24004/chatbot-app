import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Chat from "./pages/Chat.jsx";
import History from "./pages/MessageHistory.jsx";
import About from "./pages/About.jsx";
import ChatHeader from "./components/chat/ChatHeader.jsx";

import "./App.css";

import background from "./assets/background.mp4"

const initialMessages = [
  {
    id: 1,
    sender: "assistant",
    text: "Greetings. I am Leonardo da Vinci, engineer and student of nature’s mechanisms. Describe your problem or idea, and we will examine how it might work.",
    timestamp: new Date().toLocaleTimeString(),
  },
];

function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [serverStatus, setServerStatus] = useState("idle");
  const [chatID, setChatID] = useState(null);

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
    setIsBotTyping(true);
    setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              message: userMessage, 
              chatID: chatID
            }),
        });
        const data = await res.json();
        const replyText = data?.reply?.text || "The device that conveys our messages seems to have ceased its motion. I receive no response.";
        
        if (!chatID && data.chatID) {
          setChatID(data.chatID);
        }

        const botMessage = {
          id: Date.now() + 1,
          sender: "assistant",
          text: replyText,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Error fetching bot reply:", err);
        setServerStatus("error");

        const errorMessage = {
          id: Date.now() + 1,
          sender: "assistant",
          text: "It seems our connection is disrupted, like a broken gear. Try your question once more.",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setIsBotTyping(false);
      }
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
                isBotTyping={isBotTyping}      
                serverStatus={serverStatus} 
                handleSendMessage={handleSendMessage}
              />
            }
          />
          <Route path="/history" element={<History setMessages={setMessages} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;