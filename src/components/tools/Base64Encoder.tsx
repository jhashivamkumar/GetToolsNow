import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, ArrowDown, ArrowUp, Upload, FileImage } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Base64Encoder() {
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [fileDataUri, setFileDataUri] = useState('');
  const [fileName, setFileName] = useState('');
  const [copiedEncode, setCopiedEncode] = useState(false);
  const [copiedDecode, setCopiedDecode] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  const encodeText = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setTextOutput(encoded);
    } catch (e) {
      toast({ title: 'Failed to encode text', variant: 'destructive' });
    }
  };

  const decodeBase64 = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setBase64Output(decoded);
    } catch (e) {
      toast({ title: 'Invalid Base64 string', variant: 'destructive' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large. Max 5MB', variant: 'destructive' });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUri(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async (text: string, type: 'encode' | 'decode' | 'file') => {
    await navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
    
    if (type === 'encode') {
      setCopiedEncode(true);
      setTimeout(() => setCopiedEncode(false), 2000);
    } else if (type === 'decode') {
      setCopiedDecode(true);
      setTimeout(() => setCopiedDecode(false), 2000);
    } else {
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="encode">Encode Text</TabsTrigger>
          <TabsTrigger value="decode">Decode Base64</TabsTrigger>
          <TabsTrigger value="file">File to Base64</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Text to Encode</Label>
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter text to encode to Base64..."
              className="min-h-[150px] font-mono"
            />
          </div>

          <div className="flex justify-center">
            <Button onClick={encodeText} disabled={!textInput}>
              <ArrowDown className="h-4 w-4 mr-2" />
              Encode to Base64
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Base64 Output</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(textOutput, 'encode')}
                disabled={!textOutput}
              >
                {copiedEncode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copiedEncode ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <Textarea
              value={textOutput}
              readOnly
              placeholder="Encoded Base64 will appear here..."
              className="min-h-[150px] font-mono bg-muted/50"
            />
          </div>

          {textOutput && (
            <Card className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Original Size</p>
                  <p className="font-medium">{textInput.length} characters</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Encoded Size</p>
                  <p className="font-medium">{textOutput.length} characters (+{Math.round((textOutput.length / textInput.length - 1) * 100)}%)</p>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="decode" className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Base64 to Decode</Label>
            <Textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder="Enter Base64 string to decode..."
              className="min-h-[150px] font-mono"
            />
          </div>

          <div className="flex justify-center">
            <Button onClick={decodeBase64} disabled={!base64Input}>
              <ArrowUp className="h-4 w-4 mr-2" />
              Decode from Base64
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Decoded Text</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(base64Output, 'decode')}
                disabled={!base64Output}
              >
                {copiedDecode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copiedDecode ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <Textarea
              value={base64Output}
              readOnly
              placeholder="Decoded text will appear here..."
              className="min-h-[150px] font-mono bg-muted/50"
            />
          </div>
        </TabsContent>

        <TabsContent value="file" className="space-y-4 mt-6">
          <Card className="p-8 border-dashed">
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.txt"
              />
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Click to upload a file</p>
              <p className="text-sm text-muted-foreground">Images, PDFs, or text files (max 5MB)</p>
            </label>
          </Card>

          {fileDataUri && (
            <>
              {fileName && (
                <Card className="p-4 flex items-center gap-3">
                  <FileImage className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {(fileDataUri.length / 1024).toFixed(1)} KB encoded
                    </p>
                  </div>
                </Card>
              )}

              {fileDataUri.startsWith('data:image') && (
                <Card className="p-4">
                  <Label className="mb-2 block">Preview</Label>
                  <img 
                    src={fileDataUri} 
                    alt="Preview" 
                    className="max-w-full max-h-48 object-contain rounded"
                  />
                </Card>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Data URI</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(fileDataUri, 'file')}
                  >
                    {copiedFile ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-1">{copiedFile ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <Textarea
                  value={fileDataUri}
                  readOnly
                  className="min-h-[200px] font-mono text-xs bg-muted/50"
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
