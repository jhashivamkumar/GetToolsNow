import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Unit = "paragraphs" | "sentences" | "words";

const baseWords =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(
    " "
  );

function makeWords(count: number) {
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(baseWords[i % baseWords.length]);
  return out.join(" ");
}

function makeSentences(count: number) {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const len = 10 + (i % 8);
    const sentence = makeWords(len);
    out.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".");
  }
  return out.join(" ");
}

function makeParagraphs(count: number) {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(makeSentences(4 + (i % 3)));
  }
  return out.join("\n\n");
}

export default function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [amount, setAmount] = useState(3);

  const result = useMemo(() => {
    const n = Math.max(1, Math.min(100, Number.isFinite(amount) ? amount : 1));
    if (unit === "words") return makeWords(n);
    if (unit === "sentences") return makeSentences(n);
    return makeParagraphs(n);
  }, [unit, amount]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({ title: "✅ Copied" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Generator</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Type</Label>
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "paragraphs", label: "Paragraphs" },
                  { key: "sentences", label: "Sentences" },
                  { key: "words", label: "Words" },
                ] as const).map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setUnit(b.key)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                      unit === b.key ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Amount</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <p className="text-[10px] text-muted-foreground">1–100</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Button onClick={copy} className="gap-2">
              <Copy className="h-4 w-4" /> Copy
            </Button>
            <Button variant="outline" onClick={() => setAmount(3)} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Badge variant="secondary" className="ml-auto">
              {amount} {unit}
            </Badge>
          </div>
        </Card>

        <Card variant="gradient" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Output</h2>
          </div>
          <Textarea value={result} readOnly rows={14} className="resize-none font-mono" />
        </Card>
      </div>
    </div>
  );
}
