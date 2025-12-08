import { useEffect, useState } from "react";

const MessageHistory = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadChats() {
      try {
        const res = await fetch("http://localhost:5000/api/chats", {
          method: "POST",
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
    <div className="page">
      <h1>Message History</h1>
      <p>Here you’ll see previous conversations or saved sessions.</p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Error loading chats: {error}</p>
      ) : chats.length === 0 ? (
        <p>No saved conversations yet.</p>
      ) : (
        <ul className="history-list">
          {chats.map((chat, idx) => (
            <button key={idx}>
              {idx ?? chat.summary ?? (chat.text ? chat.text.slice(0, 120) : JSON.stringify(chat))}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessageHistory;