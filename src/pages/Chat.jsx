
import MessageList from "../components/chat/MessageList.jsx";
import ChatInput from "../components/chat/ChatInput.jsx";

const Chat = ({ messages, isLoading, handleSendMessage }) => {
  return (
    <section className="chat-shell" aria-label="Leonardo da Vinci chatbot">
    
      <section
        className="chat-main"
        aria-live="polite"
        aria-label="Chat messages"
        role="log"
      >
        <MessageList messages={messages} isLoading={isLoading} />
      </section>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </section>
  );
};

export default Chat;