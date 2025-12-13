function MessageBubble({ sender, text, timestamp }) {
// Determine message layout and styling based on sender  
  const isUser = sender === "user";

  return (
    <div
      className={`message-row ${isUser ? "message-row-user" : "message-row-bot"}`}
    >
      <div className={isUser ? "user-message" : "bot-message"}>
        <p className="message-text">{text}</p>
        <span className="message-meta">
          {isUser ? "You" : "Leonardo"} • {timestamp}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;