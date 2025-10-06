import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 max-w-3xl mx-auto w-full",
        isUser ? "justify-end" : "justify-start"
      )}
      data-testid={`message-${role}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed break-words max-w-2xl whitespace-pre-wrap",
            isUser
              ? "bg-accent text-accent-foreground border border-accent-border"
              : "bg-card text-card-foreground border border-card-border"
          )}
        >
          {content}
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground px-1" data-testid="text-timestamp">
            {timestamp}
          </span>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
