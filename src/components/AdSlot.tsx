import { cn } from '@/lib/utils';

type AdSlotType = 'banner' | 'sidebar' | 'in-content' | 'footer';

interface AdSlotProps {
  type: AdSlotType;
  className?: string;
}

const adSizes: Record<AdSlotType, { width: string; height: string; label: string }> = {
  banner: { width: 'w-full', height: 'h-24 md:h-28', label: 'Advertisement - 728x90' },
  sidebar: { width: 'w-full', height: 'h-64', label: 'Advertisement - 300x250' },
  'in-content': { width: 'w-full', height: 'h-32', label: 'Advertisement - Responsive' },
  footer: { width: 'w-full', height: 'h-24', label: 'Advertisement - 728x90' },
};

export function AdSlot({ type, className }: AdSlotProps) {
  const size = adSizes[type];

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/30 text-muted-foreground text-sm',
        size.width,
        size.height,
        className
      )}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Replace this div with actual ad code in production */}
      <span className="opacity-50">{size.label}</span>
    </div>
  );
}
