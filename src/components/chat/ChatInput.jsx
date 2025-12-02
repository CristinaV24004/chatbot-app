import { useState } from "react";

function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form className="chat-input-bar" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="chat-input">
        Type your message to Leonardo da Vinci
      </label>
      <input
        id="chat-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask Leonardo about art, science, or invention..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled}>
        Send
      </button>
    </form>
  );
}

export default ChatInput;