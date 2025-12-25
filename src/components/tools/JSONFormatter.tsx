import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Minimize2, Maximize2, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const [copied, setCopied] = useState(false);

  const { formatted, error, isValid, stats } = useMemo(() => {
    if (!input.trim()) {
      return { formatted: '', error: null, isValid: null, stats: null };
    }

    try {
      const parsed = JSON.parse(input);
      const indent = parseInt(indentSize);
      const formatted = JSON.stringify(parsed, null, indent);
      
      const countItems = (obj: any): { objects: number; arrays: number; keys: number } => {
        let objects = 0, arrays = 0, keys = 0;
        
        const traverse = (item: any) => {
          if (Array.isArray(item)) {
            arrays++;
            item.forEach(traverse);
          } else if (item && typeof item === 'object') {
            objects++;
            const objKeys = Object.keys(item);
            keys += objKeys.length;
            objKeys.forEach(k => traverse(item[k]));
          }
        };
        
        traverse(obj);
        return { objects, arrays, keys };
      };

      const stats = countItems(parsed);
      
      return { formatted, error: null, isValid: true, stats };
    } catch (e: any) {
      const errorMatch = e.message.match(/position (\d+)/);
      const position = errorMatch ? parseInt(errorMatch[1]) : null;
      
      return { 
        formatted: '', 
        error: { message: e.message, position }, 
        isValid: false,
        stats: null 
      };
    }
  }, [input, indentSize]);

  const copyToClipboard = async () => {
    if (!formatted) return;
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const minify = () => {
    if (!isValid) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {}
  };

  const beautify = () => {
    if (!isValid) return;
    setInput(formatted);
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
      },
      hobbies: ["reading", "gaming", "coding"],
      isActive: true
    }, null, 2));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Indent:</Label>
            <Select value={indentSize} onValueChange={setIndentSize}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="1">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadSample}>
            Load Sample
          </Button>
          <Button variant="outline" size="sm" onClick={minify} disabled={!isValid}>
            <Minimize2 className="h-4 w-4 mr-1" />
            Minify
          </Button>
          <Button variant="outline" size="sm" onClick={beautify} disabled={!isValid}>
            <Maximize2 className="h-4 w-4 mr-1" />
            Beautify
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Input JSON</Label>
            {isValid !== null && (
              <span className={`text-sm flex items-center gap-1 ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                {isValid ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {isValid ? 'Valid JSON' : 'Invalid JSON'}
              </span>
            )}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...\n\n{"name": "example"}'
            className="font-mono text-sm min-h-[400px] resize-none"
          />
          {error && (
            <Card className="p-3 bg-red-500/10 border-red-500/20">
              <p className="text-sm text-red-500">{error.message}</p>
              {error.position && (
                <p className="text-xs text-muted-foreground mt-1">
                  Error near position {error.position}
                </p>
              )}
            </Card>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Formatted Output</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard}
              disabled={!formatted}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1">{copied ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>
          <Textarea
            value={formatted}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="font-mono text-sm min-h-[400px] resize-none bg-muted/50"
          />
        </div>
      </div>

      {stats && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">JSON Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Characters</p>
              <p className="text-xl font-semibold">{input.length.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Formatted</p>
              <p className="text-xl font-semibold">{formatted.length.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Objects</p>
              <p className="text-xl font-semibold">{stats.objects}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Arrays</p>
              <p className="text-xl font-semibold">{stats.arrays}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Keys</p>
              <p className="text-xl font-semibold">{stats.keys}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
