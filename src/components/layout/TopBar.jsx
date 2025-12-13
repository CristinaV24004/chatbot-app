import ChatHeader from "../chat/ChatHeader.jsx";
import Navbar from "../common/Navbar.jsx";

const BottomNav = () => {
  return (
    <footer className="bottom-nav">
      <div className="bottom-nav-inner">
        <div className="bottom-nav-left">
          <ChatHeader />
        </div>
        <div className="bottom-nav-right">
          <Navbar />
        </div>
      </div>
    </footer>
  );
};

export default BottomNav;
