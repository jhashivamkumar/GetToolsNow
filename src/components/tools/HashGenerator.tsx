import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Copy, Check, Hash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

async function generateHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  const generateHashes = async () => {
    if (!input) return;
    
    setLoading(true);
    const newHashes: Record<string, string> = {};
    
    for (const algo of algorithms) {
      try {
        newHashes[algo] = await generateHash(input, algo);
      } catch (e) {
        newHashes[algo] = 'Error generating hash';
      }
    }
    
    setHashes(newHashes);
    setLoading(false);
  };

  const copyToClipboard = async (value: string, algo: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(algo);
    toast({ title: `${algo} hash copied!` });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Text to Hash</Label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to generate hash..."
              className="min-h-[150px] font-mono"
            />
          </div>

          <Button onClick={generateHashes} disabled={!input || loading} className="w-full">
            <Hash className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Hashes'}
          </Button>

          <Card className="p-4">
            <h4 className="font-semibold mb-2">About Hash Functions</h4>
            <p className="text-sm text-muted-foreground">
              Cryptographic hash functions convert any input into a fixed-size string. 
              They're one-way (can't be reversed) and collision-resistant.
            </p>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {algorithms.map(algo => (
            <Card key={algo} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">{algo}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(hashes[algo] || '', algo)}
                  disabled={!hashes[algo]}
                >
                  {copied === algo ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <code className="text-xs font-mono break-all block bg-muted p-2 rounded">
                {hashes[algo] || 'Hash will appear here...'}
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                {algo === 'SHA-1' && '160 bits (40 hex chars) - Not recommended for security'}
                {algo === 'SHA-256' && '256 bits (64 hex chars) - Recommended'}
                {algo === 'SHA-384' && '384 bits (96 hex chars)'}
                {algo === 'SHA-512' && '512 bits (128 hex chars)'}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Common Use Cases</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">Password Storage</p>
            <p className="text-muted-foreground">Store hashed passwords, not plain text</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">Data Integrity</p>
            <p className="text-muted-foreground">Verify files haven't been modified</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">Digital Signatures</p>
            <p className="text-muted-foreground">Part of cryptographic signing</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
