import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Image as ImageIcon, RefreshCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function JPGtoPNG() {
  const [images, setImages] = useState<Array<{
    id: string;
    name: string;
    original: string;
    converted: string | null;
    originalSize: number;
    convertedSize: number;
  }>>([]);
  const [isConverting, setIsConverting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({ title: `${file.name} is not an image`, variant: 'destructive' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ''),
          original: event.target?.result as string,
          converted: null,
          originalSize: file.size,
          convertedSize: 0,
        }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const convertToPNG = useCallback(async (imageData: string): Promise<{ blob: Blob; dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const dataUrl = canvas.toDataURL('image/png');
              resolve({ blob, dataUrl });
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/png'
        );
      };
      img.onerror = reject;
      img.src = imageData;
    });
  }, []);

  const handleConvertAll = async () => {
    if (images.length === 0) {
      toast({ title: 'Please add images first', variant: 'destructive' });
      return;
    }

    setIsConverting(true);
    
    try {
      const updatedImages = await Promise.all(
        images.map(async (image) => {
          if (image.converted) return image;
          
          const { blob, dataUrl } = await convertToPNG(image.original);
          return {
            ...image,
            converted: dataUrl,
            convertedSize: blob.size,
          };
        })
      );
      
      setImages(updatedImages);
      toast({ title: 'All images converted to PNG!' });
    } catch (error) {
      toast({ title: 'Error converting images', variant: 'destructive' });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (image: typeof images[0]) => {
    if (!image.converted) return;
    
    const link = document.createElement('a');
    link.href = image.converted;
    link.download = `${image.name}.png`;
    link.click();
    toast({ title: `${image.name}.png downloaded!` });
  };

  const handleDownloadAll = () => {
    images.forEach(image => {
      if (image.converted) {
        handleDownload(image);
      }
    });
  };

  const handleRemove = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, []);

  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Settings */}
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
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium mb-1">Drop JPG images here</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Select Images
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Why convert to PNG?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Lossless compression</li>
              <li>• Supports transparency</li>
              <li>• Better for graphics & text</li>
              <li>• No quality degradation</li>
            </ul>
          </div>

          {images.length > 0 && (
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handleConvertAll}
                disabled={isConverting}
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isConverting ? 'animate-spin' : ''}`} />
                Convert All to PNG
              </Button>
              
              {images.some(img => img.converted) && (
                <Button variant="outline" className="w-full" onClick={handleDownloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Image List */}
        <div className="lg:col-span-2 space-y-4">
          {images.length === 0 ? (
            <div className="h-64 flex items-center justify-center border rounded-xl bg-muted/30">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No images added yet</p>
                <p className="text-sm">Add JPG images to convert them to PNG</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 bg-background">
                  <div className="flex gap-4">
                    <img 
                      src={image.converted || image.original} 
                      alt={image.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{image.name}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Original (JPG)</p>
                          <p className="font-medium">{formatBytes(image.originalSize)}</p>
                        </div>
                        {image.converted && (
                          <div>
                            <p className="text-muted-foreground">Converted (PNG)</p>
                            <p className="font-medium text-primary">{formatBytes(image.convertedSize)}</p>
                          </div>
                        )}
                      </div>
                      {image.converted && (
                        <p className="text-xs text-green-600 mt-1">✓ Converted successfully</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {image.converted && (
                        <Button size="sm" onClick={() => handleDownload(image)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemove(image.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            All processing happens in your browser. Your images are never uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
