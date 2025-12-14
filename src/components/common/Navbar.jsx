import { NavLink } from "react-router-dom";

// Main navigation for chat, history, and about pages
const Navbar = ({ onNewChat, onToggleAccessibility }) => {
  return (
    <nav className="navbar">

      <div className="navbar-links">
      {/* Accessibility toggle button */}
        <button
          onClick={onToggleAccessibility}
          className="nav-link"
          aria-label="Toggle accessibility mode with high contrast"
          title="Enable high contrast accessibility mode"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="nav-icon"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
              fill="currentColor"
            />
          </svg>
          <span className="visually-hidden">Accessibility</span>
        </button>

      {/* New Chat button */}
        <button
          onClick={onNewChat}
          className="nav-link"
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

      {/* Apply active styling based on the current route */}
        <NavLink
          to="/"
          end
          aria-label="Go to Chat page"
          title="Chat with Leonardo da Vinci"
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
            <path
              d="M4 4h16v11H7l-3 3V4z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </svg>
          <span className="visually-hidden">Chat</span>
        </NavLink>

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
