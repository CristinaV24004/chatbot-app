import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

// Main navigation for chat, history, and about pages
const Navbar = ({ messages, onNewChat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newChatPressed, setNewChatPressed] = useState(false);
  
  // New Chat button is disabled if only initial greeting (no user messages)
  const isNewChatDisabled = messages.length <= 1;
  // Hide Home button when on the home page
  const isHomePage = location.pathname === "/";

  const handleNewChatClick = () => {
    // Navigate to chat page
    navigate("/", { replace: true });
    
    setNewChatPressed(true);
    
    // Call the actual new chat handler
    onNewChat();
    
    // Remove the animation class after animation completes
    setTimeout(() => setNewChatPressed(false), 600);
  };
  
  const handleHomeClick = () => {
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {/* Home button - always visible but disabled on home page */}
        <button
          onClick={handleHomeClick}
          disabled={isHomePage}
          className="nav-link"
          aria-label="Go to chat page"
          title="Return to current chat"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="nav-icon"
          >
            <path
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              fill="currentColor"
            />
          </svg>
          <span className="nav-label">Back</span>
        </button>

      {/* New Chat button */}
        <button
          onClick={handleNewChatClick}
          disabled={isNewChatDisabled}
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
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
              fill="currentColor"
            />
          </svg>
          <span className="nav-label">New Chat</span>
        </button>

      {/* History page button */}
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
          <span className="nav-label">History</span>
        </NavLink>

        {/* About page button */}
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
          <span className="nav-label">About</span>
        </NavLink>

      </div>
    </nav>
  );
};

export default Navbar;
