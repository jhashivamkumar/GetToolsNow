import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Copy, Download, Info, RotateCcw, Sparkles } from "lucide-react";
import jsPDF from "jspdf";

type Tone = "Professional" | "Friendly" | "Bold";

export default function CoverLetterGenerator() {
  const [tone, setTone] = useState<Tone>("Professional");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [highlights, setHighlights] = useState("");

  const letter = useMemo(() => {
    const name = fullName || "Your Name";
    const salutation = hiringManager ? `Dear ${hiringManager},` : "Dear Hiring Manager,";

    const intro =
      tone === "Bold"
        ? `I’m excited to apply for the ${jobTitle || "[Job Title]"} role at ${company || "[Company]"}. I bring a track record of delivering measurable impact and I’m ready to do the same for your team.`
        : tone === "Friendly"
          ? `I hope you’re doing well. I’m writing to apply for the ${jobTitle || "[Job Title]"} role at ${company || "[Company]"}. I’d love the opportunity to contribute to your team.`
          : `I am writing to express my interest in the ${jobTitle || "[Job Title]"} position at ${company || "[Company]"}. I believe my experience and skills align well with the role.`;

    const bullets = highlights
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 6);

    const body = bullets.length
      ? `Here are a few highlights that demonstrate my fit:\n${bullets
          .map((b) => `• ${b.replace(/^•\s*/, "")}`)
          .join("\n")}`
      : "Here are a few highlights that demonstrate my fit:\n• (Add 2–4 accomplishments or skills above)";

    const close =
      tone === "Friendly"
        ? `Thank you for your time and consideration. I’d be happy to share more details and discuss how I can help ${company || "your team"} succeed.`
        : `Thank you for your consideration. I welcome the opportunity to discuss how my experience can contribute to ${company || "your organization"}.`;

    const contactLine = [email, phone].filter(Boolean).join(" | ");

    return [
      name,
      contactLine,
      "",
      `Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`,
      "",
      salutation,
      "",
      intro,
      "",
      body,
      "",
      close,
      "",
      "Sincerely,",
      "",
      name,
    ]
      .filter((l) => l !== undefined)
      .join("\n");
  }, [tone, fullName, email, phone, jobTitle, company, hiringManager, highlights]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      toast({ title: "✅ Copied" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(letter.trim(), 170);
    doc.setFontSize(11);
    doc.text(lines, 20, 20);
    doc.save(`cover-letter-${Date.now()}.pdf`);
    toast({ title: "✅ PDF downloaded" });
  };

  const reset = () => {
    setTone("Professional");
    setFullName("");
    setEmail("");
    setPhone("");
    setJobTitle("");
    setCompany("");
    setHiringManager("");
    setHighlights("");
  };

  return (
    <div className="p-4 md:p-6">
      <Card variant="glass" className="mb-6 p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">Cover Letter Tips</h4>
          <p className="text-xs text-muted-foreground">
            Keep it to 250–400 words. Add 2–4 achievements with numbers (e.g., “reduced costs by 18%”).
          </p>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button onClick={downloadPDF} className="gap-2 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
        <Button variant="outline" onClick={copy} className="gap-2">
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
              <Label className="text-xs">Your Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Hiring Manager (optional)</Label>
              <Input value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} placeholder="e.g., Priya Sharma" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Job Title</Label>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Frontend Developer" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Company</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs">Key Highlights (one per line)</Label>
            <Textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="• Built a dashboard used by 50k users\n• Improved Lighthouse performance from 62 to 92\n• Led migration to TypeScript"
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
            <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed font-serif text-foreground">
              {letter}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
