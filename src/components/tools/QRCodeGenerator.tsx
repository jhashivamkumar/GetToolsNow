import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Download, Link, Type, Wifi, User, CreditCard, Copy, Check, Palette, Sparkles, Zap, Info, RotateCcw } from 'lucide-react';
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

const colorPresets = [
  { name: 'Classic', dark: '#000000', light: '#ffffff' },
  { name: 'Ocean', dark: '#0891b2', light: '#ecfeff' },
  { name: 'Forest', dark: '#16a34a', light: '#f0fdf4' },
  { name: 'Sunset', dark: '#ea580c', light: '#fff7ed' },
  { name: 'Royal', dark: '#7c3aed', light: '#f5f3ff' },
  { name: 'Night', dark: '#22d3ee', light: '#0f172a' },
];

export default function QRCodeGenerator() {
  const [qrType, setQRType] = useState<QRType>('url');
  const [qrData, setQRData] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<QRSettings>({
    size: 280,
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
    setIsGenerating(true);
    
    if (content && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, content, {
        width: settings.size,
        margin: settings.margin,
        errorCorrectionLevel: settings.errorCorrection,
        color: {
          dark: settings.darkColor,
          light: settings.lightColor,
        },
      }).then(() => {
        setTimeout(() => setIsGenerating(false), 300);
      }).catch(err => {
        console.error('QR generation error:', err);
        setIsGenerating(false);
      });
    } else {
      setIsGenerating(false);
    }
  }, [qrType, urlData, textData, wifiData, vcardData, upiData, settings]);

  const downloadPNG = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      toast({ title: '✅ QR code downloaded as PNG!' });
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
      link.download = `qrcode-${Date.now()}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
      toast({ title: '✅ SVG downloaded!' });
    } catch (err) {
      console.error('SVG generation error:', err);
    }
  };

  const copyToClipboard = async () => {
    if (canvasRef.current) {
      try {
        const blob = await new Promise<Blob>((resolve) => {
          canvasRef.current!.toBlob((blob) => resolve(blob!), 'image/png');
        });
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        toast({ title: '✅ QR code copied to clipboard!' });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({ title: 'Failed to copy', description: 'Your browser may not support this feature', variant: 'destructive' });
      }
    }
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setSettings(prev => ({ ...prev, darkColor: preset.dark, lightColor: preset.light }));
  };

  const resetSettings = () => {
    setSettings({
      size: 280,
      margin: 2,
      errorCorrection: 'M',
      darkColor: '#000000',
      lightColor: '#ffffff',
    });
  };

  const tabIcons = {
    url: Link,
    text: Type,
    wifi: Wifi,
    vcard: User,
    upi: CreditCard,
  };

  return (
    <div className="p-4 md:p-6">
      {/* Quick Tips */}
      <Card variant="glass" className="mb-6 p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">Pro Tips</h4>
          <p className="text-xs text-muted-foreground">
            Use higher error correction (25-30%) if you plan to add a logo. Dark colors on light backgrounds work best for scanning.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Type Selector */}
          <Tabs value={qrType} onValueChange={(v) => setQRType(v as QRType)}>
            <TabsList className="w-full grid grid-cols-5 h-12">
              {(['url', 'text', 'wifi', 'vcard', 'upi'] as QRType[]).map(type => {
                const Icon = tabIcons[type];
                return (
                  <TabsTrigger 
                    key={type} 
                    value={type} 
                    className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline capitalize">{type === 'vcard' ? 'vCard' : type.toUpperCase()}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="url" className="mt-4 space-y-4 animate-fade-in">
              <Card variant="glass" className="p-4">
                <Label className="flex items-center gap-2 mb-3">
                  <Link className="h-4 w-4 text-primary" />
                  Website URL
                </Label>
                <Input 
                  value={urlData} 
                  onChange={e => setUrlData(e.target.value)} 
                  placeholder="https://example.com" 
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground mt-2">Enter any website URL to generate a scannable QR code</p>
              </Card>
            </TabsContent>

            <TabsContent value="text" className="mt-4 space-y-4 animate-fade-in">
              <Card variant="glass" className="p-4">
                <Label className="flex items-center gap-2 mb-3">
                  <Type className="h-4 w-4 text-primary" />
                  Plain Text
                </Label>
                <Textarea 
                  value={textData} 
                  onChange={e => setTextData(e.target.value)} 
                  placeholder="Enter any text, message, or note..." 
                  rows={4}
                  className="text-base resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">{textData.length} characters</p>
              </Card>
            </TabsContent>

            <TabsContent value="wifi" className="mt-4 space-y-4 animate-fade-in">
              <Card variant="glass" className="p-4 space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Wifi className="h-4 w-4 text-primary" />
                    Network Name (SSID)
                  </Label>
                  <Input value={wifiData.ssid} onChange={e => setWifiData(prev => ({ ...prev, ssid: e.target.value }))} placeholder="MyWiFi" />
                </div>
                <div>
                  <Label className="mb-2 block">Password</Label>
                  <Input type="password" value={wifiData.password} onChange={e => setWifiData(prev => ({ ...prev, password: e.target.value }))} placeholder="••••••••" />
                </div>
                <div>
                  <Label className="mb-2 block">Security Type</Label>
                  <select 
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={wifiData.encryption} 
                    onChange={e => setWifiData(prev => ({ ...prev, encryption: e.target.value }))}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Open Network</option>
                  </select>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="vcard" className="mt-4 animate-fade-in">
              <Card variant="glass" className="p-4">
                <Label className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4 text-primary" />
                  Contact Information
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs mb-1.5 block">Full Name</Label>
                    <Input value={vcardData.name} onChange={e => setVcardData(prev => ({ ...prev, name: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Phone</Label>
                    <Input value={vcardData.phone} onChange={e => setVcardData(prev => ({ ...prev, phone: e.target.value }))} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Email</Label>
                    <Input value={vcardData.email} onChange={e => setVcardData(prev => ({ ...prev, email: e.target.value }))} placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Company</Label>
                    <Input value={vcardData.company} onChange={e => setVcardData(prev => ({ ...prev, company: e.target.value }))} placeholder="Acme Inc" />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="upi" className="mt-4 animate-fade-in">
              <Card variant="glass" className="p-4 space-y-4">
                <Label className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  UPI Payment Details
                </Label>
                <div>
                  <Label className="text-xs mb-1.5 block">UPI ID</Label>
                  <Input value={upiData.upiId} onChange={e => setUpiData(prev => ({ ...prev, upiId: e.target.value }))} placeholder="yourname@upi" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Payee Name</Label>
                  <Input value={upiData.name} onChange={e => setUpiData(prev => ({ ...prev, name: e.target.value }))} placeholder="Your Name" />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block">Amount (₹) - Optional</Label>
                  <Input type="number" value={upiData.amount} onChange={e => setUpiData(prev => ({ ...prev, amount: e.target.value }))} placeholder="0.00" />
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Customization */}
          <Card variant="gradient" className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Customize Style</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={resetSettings} className="text-xs">
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>

            {/* Color Presets */}
            <div className="mb-5">
              <Label className="text-xs text-muted-foreground mb-2 block">Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`group relative px-3 py-1.5 rounded-full border transition-all ${
                      settings.darkColor === preset.dark && settings.lightColor === preset.light
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-4 w-4 rounded-full border border-border/50" 
                        style={{ background: `linear-gradient(135deg, ${preset.dark} 50%, ${preset.light} 50%)` }}
                      />
                      <span className="text-xs font-medium">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Size</Label>
                  <Badge variant="secondary" className="text-xs">{settings.size}px</Badge>
                </div>
                <Slider 
                  value={[settings.size]} 
                  onValueChange={([v]) => setSettings(prev => ({ ...prev, size: v }))} 
                  min={128} 
                  max={512} 
                  step={16}
                  className="py-2"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Margin</Label>
                  <Badge variant="secondary" className="text-xs">{settings.margin} blocks</Badge>
                </div>
                <Slider 
                  value={[settings.margin]} 
                  onValueChange={([v]) => setSettings(prev => ({ ...prev, margin: v }))} 
                  min={0} 
                  max={8} 
                  step={1}
                  className="py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-2 block">Foreground</Label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input 
                        type="color" 
                        value={settings.darkColor} 
                        onChange={e => setSettings(prev => ({ ...prev, darkColor: e.target.value }))} 
                        className="h-11 w-11 rounded-xl cursor-pointer border-2 border-border/50 overflow-hidden" 
                      />
                    </div>
                    <Input 
                      value={settings.darkColor} 
                      onChange={e => setSettings(prev => ({ ...prev, darkColor: e.target.value }))} 
                      className="font-mono text-sm uppercase"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs mb-2 block">Background</Label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={settings.lightColor} 
                      onChange={e => setSettings(prev => ({ ...prev, lightColor: e.target.value }))} 
                      className="h-11 w-11 rounded-xl cursor-pointer border-2 border-border/50 overflow-hidden" 
                    />
                    <Input 
                      value={settings.lightColor} 
                      onChange={e => setSettings(prev => ({ ...prev, lightColor: e.target.value }))} 
                      className="font-mono text-sm uppercase"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs mb-2 block">Error Correction Level</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'L', label: 'Low', percent: '7%' },
                    { value: 'M', label: 'Med', percent: '15%' },
                    { value: 'Q', label: 'High', percent: '25%' },
                    { value: 'H', label: 'Max', percent: '30%' },
                  ].map(level => (
                    <button
                      key={level.value}
                      onClick={() => setSettings(prev => ({ ...prev, errorCorrection: level.value as QRSettings['errorCorrection'] }))}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        settings.errorCorrection === level.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-sm font-semibold">{level.label}</div>
                      <div className="text-[10px] text-muted-foreground">{level.percent}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-6">
          {/* QR Preview Card */}
          <Card 
            variant="glass" 
            className="relative p-6 md:p-10 w-full max-w-md"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-[80px] -z-10" />

            <div className="text-center mb-4">
              <Badge variant="secondary" className="mb-2">
                <Zap className="h-3 w-3 mr-1" />
                Live Preview
              </Badge>
            </div>

            <div 
              className={`relative mx-auto rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                isGenerating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
              }`}
              style={{ 
                background: settings.lightColor,
                width: 'fit-content'
              }}
            >
              <canvas ref={canvasRef} className="block" />
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                  <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>{settings.size}×{settings.size}px</span>
              <span>•</span>
              <span>Error: {settings.errorCorrection}</span>
            </div>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <Button 
              size="lg" 
              onClick={downloadPNG}
              className="flex-1 min-w-[140px] bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Download className="h-4 w-4 mr-2" /> Download PNG
            </Button>
            <Button variant="outline" size="lg" onClick={downloadSVG} className="flex-1 min-w-[140px]">
              <Download className="h-4 w-4 mr-2" /> Download SVG
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={copyToClipboard}
              className="flex-1 min-w-[140px]"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          {/* Content Preview */}
          {qrData && (
            <Card variant="glass" className="w-full p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <Label className="text-sm font-medium">Encoded Content</Label>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground break-all font-mono leading-relaxed">{qrData}</p>
              </div>
            </Card>
          )}

          {/* Features highlight */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {[
              { icon: Zap, label: 'Instant Generation' },
              { icon: Download, label: 'PNG & SVG Export' },
              { icon: Palette, label: 'Custom Colors' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}