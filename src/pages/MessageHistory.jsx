import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MessageHistory = ({ setMessages }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handler for loading a saved chat
  const handleChatLoad = (chatId) => async () => {
    if (!chatId || !setMessages) return;

    try {
      const res = await fetch(`http://localhost:5000/api/chat/${chatId}`,
        {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
          }
        }
      );
      if (!res.ok) {
        console.error(`[ERROR] Failed to load chat ${chatId}:`, res.status);
        return;
      }

      const chatMessages = await res.json();
      console.log(`[OK] Loaded chat ${chatId}:`, chatMessages);
      // Update parent App's messages state
      setMessages(chatMessages);
      // navigate back to the chat page
      navigate("/", { replace: true });
    } catch (err) {
      console.error(`[ERROR] Failed to load chat ${chatId}:`, err);
    }
  };

  // Fetch saved chat IDs on mount and handle different response shapes safely  
  useEffect(() => {
    let mounted = true;

    async function loadChats() {
      try {
        const res = await fetch("http://localhost:5000/api/chats", {
          method: "GET",
          headers: { "Content-Type": "application/json" }
      });

        const data = await res.json().catch(() => null);

        if (!mounted) return;

        // Server may return { chats: [...] } or an array directly.
        if (!data) {
          setChats([]);
        } else if (Array.isArray(data)) {
          setChats(data);
        } else if (Array.isArray(data.chats)) {
          setChats(data.chats);
        } else {
          // fallback: attempt to interpret the response
          setChats([]);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || String(err));
        setChats([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadChats();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page message-history-page">
      <h1>Message History</h1>
      <p>Start a chat, and your past questions will appear here like pages in a sketchbook.</p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Error loading chats: {error}</p>
      ) : chats.length === 0 ? (
        <p>No saved conversations yet.</p>
      ) : (
        <ul className="history-list">
          {chats.map((chatId, idx) => (
            <button 
              key={chatId} 
              onClick={handleChatLoad(chatId)}
              aria-label={`Load chat ${idx + 1}`}
              title={`Load conversation ${idx + 1} (ID: ${chatId})`}
            >
              Chat: {idx + 1}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageHistory;