import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3 max-w-3xl mx-auto w-full" data-testid="typing-indicator">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl px-4 py-3 bg-card border border-card-border">
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
