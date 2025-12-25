import { useParams, Link } from 'react-router-dom';
import { getBlogPost, blogPosts } from '@/data/blog';
import { getToolBySlug } from '@/data/tools';
import { SEO, generateBreadcrumbSchema, generateArticleSchema } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToolCard } from '@/components/ToolCard';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug || '');

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog">
          <Button>Browse Blog</Button>
        </Link>
      </div>
    );
  }

  const relatedTools = post.relatedTools
    .map(slug => getToolBySlug(slug))
    .filter(Boolean);

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: post.title },
  ];

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        article={{
          publishedTime: post.date,
          author: post.author,
          tags: post.tags,
        }}
        jsonLd={[
          generateBreadcrumbSchema(breadcrumbItems.map(b => ({ name: b.label, url: b.href || `/blog/${post.slug}` }))),
          generateArticleSchema({
            title: post.title,
            description: post.description,
            author: post.author,
            publishedTime: post.date,
          }),
        ]}
      />

      <div className="container py-12">
        <Breadcrumbs items={breadcrumbItems} />

        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </header>

          {/* Content */}
          <Card className="mb-8">
            <div className="prose prose-invert max-w-none">
              {post.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={i} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
                }
                if (line.match(/^\d+\. /)) {
                  return <li key={i} className="text-muted-foreground ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
                }
                if (line.trim() === '') {
                  return <br key={i} />;
                }
                return <p key={i} className="text-muted-foreground mb-3">{line}</p>;
              })}
            </div>
          </Card>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Related Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedTools.map(tool => tool && (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* Back Link */}
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </article>
      </div>
    </>
  );
}
