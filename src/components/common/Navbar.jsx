import { NavLink } from "react-router-dom";

// Main navigation for chat, history, and about pages
const Navbar = ({ onNewChat }) => {
  return (
    <nav className="navbar">

      <div className="navbar-links">
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
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9H13V8.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V11H8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5H11v2.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V14h2.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"
              fill="currentColor"
            />
          </svg>
          <span className="visually-hidden">New Chat</span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
