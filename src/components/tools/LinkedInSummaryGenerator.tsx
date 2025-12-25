import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Copy, Info, RotateCcw, Sparkles } from "lucide-react";

type Tone = "Professional" | "Friendly" | "Bold";

export default function LinkedInSummaryGenerator() {
  const [tone, setTone] = useState<Tone>("Professional");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [skills, setSkills] = useState("");
  const [achievements, setAchievements] = useState("");

  const summary = useMemo(() => {
    const n = name || "I";
    const r = role || "professional";
    const y = years ? `${years} years` : "several years";

    const skillsList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 10);

    const achievementsList = achievements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 5);

    const opening =
      tone === "Bold"
        ? `${n} is a results-driven ${r} with ${y} of experience building high-impact outcomes.`
        : tone === "Friendly"
          ? `Hi, I’m ${n} — a ${r} with ${y} of experience, passionate about delivering great work and helping teams win.`
          : `I’m ${n}, a ${r} with ${y} of experience focused on delivering meaningful results.`;

    const skillsText = skillsList.length
      ? `Core strengths: ${skillsList.join(", ")}.`
      : "Core strengths: (add your key skills above).";

    const achievementsText = achievementsList.length
      ? `Highlights:\n${achievementsList.map((a) => `• ${a.replace(/^•\s*/, "")}`).join("\n")}`
      : "Highlights:\n• (add 2–3 measurable achievements above)";

    const close =
      tone === "Friendly"
        ? `I’m always open to collaborating on interesting problems. Feel free to connect or message me.`
        : `I’m open to new opportunities and collaborations. Feel free to connect.`;

    return [opening, "", skillsText, "", achievementsText, "", close].join("\n");
  }, [tone, name, role, years, skills, achievements]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast({ title: "✅ Copied" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const reset = () => {
    setTone("Professional");
    setName("");
    setRole("");
    setYears("");
    setSkills("");
    setAchievements("");
  };

  return (
    <div className="p-4 md:p-6">
      <Card variant="glass" className="mb-6 p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">LinkedIn Summary Tips</h4>
          <p className="text-xs text-muted-foreground">
            Keep it skimmable. Use 2–3 short paragraphs and add 2–3 achievements with numbers.
          </p>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button onClick={copy} className="gap-2 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90">
          <Copy className="h-4 w-4" /> Copy
        </Button>
        <Button variant="ghost" onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Badge variant="secondary" className="ml-auto">Tone: {tone}</Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card variant="gradient" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Inputs</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Product Designer / Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Years of Experience</Label>
              <Input value={years} onChange={(e) => setYears(e.target.value)} placeholder="3" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Key Skills (comma-separated)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, UX, Figma" />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs">Achievements (one per line)</Label>
            <Textarea
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="• Increased conversion by 12%\n• Led 0→1 launch with 20k users"
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2">Tone</div>
            <div className="flex flex-wrap gap-2">
              {(["Professional", "Friendly", "Bold"] as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    tone === t ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Preview</h2>
          </div>

          <div className="rounded-xl border border-border/50 bg-background/50 p-4 min-h-[520px]">
            <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
              {summary}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
