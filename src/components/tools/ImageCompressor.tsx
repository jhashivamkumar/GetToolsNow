import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload, Download, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import imageCompression from 'browser-image-compression';

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  preview: string;
}

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isProcessing, setIsProcessing] = useState(false);

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
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const results = await Promise.all(files.map(compressImage));
      setImages(prev => [...prev, ...results]);
      toast({ title: `${files.length} image(s) compressed!` });
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
      toast({ title: `${files.length} image(s) compressed!` });
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
    toast({ title: 'All images downloaded!' });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  const totalSaved = images.reduce((acc, img) => acc + (img.originalSize - img.compressedSize), 0);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Compression Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quality: {quality}%</Label>
                <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={10} max={100} step={5} />
                <p className="text-xs text-muted-foreground">Lower quality = smaller file size</p>
              </div>
              <div className="space-y-2">
                <Label>Max Width: {maxWidth}px</Label>
                <Slider value={[maxWidth]} onValueChange={([v]) => setMaxWidth(v)} min={640} max={4096} step={128} />
                <p className="text-xs text-muted-foreground">Images wider than this will be resized</p>
              </div>
            </div>
          </Card>

          {images.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images:</span>
                  <span>{images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Saved:</span>
                  <span className="text-success font-medium">{formatSize(totalSaved)}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="hero" size="sm" onClick={downloadAll} className="flex-1">
                  <Download className="h-4 w-4 mr-2" /> Download All
                </Button>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Upload & Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className={`border-2 border-dashed border-border rounded-xl p-12 text-center transition-colors ${isProcessing ? 'opacity-50' : 'hover:border-primary cursor-pointer'}`}
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
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                {isProcessing ? 'Processing...' : 'Drop images here or click to upload'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WebP • Max 20MB per file
              </p>
            </label>
          </div>

          {/* Results */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((image, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video bg-muted relative">
                    <img src={image.preview} alt="Compressed" className="w-full h-full object-cover" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm truncate mb-2">{image.original.name}</p>
                    <div className="flex justify-between text-sm text-muted-foreground mb-3">
                      <span>{formatSize(image.originalSize)} → {formatSize(image.compressedSize)}</span>
                      <span className="text-success font-medium">-{calculateSavings(image.originalSize, image.compressedSize)}%</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => downloadImage(image)}>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No images compressed yet</p>
              <p className="text-sm">Upload images to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
