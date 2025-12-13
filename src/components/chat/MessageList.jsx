import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

function MessageList({ messages, isLoading, isBotTyping }) {

  const endRef = useRef(null);

// Automatically scroll to the latest message or typing indicator  
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isBotTyping]);

  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          sender={msg.sender}
          text={msg.text}
          timestamp={msg.timestamp}
        />
      ))}

    {/* Show a temporary typing indicator while the bot is generating a response */}
      {isBotTyping && (
        <div className="message-row message-row-bot">
          <div className="bot-message typing-text">
            Leonardo is examining the mechanics of your question…
          </div>
        </div>
      )}

       <div ref={endRef} />
       
    </div>
  );
}

export default MessageList;