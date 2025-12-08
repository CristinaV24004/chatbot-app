import LeonardoPortrait from "../../assets/leonardo-portrait.jpeg";
import Navbar from "../Navbar.jsx";

function ChatHeader() {
  return (
   <header className="chat-header">
      <div className="chat-header-inner">
        <img
          src={LeonardoPortrait}
          alt="Portrait of Leonardo da Vinci"
          className="chat-avatar"
        />

        <div className="chat-title-block">
          <h1>Leonardo da Vinci</h1>
          <p className="chat-subtitle">
            Renaissance polymath • Painter • Inventor
          </p>
        </div>
      </div>
      <Navbar />
    </header>
  );
}

export default ChatHeader;