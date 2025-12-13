import { useState, useEffect, useRef } from "react";

// Automatically return focus to the input when it becomes enabled
function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

// Handles message submission and prevents empty messages  
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form className="chat-input-bar" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="chat-input">
        Type your message to Leonardo da Vinci
      </label>
      <input
        id="chat-input"
        type="text"
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask Leonardo about art, science, invention, or anatomy..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !text.trim()}>
        Send
      </button>
    </form>
  );
}

export default ChatInput;
