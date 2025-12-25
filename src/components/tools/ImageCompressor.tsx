import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Image as ImageIcon, Trash2, Zap, Info, Settings, CheckCircle2, ArrowDown, Sparkles, HardDrive } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  preview: string;
}

const qualityPresets = [
  { label: 'Max Quality', value: 95, icon: '🎨' },
  { label: 'Balanced', value: 80, icon: '⚖️' },
  { label: 'Web Optimized', value: 60, icon: '🌐' },
  { label: 'Smallest Size', value: 40, icon: '📦' },
];

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const calculateSavings = (original: number, compressed: number) => {
    const saved = ((original - compressed) / original) * 100;
    return saved.toFixed(1);
  };

  const compressImage = async (file: File): Promise<CompressedImage> => {
    const options = {
      maxSizeMB: 10,
      maxWidthOrHeight: maxWidth,
      useWebWorker: true,
      initialQuality: quality / 100,
    };

    const compressed = await imageCompression(file, options);
    const preview = URL.createObjectURL(compressed);

    return {
      original: file,
      compressed,
      originalSize: file.size,
      compressedSize: compressed.size,
      preview,
    };
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const results = await Promise.all(files.map(compressImage));
      setImages(prev => [...prev, ...results]);
      toast({ title: `✅ ${files.length} image(s) compressed!` });
    } catch (err) {
      toast({ title: 'Error compressing images', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  }, [quality, maxWidth]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const results = await Promise.all(files.map(compressImage));
      setImages(prev => [...prev, ...results]);
      toast({ title: `✅ ${files.length} image(s) compressed!` });
    } catch (err) {
      toast({ title: 'Error compressing images', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.preview;
    link.download = `compressed-${image.original.name}`;
    link.click();
  };

  const downloadAll = () => {
    images.forEach(downloadImage);
    toast({ title: '✅ All images downloaded!' });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  const totalOriginal = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalCompressed = images.reduce((acc, img) => acc + img.compressedSize, 0);
  const totalSaved = totalOriginal - totalCompressed;

  return (
    <div className="p-4 md:p-6">
      {/* Pro Tips */}
      <Card variant="glass" className="mb-6 p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">Compression Tips</h4>
          <p className="text-xs text-muted-foreground">
            Use 60-80% quality for web images. Photos can handle more compression than graphics with text. All processing happens locally in your browser.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <Card variant="gradient" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Compression Settings</h3>
            </div>

            {/* Quality Presets */}
            <div className="mb-5">
              <Label className="text-xs text-muted-foreground mb-2 block">Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {qualityPresets.map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => setQuality(preset.value)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      quality === preset.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-lg">{preset.icon}</span>
                    <p className="text-xs font-medium mt-1">{preset.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Quality</Label>
                  <Badge variant="secondary">{quality}%</Badge>
                </div>
                <Slider 
                  value={[quality]} 
                  onValueChange={([v]) => setQuality(v)} 
                  min={10} 
                  max={100} 
                  step={5}
                  className="py-2"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Lower = smaller file, higher = better quality</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Max Width</Label>
                  <Badge variant="secondary">{maxWidth}px</Badge>
                </div>
                <Slider 
                  value={[maxWidth]} 
                  onValueChange={([v]) => setMaxWidth(v)} 
                  min={640} 
                  max={4096} 
                  step={128}
                  className="py-2"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Larger images will be resized</p>
              </div>
            </div>
          </Card>

          {images.length > 0 && (
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Summary</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Images</span>
                  <span className="font-medium">{images.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Size</span>
                  <span>{formatSize(totalOriginal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Compressed Size</span>
                  <span>{formatSize(totalCompressed)}</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Saved</span>
                    <Badge variant="success" className="text-sm">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      {formatSize(totalSaved)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <Button 
                  onClick={downloadAll} 
                  className="flex-1 gap-2 bg-gradient-to-r from-primary to-cyan-500"
                >
                  <Download className="h-4 w-4" /> Download All
                </Button>
                <Button variant="outline" size="icon" onClick={clearAll}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Zap, label: 'Fast' },
              { icon: HardDrive, label: 'Local' },
              { icon: Sparkles, label: 'Free' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/30">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upload & Results */}
        <div className="lg:col-span-2 space-y-5">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              dragActive 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : isProcessing 
                  ? 'opacity-50 border-border' 
                  : 'border-border hover:border-primary/50 hover:bg-secondary/30'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
              disabled={isProcessing}
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                dragActive ? 'bg-primary/20' : 'bg-secondary'
              }`}>
                {isProcessing ? (
                  <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className={`h-8 w-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
              </div>
              <p className="text-lg font-medium mb-2">
                {isProcessing ? 'Processing...' : dragActive ? 'Drop images here!' : 'Drop images or click to upload'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WebP • Batch upload supported
              </p>
            </label>
          </div>

          {/* Results */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((image, index) => (
                <Card key={index} variant="glass" className="overflow-hidden group">
                  <div className="aspect-video bg-secondary relative overflow-hidden">
                    <img src={image.preview} alt="Compressed" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Badge 
                      variant="success" 
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      -{calculateSavings(image.originalSize, image.compressedSize)}%
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm truncate mb-2" title={image.original.name}>
                      {image.original.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <span className="line-through">{formatSize(image.originalSize)}</span>
                        <ArrowDown className="h-3 w-3 text-primary" />
                        <span className="text-foreground font-medium">{formatSize(image.compressedSize)}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                        Compressed
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => downloadImage(image)}>
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <Card variant="glass" className="py-16 text-center">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground font-medium">No images compressed yet</p>
              <p className="text-sm text-muted-foreground mt-1">Upload images to get started</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}