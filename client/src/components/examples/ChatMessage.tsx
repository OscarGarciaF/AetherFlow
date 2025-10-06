import ChatMessage from '../ChatMessage';

export default function ChatMessageExample() {
  return (
    <div className="flex flex-col gap-2 bg-background min-h-screen py-4">
      <ChatMessage
        role="user"
        content="Tell me the latest advancements in covid research"
        timestamp="2 min ago"
      />
      <ChatMessage
        role="assistant"
        content="Based on recent research, there have been several significant advancements in COVID-19 treatment and prevention. New antiviral medications have shown promising results in reducing severe outcomes, and updated vaccine formulations continue to provide protection against emerging variants."
        timestamp="1 min ago"
      />
    </div>
  );
}
