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
        autoComplete="off"
        type="text"
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask Leonardo about..."
        disabled={disabled}
      />
      <button
        tabIndex={0}
        type="submit" 
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        title="Send your message to Leonardo"
      >
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346273 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99721575 L3.03521743,10.4382088 C3.03521743,10.5953061 3.34915502,10.7524035 3.50612381,10.7524035 L16.6915026,11.5378905 C16.6915026,11.5378905 17.1624089,11.5378905 17.1624089,12.0091827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
        </svg>
        <span className="visually-hidden">Send</span>
      </button>
    </form>
  );
}

export default ChatInput;
