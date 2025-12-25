import { useParams, Link } from 'react-router-dom';
import { categories, getToolsByCategory } from '@/data/tools';
import { SEO, generateBreadcrumbSchema } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const category = categories.find(c => c.slug === categorySlug);
  const tools = getToolsByCategory(categorySlug || '');

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <Link to="/tools">
          <Button>Browse All Tools</Button>
        </Link>
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-10 w-10" /> : null;
  };

  const breadcrumbItems = [
    { label: 'Tools', href: '/tools' },
    { label: category.name },
  ];

  return (
    <>
      <SEO
        title={`${category.name} Tools`}
        description={category.description}
        canonical={`/tools/${category.slug}`}
        jsonLd={generateBreadcrumbSchema(breadcrumbItems.map(b => ({ name: b.label, url: b.href || `/tools/${category.slug}` })))}
      />

      <div className="container py-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${category.color} text-white flex items-center justify-center shadow-lg`}>
            {getIcon(category.icon)}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
            <p className="text-sm text-muted-foreground mt-1">{tools.length} tools available</p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </>
  );
}
