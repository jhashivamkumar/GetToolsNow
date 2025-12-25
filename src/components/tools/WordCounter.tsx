import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Sparkles, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function countSentences(text: string) {
  const matches = text
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?\n]+[.!?]+/g);
  return matches ? matches.length : text.trim() ? 1 : 0;
}

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const sentences = countSentences(text);
    const readingTimeMinutes = Math.max(0, Math.ceil(words / 200));

    return { words, characters, charactersNoSpaces, paragraphs, sentences, readingTimeMinutes };
  }, [text]);

  const copyStats = async () => {
    const lines = [
      `Words: ${stats.words}`,
      `Characters: ${stats.characters}`,
      `Characters (no spaces): ${stats.charactersNoSpaces}`,
      `Sentences: ${stats.sentences}`,
      `Paragraphs: ${stats.paragraphs}`,
      `Reading time: ~${stats.readingTimeMinutes} min`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(lines);
      toast({ title: "✅ Stats copied" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Text Input</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setText("")} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your text here..."
            rows={14}
            className="resize-none"
          />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button onClick={copyStats} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" /> Copy Stats
            </Button>
            <Badge variant="secondary" className="ml-auto gap-1">
              <Zap className="h-3 w-3" /> Live
            </Badge>
          </div>
        </Card>

        <Card variant="gradient" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Statistics</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Words", value: stats.words },
              { label: "Characters", value: stats.characters },
              { label: "No-space chars", value: stats.charactersNoSpaces },
              { label: "Sentences", value: stats.sentences },
              { label: "Paragraphs", value: stats.paragraphs },
              { label: "Reading time", value: `${stats.readingTimeMinutes} min` },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border/50 bg-background/50 p-4"
              >
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-2xl font-bold mt-1">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-border/50 bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground">
              Tip: For accurate reading time, aim for short sentences and 12–16 words per line.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
