import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RotateCcw, Sparkles } from "lucide-react";

function normalize(text: string, ignoreWhitespace: boolean) {
  return ignoreWhitespace
    ? text
        .split("\n")
        .map((l) => l.replace(/\s+/g, " ").trim())
        .join("\n")
    : text;
}

export default function TextDiffChecker() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);

  const diff = useMemo(() => {
    const na = normalize(a, ignoreWhitespace);
    const nb = normalize(b, ignoreWhitespace);

    const aLines = na.split("\n");
    const bLines = nb.split("\n");
    const max = Math.max(aLines.length, bLines.length);

    let changed = 0;
    let added = 0;
    let removed = 0;

    const rows = Array.from({ length: max }).map((_, i) => {
      const left = aLines[i] ?? "";
      const right = bLines[i] ?? "";
      const leftExists = i < aLines.length;
      const rightExists = i < bLines.length;

      let state: "same" | "changed" | "added" | "removed" = "same";
      if (leftExists && !rightExists) state = "removed";
      else if (!leftExists && rightExists) state = "added";
      else if (left !== right) state = "changed";

      if (state === "changed") changed++;
      if (state === "added") added++;
      if (state === "removed") removed++;

      return { i: i + 1, left, right, state };
    });

    return { rows, changed, added, removed };
  }, [a, b, ignoreWhitespace]);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Compare</h2>
            <div className="ml-auto flex items-center gap-2">
              <Checkbox
                id="ignoreWhitespace"
                checked={ignoreWhitespace}
                onCheckedChange={(v) => setIgnoreWhitespace(Boolean(v))}
              />
              <Label htmlFor="ignoreWhitespace" className="text-sm text-muted-foreground">
                Ignore whitespace
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Original</Label>
              <Textarea value={a} onChange={(e) => setA(e.target.value)} rows={10} className="resize-none" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Modified</Label>
              <Textarea value={b} onChange={(e) => setB(e.target.value)} rows={10} className="resize-none" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button variant="outline" onClick={() => { setA(""); setB(""); }} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary">Changed: {diff.changed}</Badge>
              <Badge variant="secondary">Added: {diff.added}</Badge>
              <Badge variant="secondary">Removed: {diff.removed}</Badge>
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Differences</h2>
          </div>

          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="grid grid-cols-2 bg-secondary/30 text-xs text-muted-foreground">
              <div className="px-3 py-2 border-r border-border/50">Original</div>
              <div className="px-3 py-2">Modified</div>
            </div>
            <div className="max-h-[420px] overflow-auto bg-background/50">
              {diff.rows.map((row) => {
                const hl =
                  row.state === "same"
                    ? ""
                    : row.state === "changed"
                      ? "bg-primary/10"
                      : row.state === "added"
                        ? "bg-green-500/10"
                        : "bg-red-500/10";

                return (
                  <div key={row.i} className={`grid grid-cols-2 text-sm ${hl}`}>
                    <div className="px-3 py-2 border-r border-border/50">
                      <span className="text-[10px] text-muted-foreground mr-2">{row.i}</span>
                      <span className="font-mono whitespace-pre-wrap break-words">{row.left}</span>
                    </div>
                    <div className="px-3 py-2">
                      <span className="text-[10px] text-muted-foreground mr-2">{row.i}</span>
                      <span className="font-mono whitespace-pre-wrap break-words">{row.right}</span>
                    </div>
                  </div>
                );
              })}
              {diff.rows.length === 0 && (
                <div className="p-6 text-sm text-muted-foreground">Paste text to compare.</div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
