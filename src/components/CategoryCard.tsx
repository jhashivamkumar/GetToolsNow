import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Category, getToolsByCategory } from '@/data/tools';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const tools = getToolsByCategory(category.slug);
  
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
  };

  return (
    <Link to={`/tools/${category.slug}`}>
      <Card variant="interactive" className="h-full group">
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${category.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
          {getIcon(category.icon)}
        </div>
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {category.description}
        </p>
        <span className="text-xs text-primary font-medium">
          {tools.length} tools →
        </span>
      </Card>
    </Link>
  );
}
