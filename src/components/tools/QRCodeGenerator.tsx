import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Download, Link, Type, Wifi, User, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'upi';

interface QRSettings {
  size: number;
  margin: number;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  darkColor: string;
  lightColor: string;
}

export default function QRCodeGenerator() {
  const [qrType, setQRType] = useState<QRType>('url');
  const [qrData, setQRData] = useState('');
  const [settings, setSettings] = useState<QRSettings>({
    size: 256,
    margin: 2,
    errorCorrection: 'M',
    darkColor: '#000000',
    lightColor: '#ffffff',
  });
  
  // Type-specific data
  const [urlData, setUrlData] = useState('https://');
  const [textData, setTextData] = useState('');
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [vcardData, setVcardData] = useState({ name: '', phone: '', email: '', company: '' });
  const [upiData, setUpiData] = useState({ upiId: '', name: '', amount: '' });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRContent = (): string => {
    switch (qrType) {
      case 'url':
        return urlData;
      case 'text':
        return textData;
      case 'wifi':
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
FN:${vcardData.name}
TEL:${vcardData.phone}
EMAIL:${vcardData.email}
ORG:${vcardData.company}
END:VCARD`;
      case 'upi':
        let upiString = `upi://pay?pa=${upiData.upiId}&pn=${encodeURIComponent(upiData.name)}`;
        if (upiData.amount) upiString += `&am=${upiData.amount}`;
        return upiString;
      default:
        return '';
    }
  };

  useEffect(() => {
    const content = generateQRContent();
    setQRData(content);
    
    if (content && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, content, {
        width: settings.size,
        margin: settings.margin,
        errorCorrectionLevel: settings.errorCorrection,
        color: {
          dark: settings.darkColor,
          light: settings.lightColor,
        },
      }).catch(err => {
        console.error('QR generation error:', err);
      });
    }
  }, [qrType, urlData, textData, wifiData, vcardData, upiData, settings]);

  const downloadPNG = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      toast({ title: 'QR code downloaded!' });
    }
  };

  const downloadSVG = async () => {
    const content = generateQRContent();
    if (!content) return;
    
    try {
      const svgString = await QRCode.toString(content, {
        type: 'svg',
        width: settings.size,
        margin: settings.margin,
        errorCorrectionLevel: settings.errorCorrection,
        color: {
          dark: settings.darkColor,
          light: settings.lightColor,
        },
      });
      
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = 'qrcode.svg';
      link.href = URL.createObjectURL(blob);
      link.click();
      toast({ title: 'SVG downloaded!' });
    } catch (err) {
      console.error('SVG generation error:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <Tabs value={qrType} onValueChange={(v) => setQRType(v as QRType)}>
            <TabsList className="w-full">
              <TabsTrigger value="url" className="flex-1"><Link className="h-4 w-4 mr-1" /> URL</TabsTrigger>
              <TabsTrigger value="text" className="flex-1"><Type className="h-4 w-4 mr-1" /> Text</TabsTrigger>
              <TabsTrigger value="wifi" className="flex-1"><Wifi className="h-4 w-4 mr-1" /> WiFi</TabsTrigger>
              <TabsTrigger value="vcard" className="flex-1"><User className="h-4 w-4 mr-1" /> vCard</TabsTrigger>
              <TabsTrigger value="upi" className="flex-1"><CreditCard className="h-4 w-4 mr-1" /> UPI</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={urlData} onChange={e => setUrlData(e.target.value)} placeholder="https://example.com" />
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Text</Label>
                <Textarea value={textData} onChange={e => setTextData(e.target.value)} placeholder="Enter any text..." rows={4} />
              </div>
            </TabsContent>

            <TabsContent value="wifi" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Network Name (SSID)</Label>
                <Input value={wifiData.ssid} onChange={e => setWifiData(prev => ({ ...prev, ssid: e.target.value }))} placeholder="MyWiFi" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={wifiData.password} onChange={e => setWifiData(prev => ({ ...prev, password: e.target.value }))} placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Encryption</Label>
                <select 
                  className="w-full h-11 px-4 rounded-lg border border-border bg-secondary/50"
                  value={wifiData.encryption} 
                  onChange={e => setWifiData(prev => ({ ...prev, encryption: e.target.value }))}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            </TabsContent>

            <TabsContent value="vcard" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={vcardData.name} onChange={e => setVcardData(prev => ({ ...prev, name: e.target.value }))} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={vcardData.phone} onChange={e => setVcardData(prev => ({ ...prev, phone: e.target.value }))} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={vcardData.email} onChange={e => setVcardData(prev => ({ ...prev, email: e.target.value }))} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={vcardData.company} onChange={e => setVcardData(prev => ({ ...prev, company: e.target.value }))} placeholder="Acme Inc" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upi" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input value={upiData.upiId} onChange={e => setUpiData(prev => ({ ...prev, upiId: e.target.value }))} placeholder="yourname@upi" />
              </div>
              <div className="space-y-2">
                <Label>Payee Name</Label>
                <Input value={upiData.name} onChange={e => setUpiData(prev => ({ ...prev, name: e.target.value }))} placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label>Amount (optional)</Label>
                <Input type="number" value={upiData.amount} onChange={e => setUpiData(prev => ({ ...prev, amount: e.target.value }))} placeholder="0.00" />
              </div>
            </TabsContent>
          </Tabs>

          {/* Customization */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Customize</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Size: {settings.size}px</Label>
                <Slider value={[settings.size]} onValueChange={([v]) => setSettings(prev => ({ ...prev, size: v }))} min={128} max={512} step={32} />
              </div>
              <div className="space-y-2">
                <Label>Margin: {settings.margin}</Label>
                <Slider value={[settings.margin]} onValueChange={([v]) => setSettings(prev => ({ ...prev, margin: v }))} min={0} max={8} step={1} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>QR Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={settings.darkColor} onChange={e => setSettings(prev => ({ ...prev, darkColor: e.target.value }))} className="h-10 w-10 rounded cursor-pointer" />
                    <Input value={settings.darkColor} onChange={e => setSettings(prev => ({ ...prev, darkColor: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background</Label>
                  <div className="flex gap-2">
                    <input type="color" value={settings.lightColor} onChange={e => setSettings(prev => ({ ...prev, lightColor: e.target.value }))} className="h-10 w-10 rounded cursor-pointer" />
                    <Input value={settings.lightColor} onChange={e => setSettings(prev => ({ ...prev, lightColor: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Error Correction</Label>
                <select 
                  className="w-full h-11 px-4 rounded-lg border border-border bg-secondary/50"
                  value={settings.errorCorrection} 
                  onChange={e => setSettings(prev => ({ ...prev, errorCorrection: e.target.value as QRSettings['errorCorrection'] }))}
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-6">
          <Card className="p-8 bg-white">
            <canvas ref={canvasRef} className="mx-auto" />
          </Card>
          
          <div className="flex gap-3">
            <Button variant="hero" onClick={downloadPNG}>
              <Download className="h-4 w-4 mr-2" /> Download PNG
            </Button>
            <Button variant="outline" onClick={downloadSVG}>
              <Download className="h-4 w-4 mr-2" /> Download SVG
            </Button>
          </div>

          {qrData && (
            <div className="w-full">
              <Label className="text-xs text-muted-foreground">QR Content Preview:</Label>
              <p className="text-xs text-muted-foreground bg-muted p-2 rounded mt-1 break-all">{qrData}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
