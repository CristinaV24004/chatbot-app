import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

function MessageList({ messages, isLoading }) {

  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

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

      {isLoading && (
        <div className="message-row message-row-bot">
          <div className="bot-message typing-indicator">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        </div>
      )}

       <div ref={endRef} />
       
    </div>
  );
}

export default MessageList;