import React from "react";

const MessageHistory = () => {
  return (
    <div className="page">
      <h1>Message History</h1>
      <p>Here you’ll see previous conversations or saved sessions.</p>

      {/* Later you'll map real history data here */}
      <ul className="history-list">
        <li>No saved conversations yet.</li>
      </ul>
    </div>
  );
};

export default MessageHistory;