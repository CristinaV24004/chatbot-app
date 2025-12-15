import { NavLink } from "react-router-dom";
import { useState } from "react";

// Main navigation for chat, history, and about pages
const Navbar = ({ onNewChat }) => {
  const [newChatPressed, setNewChatPressed] = useState(false);

  const handleNewChatClick = () => {
    // Visual feedback: add animation class
    setNewChatPressed(true);
    
    // Call the actual new chat handler
    onNewChat();
    
    // Remove the animation class after animation completes
    setTimeout(() => setNewChatPressed(false), 600);
  };

  return (
    <nav className="navbar">

      <div className="navbar-links">
      
      {/* New Chat button */}
        <button
          onClick={handleNewChatClick}
          className={`nav-link ${newChatPressed ? "nav-link--pressed" : ""}`}
          aria-label="Start a new chat conversation"
          title="Start a fresh conversation with Leonardo"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="nav-icon"
          >
            <path
              d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
              fill="currentColor"
            />
          </svg>
          <span className="visually-hidden">New Chat</span>
        </button>

        <NavLink
          to="/history"
          aria-label="Go to History page"
          title="View conversation history"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link--active" : "nav-link"
          }
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="nav-icon"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            />
            <path
              d="M12 7.5v4.5l3 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="visually-hidden">History</span>
        </NavLink>

        <NavLink
          to="/about"
          aria-label="Go to About page"
          title="Learn more about this app"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link--active" : "nav-link"
          }
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="nav-icon"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            />
            <circle cx="12" cy="9" r="0.9" fill="currentColor" />
            <path
              d="M11 12.25h1.2V17"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          <span className="visually-hidden">About</span>
        </NavLink>

      </div>
    </nav>
  );
};

export default Navbar;
