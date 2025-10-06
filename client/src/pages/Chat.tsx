import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import { Dna } from "lucide-react";
import type { Message } from "@shared/schema";

export default function Chat() {
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], refetch } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  useEffect(() => {
    const clearHistoryOnLoad = async () => {
      try {
        await fetch("/api/messages", {
          method: "DELETE",
        });
        await refetch();
      } catch (error) {
        console.error("Failed to clear messages on load:", error);
      }
    };
    clearHistoryOnLoad();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, streamingMessage]);

  const getRelativeTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/messages/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "user",
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setStreamingMessage("");
              await refetch();
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setStreamingMessage((prev) => prev + parsed.text);
              } else if (parsed.error) {
                console.error("Stream error:", parsed.error);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setStreamingMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between flex-shrink-0 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
            <Dna className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold" data-testid="text-app-title">
              Space Biology AI
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by LlamaIndex
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <div className="py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role as "user" | "assistant"}
                content={message.content}
                timestamp={getRelativeTime(message.timestamp)}
              />
            ))}
            {isLoading && (
              <>
                {streamingMessage ? (
                  <ChatMessage role="assistant" content={streamingMessage} />
                ) : (
                  <TypingIndicator />
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <ChatInput
        onSend={handleSendMessage}
        disabled={isLoading}
        placeholder="Ask about space biology research..."
      />
    </div>
  );
}
