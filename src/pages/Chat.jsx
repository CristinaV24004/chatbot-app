import MessageList from "../components/chat/MessageList.jsx";
import ChatInput from "../components/chat/ChatInput.jsx";

// Main chat view composing the message list and input field
const Chat = ({ 
  messages, 
  isLoading, 
  isBotTyping,
  handleSendMessage,
 }) => {

  return (
    <>
    {/* Live region for announcing new chat messages to assistive technologies */}
        <section
        className="chat-main"
        aria-live="polite"
        aria-label="Chat messages"
        role="log"
      >
        <MessageList messages={messages} isLoading={isLoading} isBotTyping={isBotTyping}/>
      </section>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </>
  );
};

export default Chat;