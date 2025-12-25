import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export default function GradientGenerator() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#3B82F6', position: 0 },
    { id: '2', color: '#8B5CF6', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const addColorStop = () => {
    const newPosition = 50;
    setColorStops([...colorStops, { 
      id: Date.now().toString(), 
      color: '#22C55E', 
      position: newPosition 
    }].sort((a, b) => a.position - b.position));
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter(s => s.id !== id));
    }
  };

  const updateColorStop = (id: string, field: 'color' | 'position', value: string | number) => {
    setColorStops(colorStops.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ).sort((a, b) => a.position - b.position));
  };

  const generateCSS = () => {
    const stops = colorStops.map(s => `${s.color} ${s.position}%`).join(', ');
    
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stops})`;
    } else {
      return `radial-gradient(circle, ${stops})`;
    }
  };

  const cssCode = generateCSS();
  const fullCSS = `background: ${cssCode};`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    toast({ title: 'CSS copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { name: 'Sunset', stops: [{ color: '#F97316', position: 0 }, { color: '#EC4899', position: 100 }] },
    { name: 'Ocean', stops: [{ color: '#06B6D4', position: 0 }, { color: '#3B82F6', position: 100 }] },
    { name: 'Forest', stops: [{ color: '#22C55E', position: 0 }, { color: '#14B8A6', position: 100 }] },
    { name: 'Purple Haze', stops: [{ color: '#8B5CF6', position: 0 }, { color: '#EC4899', position: 100 }] },
    { name: 'Fire', stops: [{ color: '#EF4444', position: 0 }, { color: '#F97316', position: 50 }, { color: '#EAB308', position: 100 }] },
    { name: 'Rainbow', stops: [{ color: '#EF4444', position: 0 }, { color: '#EAB308', position: 25 }, { color: '#22C55E', position: 50 }, { color: '#3B82F6', position: 75 }, { color: '#8B5CF6', position: 100 }] },
  ];

  const applyPreset = (stops: { color: string; position: number }[]) => {
    setColorStops(stops.map((s, i) => ({ ...s, id: i.toString() })));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Gradient Type</Label>
            <RadioGroup value={gradientType} onValueChange={(v) => setGradientType(v as 'linear' | 'radial')}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="linear" id="linear" />
                  <Label htmlFor="linear" className="font-normal">Linear</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="radial" id="radial" />
                  <Label htmlFor="radial" className="font-normal">Radial</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {gradientType === 'linear' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Angle</Label>
                <span className="font-semibold">{angle}°</span>
              </div>
              <Slider
                value={[angle]}
                onValueChange={([v]) => setAngle(v)}
                min={0}
                max={360}
                step={1}
              />
              <div className="flex flex-wrap gap-2">
                {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                  <Button
                    key={a}
                    variant={angle === a ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAngle(a)}
                  >
                    {a}°
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Color Stops</Label>
              <Button variant="outline" size="sm" onClick={addColorStop}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {colorStops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, 'color', e.target.value)}
                  className="w-28 font-mono text-sm"
                />
                <Input
                  type="number"
                  value={stop.position}
                  onChange={(e) => updateColorStop(stop.id, 'position', Number(e.target.value))}
                  min={0}
                  max={100}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColorStop(stop.id)}
                  disabled={colorStops.length <= 2}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card 
            className="h-64 rounded-xl"
            style={{ background: cssCode }}
          />
          
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Label>CSS Code</Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span className="ml-1">{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
            <code className="block text-sm font-mono bg-muted p-3 rounded overflow-x-auto">
              {fullCSS}
            </code>
          </Card>
        </div>
      </div>

      {/* Presets */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Presets</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {presets.map((preset) => {
            const presetGradient = `linear-gradient(90deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`;
            return (
              <button
                key={preset.name}
                className="h-16 rounded-lg hover:scale-105 transition-transform"
                style={{ background: presetGradient }}
                onClick={() => applyPreset(preset.stops)}
                title={preset.name}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
}
