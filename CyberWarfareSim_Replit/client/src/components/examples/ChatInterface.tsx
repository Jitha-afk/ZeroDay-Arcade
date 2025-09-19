import ChatInterface from '../ChatInterface';

export default function ChatInterfaceExample() {
  return (
    <div className="h-96 border rounded-lg">
      <ChatInterface
        currentRoom="main"
        currentPlayer={{ name: "Alex Chen", persona: "CISO" }}
        onSendMessage={(message) => console.log('Message sent:', message)}
        onRoomChange={(room) => console.log('Room changed to:', room)}
      />
    </div>
  );
}