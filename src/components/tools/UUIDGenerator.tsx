import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Copy, Check, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateUUIDv1(): string {
  const now = Date.now();
  const uuid = 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c, i) => {
    if (i < 8) {
      return ((now >> (28 - i * 4)) & 0xf).toString(16);
    }
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return uuid;
}

export default function UUIDGenerator() {
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generateUUIDs = () => {
    const newUUIDs = [];
    for (let i = 0; i < count; i++) {
      newUUIDs.push(version === 'v4' ? generateUUIDv4() : generateUUIDv1());
    }
    setUuids(newUUIDs);
  };

  const copyToClipboard = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(index);
    toast({ title: 'UUID copied!' });
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    toast({ title: `${uuids.length} UUIDs copied!` });
  };

  const clearAll = () => {
    setUuids([]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>UUID Version</Label>
            <RadioGroup value={version} onValueChange={(v) => setVersion(v as 'v4' | 'v1')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v4" id="v4" />
                <Label htmlFor="v4" className="font-normal">
                  <span className="font-semibold">Version 4</span> - Random (Recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v1" id="v1" />
                <Label htmlFor="v1" className="font-normal">
                  <span className="font-semibold">Version 1</span> - Timestamp-based
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Number of UUIDs</Label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              min={1}
              max={100}
            />
            <p className="text-xs text-muted-foreground">Generate up to 100 UUIDs at once</p>
          </div>

          <Button onClick={generateUUIDs} className="w-full" size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate UUID{count > 1 ? 's' : ''}
          </Button>

          {uuids.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyAll} className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          <Label>Generated UUIDs</Label>
          <Card className="p-4 max-h-96 overflow-y-auto">
            {uuids.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Click generate to create UUIDs
              </p>
            ) : (
              <div className="space-y-2">
                {uuids.map((uuid, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-muted p-2 rounded break-all">
                      {uuid}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(uuid, i)}
                    >
                      {copied === i ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Info */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">About UUIDs</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium mb-2">Version 4 (Random)</p>
            <p className="text-muted-foreground">
              Generated using random numbers. Most commonly used. 
              Extremely low collision probability (1 in 2^122).
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">Version 1 (Timestamp)</p>
            <p className="text-muted-foreground">
              Based on timestamp and MAC address. Useful when you need 
              sortable IDs or want to extract creation time.
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="font-medium text-sm">UUID Format</p>
          <code className="text-xs text-muted-foreground">
            xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
          </code>
          <p className="text-xs text-muted-foreground mt-1">
            M = version (1 or 4), N = variant (8, 9, a, or b)
          </p>
        </div>
      </Card>
    </div>
  );
}
