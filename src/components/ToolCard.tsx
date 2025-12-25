import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tool, categories } from '@/data/tools';
import { useFavorites } from '@/hooks/useLocalStorage';

interface ToolCardProps {
  tool: Tool;
  showCategory?: boolean;
}

export function ToolCard({ tool, showCategory = false }: ToolCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const category = categories.find(c => c.slug === tool.category);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  return (
    <Card variant="interactive" className="group relative overflow-hidden">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(tool.slug);
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isFavorite(tool.slug) ? 'text-destructive fill-destructive' : 'text-muted-foreground'
          }`}
        />
      </button>

      <Link to={`/tool/${tool.slug}`} className="block">
        {/* Icon & Badges */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category?.color || 'from-primary to-cyan-400'} text-primary-foreground flex items-center justify-center shadow-lg`}>
            {getIcon(tool.icon)}
          </div>
          <div className="flex flex-wrap gap-2">
            {tool.popular && <Badge variant="popular">Popular</Badge>}
            {tool.new && <Badge variant="new">New</Badge>}
          </div>
        </div>

        {/* Content */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {tool.shortDesc}
        </p>

        {/* Category & Action */}
        <div className="flex items-center justify-between">
          {showCategory && category && (
            <span className="text-xs text-muted-foreground">{category.name}</span>
          )}
          <span className="flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
            Use Tool <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
