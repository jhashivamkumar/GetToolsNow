import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';
import { ToolCard } from '@/components/ToolCard';
import { CategoryCard } from '@/components/CategoryCard';
import { tools, categories, searchTools } from '@/data/tools';

export default function ToolsPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools;
    return searchTools(query);
  }, [query]);

  return (
    <>
      <SEO
        title="All Free Online Tools"
        description="Browse our complete collection of 30+ free online tools. From resume builders to image compressors, find the perfect tool for your needs."
        canonical="/tools"
      />

      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">All Tools</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Browse our complete collection of free online tools
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
        </div>

        {/* Categories (only show when not searching) */}
        {!query.trim() && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </section>
        )}

        {/* Tools */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {query.trim() ? `Results for "${query}"` : 'All Tools'}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredTools.length} tools
            </span>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.slug} tool={tool} showCategory />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found for "{query}"</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
