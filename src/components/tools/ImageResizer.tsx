import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Image as ImageIcon, Lock, Unlock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PRESETS = [
  { name: 'Custom', width: 0, height: 0 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Post', width: 1200, height: 630 },
  { name: 'Twitter Post', width: 1200, height: 675 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'HD (1280x720)', width: 1280, height: 720 },
  { name: 'Full HD (1920x1080)', width: 1920, height: 1080 },
  { name: '4K (3840x2160)', width: 3840, height: 2160 },
  { name: 'Passport Photo', width: 600, height: 600 },
];

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState('Custom');
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(90);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aspectRatio = useRef(1);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        aspectRatio.current = img.width / img.height;
        setImage(event.target?.result as string);
        setSelectedPreset('Custom');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (lockAspectRatio && aspectRatio.current) {
      setHeight(Math.round(newWidth / aspectRatio.current));
    }
    setSelectedPreset('Custom');
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (lockAspectRatio && aspectRatio.current) {
      setWidth(Math.round(newHeight * aspectRatio.current));
    }
    setSelectedPreset('Custom');
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    const presetData = PRESETS.find(p => p.name === preset);
    if (presetData && presetData.width > 0) {
      setWidth(presetData.width);
      setHeight(presetData.height);
      setLockAspectRatio(false);
    }
  };

  const handleResize = () => {
    if (!image || width <= 0 || height <= 0) {
      toast({ title: 'Please set valid dimensions', variant: 'destructive' });
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      
      const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
      const qualityValue = format === 'png' ? 1 : quality / 100;
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}-${width}x${height}.${format}`;
          link.click();
          URL.revokeObjectURL(url);
          toast({ title: 'Image resized and downloaded!' });
        }
      }, mimeType, qualityValue);
    };
    img.src = image;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, []);

  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              image ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {image ? (
              <div className="space-y-4">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="max-h-64 mx-auto rounded-lg shadow-lg"
                />
                <p className="text-sm text-muted-foreground">
                  Original: {originalWidth} × {originalHeight}px
                </p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Drop an image here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
              </div>
            )}
          </div>

          {/* Resize Controls */}
          {image && (
            <div className="space-y-6">
              {/* Preset */}
              <div>
                <Label>Preset Sizes</Label>
                <Select value={selectedPreset} onValueChange={handlePresetChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name} {preset.width > 0 && `(${preset.width}×${preset.height})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Width (px)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10000"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Lock Aspect Ratio */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {lockAspectRatio ? (
                    <Lock className="h-4 w-4 text-primary" />
                  ) : (
                    <Unlock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label>Lock Aspect Ratio</Label>
                </div>
                <Switch
                  checked={lockAspectRatio}
                  onCheckedChange={(checked) => {
                    setLockAspectRatio(checked);
                    if (checked) {
                      aspectRatio.current = width / height;
                    }
                  }}
                />
              </div>

              {/* Format */}
              <div>
                <Label>Output Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as 'png' | 'jpeg' | 'webp')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG (smaller file size)</SelectItem>
                    <SelectItem value="png">PNG (lossless)</SelectItem>
                    <SelectItem value="webp">WebP (best compression)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quality (for JPEG/WebP) */}
              {format !== 'png' && (
                <div>
                  <Label>Quality: {quality}%</Label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preview & Download */}
        <div className="space-y-6">
          {image && (
            <>
              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="font-semibold mb-4">New Dimensions</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-2xl font-bold text-primary">{width}</p>
                    <p className="text-sm text-muted-foreground">Width (px)</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-2xl font-bold text-primary">{height}</p>
                    <p className="text-sm text-muted-foreground">Height (px)</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>
                    Scale: {((width / originalWidth) * 100).toFixed(1)}% × {((height / originalHeight) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleResize}>
                <Download className="h-4 w-4 mr-2" />
                Resize & Download
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                All processing happens in your browser. Your images are never uploaded to any server.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
