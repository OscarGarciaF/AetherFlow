import { Dna } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 border border-primary/20 glow-accent">
        <Dna className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Explore Space Biology
      </h2>
      <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
        Ask questions about biological research in space environments, microgravity effects, and the latest discoveries in astrobiology
      </p>
    </div>
  );
}
