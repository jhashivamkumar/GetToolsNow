import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function URLEncoder() {
  const [encodeInput, setEncodeInput] = useState('');
  const [encodeOutput, setEncodeOutput] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeOutput, setDecodeOutput] = useState('');
  const [copiedEncode, setCopiedEncode] = useState(false);
  const [copiedDecode, setCopiedDecode] = useState(false);

  const encodeURL = () => {
    try {
      const encoded = encodeURIComponent(encodeInput);
      setEncodeOutput(encoded);
    } catch (e) {
      toast({ title: 'Failed to encode', variant: 'destructive' });
    }
  };

  const decodeURL = () => {
    try {
      const decoded = decodeURIComponent(decodeInput);
      setDecodeOutput(decoded);
    } catch (e) {
      toast({ title: 'Invalid encoded string', variant: 'destructive' });
    }
  };

  const copyToClipboard = async (text: string, type: 'encode' | 'decode') => {
    await navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
    
    if (type === 'encode') {
      setCopiedEncode(true);
      setTimeout(() => setCopiedEncode(false), 2000);
    } else {
      setCopiedDecode(true);
      setTimeout(() => setCopiedDecode(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode URL</TabsTrigger>
          <TabsTrigger value="decode">Decode URL</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Text to Encode</Label>
            <Textarea
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="Enter text with special characters...
Example: Hello World! @#$%"
              className="min-h-[120px] font-mono"
            />
          </div>

          <div className="flex justify-center">
            <Button onClick={encodeURL} disabled={!encodeInput}>
              <ArrowDown className="h-4 w-4 mr-2" />
              Encode
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Encoded Output</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(encodeOutput, 'encode')}
                disabled={!encodeOutput}
              >
                {copiedEncode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copiedEncode ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <Textarea
              value={encodeOutput}
              readOnly
              placeholder="Encoded URL will appear here..."
              className="min-h-[120px] font-mono bg-muted/50"
            />
          </div>
        </TabsContent>

        <TabsContent value="decode" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Encoded URL to Decode</Label>
            <Textarea
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="Enter encoded URL...
Example: Hello%20World%21%20%40%23%24%25"
              className="min-h-[120px] font-mono"
            />
          </div>

          <div className="flex justify-center">
            <Button onClick={decodeURL} disabled={!decodeInput}>
              <ArrowUp className="h-4 w-4 mr-2" />
              Decode
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Decoded Output</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(decodeOutput, 'decode')}
                disabled={!decodeOutput}
              >
                {copiedDecode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copiedDecode ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <Textarea
              value={decodeOutput}
              readOnly
              placeholder="Decoded text will appear here..."
              className="min-h-[120px] font-mono bg-muted/50"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Common URL Encodings</h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm font-mono">
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground">Space:</span> %20
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground">!</span> %21
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground">#</span> %23
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground">$</span> %24
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground">%</span> %25
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground">&</span> %26
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground">=</span> %3D
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="text-muted-foreground">?</span> %3F
          </div>
        </div>
      </Card>
    </div>
  );
}
