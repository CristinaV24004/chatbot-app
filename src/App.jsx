import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Chat from "./pages/Chat.jsx";
import History from "./pages/MessageHistory.jsx";
import About from "./pages/About.jsx";
import TopNav from "./components/layout/TopBar.jsx";

import background from "./assets/background.mp4";

// Local dev API endpoint (backend)
const API_URL = "http://localhost:5000/api/chat";
const MESSAGE_SEND_DELAY = 600; // ms delay before sending to bot
const TIMESTAMP_OFFSET = 1; // unique ID offset for bot messages

const INITIAL_GREETING = {
  id: 1,
  sender: "assistant",
  text: "Greetings. I am Leonardo da Vinci, engineer and student of nature's mechanisms. Describe your problem or idea, and we will examine how it might work.",
  timestamp: new Date().toLocaleTimeString(),
};

const ERROR_MESSAGES = {
  network: "It seems our connection is disrupted, like a broken gear. Try your question once more.",
  noResponse: "The device that conveys our messages seems to have ceased its motion. I receive no response.",
};

// Create a message object with a unique ID (offset used to avoid clashes between user/bot IDs)
const createMessage = (text, sender, timestamp = new Date().toLocaleTimeString()) => ({
  id: Date.now() + (sender === "assistant" ? TIMESTAMP_OFFSET : 0),
  sender,
  text,
  timestamp,
});

function App() {
  const [messages, setMessages] = useState([INITIAL_GREETING]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatID, setChatID] = useState(null);
  const [accessibilityMode, setAccessibilityMode] = useState(() => {
    return localStorage.getItem("accessibilityMode") === "true";
  });
  const [isFading, setIsFading] = useState(false);

  // Toggle accessibility mode and persist to localStorage
  const toggleAccessibility = () => {
    const newMode = !accessibilityMode;
    setAccessibilityMode(newMode);
    localStorage.setItem("accessibilityMode", newMode);
    
    if (newMode) {
      document.documentElement.classList.add("accessibility-mode");
    } else {
      document.documentElement.classList.remove("accessibility-mode");
    }
  };

  // Apply accessibility mode on component mount
  useEffect(() => {
    if (accessibilityMode) {
      document.documentElement.classList.add("accessibility-mode");
    }
  }, []);

  const handleNewChat = () => {
    // Fade out effect
    setIsFading(true);
    
    // Wait for fade out, then update messages and fade back in
    setTimeout(() => {
      setMessages([INITIAL_GREETING]);
      setChatID(null);
      setIsFading(false);
    }, 300);
  };

  const handleSendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Add user message immediately
    const userMessage = createMessage(trimmed, "user");
    setMessages((prev) => [...prev, userMessage]);
    setIsBotTyping(true);

    // Delay bot response slightly for UX
    setTimeout(() => sendMessageToBot(userMessage), MESSAGE_SEND_DELAY);
  };

  // Send user message to backend and append assistant reply
  const sendMessageToBot = async (userMessage) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          chatID,
        }),
      });

      const data = await res.json();
      const replyText = data?.reply?.text || ERROR_MESSAGES.noResponse;

      // Store new chat ID if this is first message
      if (!chatID && data.chatID) {
        setChatID(data.chatID);
      }

      const botMessage = createMessage(replyText, "assistant");
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error fetching bot reply:", err);
      const errorMessage = createMessage(ERROR_MESSAGES.network, "assistant");
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="app">
      <TopNav onNewChat={handleNewChat} onToggleAccessibility={toggleAccessibility} />
      <video autoPlay muted loop playsInline preload="auto" id="myVideo">
        <source src={background} type="video/mp4" />
      </video>

      <div className="stack-layer stack-layer-1"></div>
      <div className="stack-layer stack-layer-2"></div>
      
      <main className="chat-shell" aria-label="Leonardo da Vinci chatbot" style={{ opacity: isFading ? 0 : 1, transition: "opacity 0.3s ease" }}>
        <Routes>
          <Route
            path="/"
            element={
              <Chat
                messages={messages}
                isLoading={isBotTyping}
                isBotTyping={isBotTyping}
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
