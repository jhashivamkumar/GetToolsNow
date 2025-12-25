import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import JsBarcode from 'jsbarcode';

const barcodeFormats = [
  { value: 'CODE128', label: 'Code 128', placeholder: 'Any text or numbers' },
  { value: 'CODE39', label: 'Code 39', placeholder: 'A-Z, 0-9, -. $/+%' },
  { value: 'EAN13', label: 'EAN-13', placeholder: '12 digits (check digit auto)' },
  { value: 'EAN8', label: 'EAN-8', placeholder: '7 digits (check digit auto)' },
  { value: 'UPC', label: 'UPC-A', placeholder: '11 digits (check digit auto)' },
  { value: 'ITF14', label: 'ITF-14', placeholder: '13 digits (check digit auto)' },
  { value: 'pharmacode', label: 'Pharmacode', placeholder: '3-131070' },
];

export default function BarcodeGenerator() {
  const [value, setValue] = useState('1234567890');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const [error, setError] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    generateBarcode();
  }, [value, format, width, height, showText]);

  const generateBarcode = () => {
    if (!svgRef.current || !value) return;
    
    try {
      JsBarcode(svgRef.current, value, {
        format: format,
        width: width,
        height: height,
        displayValue: showText,
        margin: 10,
        background: '#ffffff',
        lineColor: '#000000',
      });
      setError('');
    } catch (e: any) {
      setError(e.message || 'Invalid input for this barcode format');
    }
  };

  const downloadBarcode = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = `barcode-${value}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: 'Barcode downloaded!' });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const currentFormat = barcodeFormats.find(f => f.value === format);

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Barcode Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {barcodeFormats.map(f => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={currentFormat?.placeholder}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bar Width</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                min={1}
                max={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={30}
                max={200}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showText"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="showText" className="font-normal">Show text below barcode</Label>
          </div>

          <Button onClick={downloadBarcode} className="w-full" disabled={!!error}>
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
        </div>

        {/* Preview */}
        <Card className="p-6 flex items-center justify-center bg-white min-h-[200px]">
          <svg ref={svgRef} />
        </Card>
      </div>

      {/* Format Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Barcode Format Reference</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {barcodeFormats.map(f => (
            <div key={f.value} className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{f.label}</p>
              <p className="text-muted-foreground text-xs">{f.placeholder}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
