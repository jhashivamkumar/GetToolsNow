import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blogPosts, getRecentPosts } from '@/data/blog';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const recentPosts = getRecentPosts(20);

  return (
    <>
      <SEO
        title="Blog - Tips, Guides & Tutorials"
        description="Explore our blog for helpful tips, guides, and tutorials on using our free online tools effectively."
        canonical="/blog"
      />

      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tips, guides, and tutorials to help you get the most out of our tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`}>
              <Card variant="interactive" className="h-full">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
