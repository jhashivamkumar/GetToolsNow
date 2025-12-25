import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Image as ImageIcon, GripVertical, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageFile {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export default function ImageToPDF() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  
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
        const img = new Image();
        img.onload = () => {
          setImages(prev => [...prev, {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            dataUrl: event.target?.result as string,
            width: img.width,
            height: img.height,
          }]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleRemove = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) return;

    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  const generatePDF = async () => {
    if (images.length === 0) {
      toast({ title: 'Please add at least one image', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);

    try {
      const { jsPDF } = await import('jspdf');
      
      // Page dimensions in mm
      const pageSizes = {
        a4: { width: 210, height: 297 },
        letter: { width: 215.9, height: 279.4 },
        fit: { width: 210, height: 297 }, // Default, will be adjusted
      };

      let pdfWidth = pageSizes[pageSize].width;
      let pdfHeight = pageSizes[pageSize].height;

      if (orientation === 'landscape') {
        [pdfWidth, pdfHeight] = [pdfHeight, pdfWidth];
      }

      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize === 'fit' ? [pdfWidth, pdfHeight] : pageSize,
      });

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        if (i > 0) {
          doc.addPage();
        }

        const contentWidth = pdfWidth - (margin * 2);
        const contentHeight = pdfHeight - (margin * 2);
        
        // Calculate image dimensions to fit page
        const imgAspect = image.width / image.height;
        const pageAspect = contentWidth / contentHeight;
        
        let imgWidth, imgHeight;
        
        if (imgAspect > pageAspect) {
          // Image is wider than page
          imgWidth = contentWidth;
          imgHeight = contentWidth / imgAspect;
        } else {
          // Image is taller than page
          imgHeight = contentHeight;
          imgWidth = contentHeight * imgAspect;
        }

        // Center the image
        const x = margin + (contentWidth - imgWidth) / 2;
        const y = margin + (contentHeight - imgHeight) / 2;

        doc.addImage(image.dataUrl, 'JPEG', x, y, imgWidth, imgHeight);
      }

      doc.save(`images-${Date.now()}.pdf`);
      toast({ title: 'PDF generated successfully!' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({ title: 'Error generating PDF', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
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
            <p className="font-medium mb-1">Drop images here</p>
            <p className="text-sm text-muted-foreground mb-4">JPG, PNG, WebP supported</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Select Images
            </Button>
          </div>

          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Page Size</Label>
              <Select value={pageSize} onValueChange={(v) => setPageSize(v as 'a4' | 'letter' | 'fit')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                  <SelectItem value="fit">Fit to Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Orientation</Label>
              <Select value={orientation} onValueChange={(v) => setOrientation(v as 'portrait' | 'landscape')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Margin: {margin}mm</Label>
              <input
                type="range"
                min="0"
                max="30"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>

          {images.length > 0 && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={generatePDF}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : `Generate PDF (${images.length} page${images.length > 1 ? 's' : ''})`}
            </Button>
          )}
        </div>

        {/* Image List */}
        <div className="lg:col-span-2 space-y-4">
          {images.length === 0 ? (
            <div className="h-64 flex items-center justify-center border rounded-xl bg-muted/30">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No images added yet</p>
                <p className="text-sm">Add images to create a PDF</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Drag to reorder. Each image will be on a separate page.
              </p>
              <div className="grid gap-3">
                {images.map((image, index) => (
                  <div 
                    key={image.id} 
                    className="border rounded-lg p-3 bg-background flex items-center gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                      >
                        ▲
                      </Button>
                      <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === images.length - 1}
                      >
                        ▼
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-muted-foreground w-8">
                        {index + 1}
                      </span>
                      <img 
                        src={image.dataUrl} 
                        alt={image.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{image.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {image.width} × {image.height} px
                      </p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemove(image.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="text-xs text-center text-muted-foreground">
            All processing happens in your browser. Your images are never uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}
