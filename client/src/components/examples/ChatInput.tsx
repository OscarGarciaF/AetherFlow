import ChatInput from '../ChatInput';

export default function ChatInputExample() {
  return (
    <div className="bg-background min-h-screen flex items-end">
      <div className="w-full">
        <ChatInput
          onSend={(msg) => console.log('Message sent:', msg)}
          placeholder="Ask anything..."
        />
      </div>
    </div>
  );
}
