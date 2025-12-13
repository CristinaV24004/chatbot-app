import LeonardoPortrait from "../../assets/leonardo-portrait.jpeg";

// Displays the chat header with Leonardo's portrait and name
function ChatHeader() {
  return (
    <div className="chat-header-inner">
      <img
        src={LeonardoPortrait}
        alt="Portrait of Leonardo da Vinci"
        className="chat-avatar"
      />

      <div className="chat-title-block">
        <h1>Leonardo da Vinci</h1>
      </div>
    </div>
  );
}

export default ChatHeader;