import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Clock, Star } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { tools, categories } from '@/data/tools';
import { useFavorites, useRecentlyUsed } from '@/hooks/useLocalStorage';
import * as Icons from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { favorites, isFavorite } = useFavorites();
  const { recentlyUsed } = useRecentlyUsed();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return tools
      .filter(
        tool =>
          tool.title.toLowerCase().includes(lowerQuery) ||
          tool.shortDesc.toLowerCase().includes(lowerQuery) ||
          tool.category.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8);
  }, [query]);

  const recentTools = useMemo(() => {
    return recentlyUsed
      .map(slug => tools.find(t => t.slug === slug))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyUsed]);

  const favoriteTools = useMemo(() => {
    return favorites
      .map(slug => tools.find(t => t.slug === slug))
      .filter(Boolean)
      .slice(0, 4);
  }, [favorites]);

  const handleSelect = (slug: string) => {
    navigate(`/tool/${slug}`);
    onClose();
    setQuery('');
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            placeholder="Search tools..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="border-0 focus:ring-0 h-14 text-lg bg-transparent"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() ? (
            results.length > 0 ? (
              <div className="space-y-2">
                {results.map(tool => (
                  <button
                    key={tool.slug}
                    onClick={() => handleSelect(tool.slug)}
                    className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors group text-left"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      {getIcon(tool.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tool.title}</span>
                        {isFavorite(tool.slug) && (
                          <Star className="h-3 w-3 text-primary fill-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {tool.shortDesc}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No tools found for "{query}"
              </p>
            )
          ) : (
            <div className="space-y-6">
              {recentTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Recently Used</span>
                  </div>
                  <div className="space-y-1">
                    {recentTools.map(tool => tool && (
                      <button
                        key={tool.slug}
                        onClick={() => handleSelect(tool.slug)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                      >
                        <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                          {getIcon(tool.icon)}
                        </div>
                        <span className="font-medium">{tool.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {favoriteTools.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Star className="h-4 w-4" />
                    <span>Favorites</span>
                  </div>
                  <div className="space-y-1">
                    {favoriteTools.map(tool => tool && (
                      <button
                        key={tool.slug}
                        onClick={() => handleSelect(tool.slug)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                      >
                        <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                          {getIcon(tool.icon)}
                        </div>
                        <span className="font-medium">{tool.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category.slug}
                      onClick={() => {
                        navigate(`/tools/${category.slug}`);
                        onClose();
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                    >
                      {getIcon(category.icon)}
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">Enter</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd> Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
