import { Link } from 'react-router-dom';
import { SEO, generateBreadcrumbSchema } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useFavorites } from '@/hooks/useLocalStorage';
import { tools } from '@/data/tools';
import { ToolCard } from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const favoritesTools = favorites
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean);

  const breadcrumbItems = [
    { label: 'Favorites', href: '/favorites' },
  ];

  return (
    <>
      <SEO
        title="Favorite Tools"
        description="Your saved favorite tools in ToolSprint. Quickly access the tools you use most."
        canonical="/favorites"
        jsonLd={generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Favorites', url: '/favorites' },
        ])}
      />

      <main className="container py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="flex items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary" />
              Favorite Tools
            </h1>
            <p className="text-muted-foreground mt-2">
              Your saved tools in one place.
            </p>
          </div>

          <Link to="/tools" className="hidden sm:block">
            <Button variant="outline">
              Browse Tools <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </header>

        {favoritesTools.length === 0 ? (
          <section>
            <Card variant="glass" className="p-10 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Tap the heart icon on any tool to save it here for quick access.
              </p>
              <Link to="/tools">
                <Button>
                  Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </section>
        ) : (
          <section aria-label="Favorite tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritesTools.map((tool) => (
                <ToolCard key={tool!.slug} tool={tool!} showCategory />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link to="/tools">
                <Button variant="outline">
                  Browse Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
