import "@/lib/inputs/chatsearchinput/ChatSearchInput.css";

const ChatSearchInput = () => {
  return (
    <div className="input-container">
      <input type="text" placeholder="Search..." />
      <button className="button">Request</button>
    </div>
  );
};

export default ChatSearchInput;
