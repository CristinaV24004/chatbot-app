import { NavLink } from "react-router-dom";

// Main navigation for chat, history, and about pages
const Navbar = ({ onNewChat }) => {
  return (
    <nav className="navbar">

      <div className="navbar-links">
      {/* New Chat button */}
        <button
          onClick={onNewChat}
          className="nav-link nav-link--button"
          aria-label="Start a new chat"
          title="Start a fresh conversation"
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
