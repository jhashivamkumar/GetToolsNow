import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab";

function toTitleCase(input: string) {
  return input
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toSentenceCase(input: string) {
  const lower = input.toLowerCase();
  return lower.replace(/(^\s*[a-z])|([.!?]\s*[a-z])/g, (m) => m.toUpperCase());
}

function words(input: string) {
  return input
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamelCase(input: string) {
  const w = words(input.toLowerCase());
  return w
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
}

function toPascalCase(input: string) {
  const w = words(input.toLowerCase());
  return w.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
}

function toSnakeCase(input: string) {
  return words(input.toLowerCase()).join("_");
}

function toKebabCase(input: string) {
  return words(input.toLowerCase()).join("-");
}

function convert(input: string, type: CaseType) {
  switch (type) {
    case "upper":
      return input.toUpperCase();
    case "lower":
      return input.toLowerCase();
    case "title":
      return toTitleCase(input);
    case "sentence":
      return toSentenceCase(input);
    case "camel":
      return toCamelCase(input);
    case "pascal":
      return toPascalCase(input);
    case "snake":
      return toSnakeCase(input);
    case "kebab":
      return toKebabCase(input);
    default:
      return input;
  }
}

const caseButtons: { key: CaseType; label: string }[] = [
  { key: "upper", label: "UPPER" },
  { key: "lower", label: "lower" },
  { key: "title", label: "Title" },
  { key: "sentence", label: "Sentence" },
  { key: "camel", label: "camelCase" },
  { key: "pascal", label: "PascalCase" },
  { key: "snake", label: "snake_case" },
  { key: "kebab", label: "kebab-case" },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("");
  const [caseType, setCaseType] = useState<CaseType>("title");

  const output = useMemo(() => convert(input, caseType), [input, caseType]);

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: "✅ Copied" });
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
              <h2 className="font-semibold">Input</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setInput("")} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert..."
            rows={12}
            className="resize-none"
          />

          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2">Choose case</div>
            <div className="flex flex-wrap gap-2">
              {caseButtons.map((b) => (
                <button
                  key={b.key}
                  onClick={() => setCaseType(b.key)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    caseType === b.key
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Output</h2>
              <Badge variant="secondary" className="ml-2">{caseType}</Badge>
            </div>
            <Button variant="outline" onClick={copyOutput} className="gap-2">
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/50 p-4 min-h-[240px]">
            <pre className="whitespace-pre-wrap break-words text-sm text-foreground font-mono">
              {output || "(Your converted text will appear here)"}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
