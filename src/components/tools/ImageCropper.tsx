import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Image as ImageIcon, RotateCcw, Crop } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ASPECT_RATIOS = [
  { name: 'Free', value: 0 },
  { name: '1:1 (Square)', value: 1 },
  { name: '4:3 (Photo)', value: 4 / 3 },
  { name: '3:4 (Portrait)', value: 3 / 4 },
  { name: '16:9 (Widescreen)', value: 16 / 9 },
  { name: '9:16 (Story)', value: 9 / 16 },
  { name: '3:2 (Classic)', value: 3 / 2 },
  { name: '2:3 (Portrait)', value: 2 / 3 },
];

export default function ImageCropper() {
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [aspectRatio, setAspectRatio] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [fileName, setFileName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
        setImageSize({ width: img.width, height: img.height });
        setImage(event.target?.result as string);
        // Reset crop area to full image
        setCropArea({ x: 0, y: 0, width: 100, height: 100 });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAspectRatioChange = (ratio: string) => {
    const ratioValue = parseFloat(ratio);
    setAspectRatio(ratioValue);
    
    if (ratioValue > 0) {
      // Adjust crop area to match aspect ratio
      const containerAspect = imageSize.width / imageSize.height;
      const targetAspect = ratioValue;
      
      let newWidth = cropArea.width;
      let newHeight = cropArea.height;
      
      if (targetAspect > containerAspect) {
        // Wider than container
        newWidth = 80;
        newHeight = (newWidth * (imageSize.width / 100)) / targetAspect / (imageSize.height / 100) * 100;
      } else {
        // Taller than container
        newHeight = 80;
        newWidth = (newHeight * (imageSize.height / 100)) * targetAspect / (imageSize.width / 100) * 100;
      }
      
      setCropArea({
        x: (100 - newWidth) / 2,
        y: (100 - newHeight) / 2,
        width: Math.min(newWidth, 100),
        height: Math.min(newHeight, 100),
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'move' | 'resize') => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    if (dragType === 'move') {
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(100 - prev.width, prev.x + deltaX)),
        y: Math.max(0, Math.min(100 - prev.height, prev.y + deltaY)),
      }));
    } else if (dragType === 'resize') {
      setCropArea(prev => {
        let newWidth = Math.max(10, Math.min(100 - prev.x, prev.width + deltaX));
        let newHeight = Math.max(10, Math.min(100 - prev.y, prev.height + deltaY));
        
        if (aspectRatio > 0) {
          // Maintain aspect ratio
          const targetAspect = aspectRatio;
          const currentAspect = (newWidth * imageSize.width) / (newHeight * imageSize.height);
          
          if (currentAspect > targetAspect) {
            newWidth = (newHeight * imageSize.height * targetAspect) / imageSize.width;
          } else {
            newHeight = (newWidth * imageSize.width) / (targetAspect * imageSize.height);
          }
        }
        
        return {
          ...prev,
          width: Math.min(newWidth, 100 - prev.x),
          height: Math.min(newHeight, 100 - prev.y),
        };
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragType, dragStart, aspectRatio, imageSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCrop = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const cropX = (cropArea.x / 100) * img.width;
      const cropY = (cropArea.y / 100) * img.height;
      const cropWidth = (cropArea.width / 100) * img.width;
      const cropHeight = (cropArea.height / 100) * img.height;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
      );

      const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}-cropped.${format}`;
          link.click();
          URL.revokeObjectURL(url);
          toast({ title: 'Image cropped and downloaded!' });
        }
      }, mimeType, 0.95);
    };
    img.src = image;
  };

  const resetCrop = () => {
    setCropArea({ x: 0, y: 0, width: 100, height: 100 });
    setAspectRatio(0);
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

  const cropPixelWidth = Math.round((cropArea.width / 100) * imageSize.width);
  const cropPixelHeight = Math.round((cropArea.height / 100) * imageSize.height);

  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <div
            className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
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
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium mb-1">Drop an image here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </Button>
          </div>

          {image && (
            <>
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label>Aspect Ratio</Label>
                  <Select 
                    value={aspectRatio.toString()} 
                    onValueChange={handleAspectRatioChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIOS.map((ratio) => (
                        <SelectItem key={ratio.name} value={ratio.value.toString()}>
                          {ratio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Output Format</Label>
                  <Select value={format} onValueChange={(v) => setFormat(v as 'png' | 'jpeg' | 'webp')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Crop Size</p>
                <p className="text-lg font-bold">
                  {cropPixelWidth} × {cropPixelHeight} px
                </p>
              </div>

              <div className="space-y-3">
                <Button className="w-full" onClick={handleCrop}>
                  <Crop className="h-4 w-4 mr-2" />
                  Crop & Download
                </Button>
                <Button variant="outline" className="w-full" onClick={resetCrop}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Crop
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Crop Area */}
        <div className="lg:col-span-2">
          {image ? (
            <div 
              ref={containerRef}
              className="relative bg-muted rounded-xl overflow-hidden select-none"
              style={{ aspectRatio: `${imageSize.width}/${imageSize.height}` }}
            >
              <img 
                ref={imageRef}
                src={image} 
                alt="Crop preview"
                className="w-full h-full object-contain"
                draggable={false}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0">
                {/* Dark overlay outside crop area */}
                <div 
                  className="absolute bg-black/60"
                  style={{ top: 0, left: 0, right: 0, height: `${cropArea.y}%` }}
                />
                <div 
                  className="absolute bg-black/60"
                  style={{ 
                    top: `${cropArea.y + cropArea.height}%`, 
                    left: 0, 
                    right: 0, 
                    bottom: 0 
                  }}
                />
                <div 
                  className="absolute bg-black/60"
                  style={{ 
                    top: `${cropArea.y}%`, 
                    left: 0, 
                    width: `${cropArea.x}%`,
                    height: `${cropArea.height}%`
                  }}
                />
                <div 
                  className="absolute bg-black/60"
                  style={{ 
                    top: `${cropArea.y}%`, 
                    left: `${cropArea.x + cropArea.width}%`, 
                    right: 0,
                    height: `${cropArea.height}%`
                  }}
                />

                {/* Crop area */}
                <div
                  className="absolute border-2 border-white cursor-move"
                  style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white/30" />
                    ))}
                  </div>

                  {/* Corner handles */}
                  {['nw', 'ne', 'sw', 'se'].map((corner) => (
                    <div
                      key={corner}
                      className="absolute w-4 h-4 bg-white border-2 border-primary rounded-sm"
                      style={{
                        top: corner.includes('n') ? -8 : 'auto',
                        bottom: corner.includes('s') ? -8 : 'auto',
                        left: corner.includes('w') ? -8 : 'auto',
                        right: corner.includes('e') ? -8 : 'auto',
                        cursor: `${corner}-resize`,
                      }}
                    />
                  ))}

                  {/* Resize handle (bottom-right) */}
                  <div
                    className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full cursor-se-resize flex items-center justify-center"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, 'resize');
                    }}
                  >
                    <div className="w-2 h-2 border-r-2 border-b-2 border-white transform rotate-45 -translate-x-0.5 -translate-y-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center border rounded-xl bg-muted/30">
              <div className="text-center text-muted-foreground">
                <Crop className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No image selected</p>
                <p className="text-sm">Upload an image to start cropping</p>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground mt-4">
            Drag to move the crop area. Use the corner handle to resize.
          </p>
        </div>
      </div>
    </div>
  );
}
