import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setProcessedImage(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);

    try {
      // Simple background removal using canvas
      // This creates a basic transparent version by removing white/light backgrounds
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalImage;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample corners to determine background color
      const corners = [
        { x: 0, y: 0 },
        { x: canvas.width - 1, y: 0 },
        { x: 0, y: canvas.height - 1 },
        { x: canvas.width - 1, y: canvas.height - 1 },
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(corner => {
        const idx = (corner.y * canvas.width + corner.x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR = Math.round(bgR / 4);
      bgG = Math.round(bgG / 4);
      bgB = Math.round(bgB / 4);

      // Tolerance for background detection
      const tolerance = 50;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Check if pixel is similar to background color
        const diffR = Math.abs(r - bgR);
        const diffG = Math.abs(g - bgG);
        const diffB = Math.abs(b - bgB);
        
        if (diffR < tolerance && diffG < tolerance && diffB < tolerance) {
          // Make transparent with smooth edges
          const avgDiff = (diffR + diffG + diffB) / 3;
          const alpha = Math.min(255, avgDiff * (255 / tolerance));
          data[i + 3] = alpha;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      const processedDataUrl = canvas.toDataURL('image/png');
      setProcessedImage(processedDataUrl);
      toast({ title: 'Background removed!' });
    } catch (error) {
      console.error('Error removing background:', error);
      toast({ title: 'Error processing image', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `${fileName}-no-bg.png`;
    link.click();
    toast({ title: 'Image downloaded!' });
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
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              originalImage ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
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
            
            {originalImage ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                  <span className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    Original
                  </span>
                </div>
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

          {originalImage && !processedImage && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={removeBackground}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Remove Background'
              )}
            </Button>
          )}

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Tips for best results:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use images with solid color backgrounds</li>
              <li>• High contrast between subject and background works best</li>
              <li>• Simple backgrounds (white, solid colors) work great</li>
              <li>• Portrait and product photos work well</li>
            </ul>
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          <h3 className="font-semibold">Result</h3>
          
          {processedImage ? (
            <div className="space-y-4">
              <div 
                className="relative rounded-xl overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                }}
              >
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="max-h-80 mx-auto"
                />
                <span className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  Transparent
                </span>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setProcessedImage(null);
                    setOriginalImage(null);
                    setFileName('');
                  }}
                >
                  Start Over
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border rounded-xl bg-muted/30">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Processed image will appear here</p>
                <p className="text-sm">Upload an image and click "Remove Background"</p>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground">
            All processing happens in your browser. Your images are never uploaded to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
