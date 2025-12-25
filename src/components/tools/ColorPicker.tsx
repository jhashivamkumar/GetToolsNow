import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Copy, Check, Pipette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToCmyk(r: number, g: number, b: number) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  
  const c = 1 - (r / 255);
  const m = 1 - (g / 255);
  const y = 1 - (b / 255);
  const k = Math.min(c, m, y);
  
  return {
    c: Math.round(((c - k) / (1 - k)) * 100),
    m: Math.round(((m - k) / (1 - k)) * 100),
    y: Math.round(((y - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  };
}

export default function ColorPicker() {
  const [color, setColor] = useState('#3B82F6');
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;

  const colorFormats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '' },
    { label: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '' },
    { label: 'CMYK', value: cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : '' },
  ];

  const copyToClipboard = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    toast({ title: `${label} copied!` });
    setTimeout(() => setCopied(null), 2000);
  };

  // Generate palette
  const generateShades = () => {
    if (!hsl) return [];
    const shades = [];
    for (let l = 95; l >= 5; l -= 10) {
      shades.push(`hsl(${hsl.h}, ${hsl.s}%, ${l}%)`);
    }
    return shades;
  };

  const generateComplementary = () => {
    if (!hsl) return [];
    return [
      `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    ];
  };

  const generateTriadic = () => {
    if (!hsl) return [];
    return [
      `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    ];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Color Picker */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Pipette className="h-4 w-4" />
              Pick a Color
            </Label>
            <div className="flex gap-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-0"
              />
              <div className="flex-1 space-y-2">
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="font-mono"
                />
                <div 
                  className="h-12 rounded-lg border"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          </div>

          {/* Color Formats */}
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Color Formats</h3>
            {colorFormats.map(format => (
              <div key={format.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground w-16">{format.label}</span>
                <code className="flex-1 text-sm font-mono bg-muted px-2 py-1 rounded">
                  {format.value}
                </code>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(format.value, format.label)}
                >
                  {copied === format.label ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </Card>
        </div>

        {/* Palettes */}
        <div className="space-y-4">
          {/* Shades */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Shades</h3>
            <div className="flex rounded-lg overflow-hidden">
              {generateShades().map((shade, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: shade }}
                  onClick={() => copyToClipboard(shade, 'Shade')}
                  title={shade}
                />
              ))}
            </div>
          </Card>

          {/* Complementary */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Complementary</h3>
            <div className="flex gap-2">
              {generateComplementary().map((c, i) => (
                <div
                  key={i}
                  className="flex-1 h-16 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: c }}
                  onClick={() => copyToClipboard(c, 'Color')}
                  title={c}
                />
              ))}
            </div>
          </Card>

          {/* Triadic */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Triadic</h3>
            <div className="flex gap-2">
              {generateTriadic().map((c, i) => (
                <div
                  key={i}
                  className="flex-1 h-16 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: c }}
                  onClick={() => copyToClipboard(c, 'Color')}
                  title={c}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Colors */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Quick Colors</h3>
        <div className="flex flex-wrap gap-2">
          {['#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899', '#000000', '#6B7280', '#FFFFFF'].map(c => (
            <button
              key={c}
              className="w-10 h-10 rounded-lg border-2 hover:scale-110 transition-transform"
              style={{ backgroundColor: c, borderColor: c === '#FFFFFF' ? '#e5e7eb' : c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
