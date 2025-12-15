import ChatHeader from "../chat/ChatHeader.jsx";
import Navbar from "../common/Navbar.jsx";

// Fixed top navigation container combining chat header and main navigation
const TopNav = ({ onNewChat, onToggleAccessibility }) => {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="top-nav-left">
          <ChatHeader />
        </div>
        <div className="top-nav-right">
          <Navbar onNewChat={onNewChat} onToggleAccessibility={onToggleAccessibility} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
