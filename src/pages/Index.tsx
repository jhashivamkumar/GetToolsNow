import { Link } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/SEO';
import { FAQ, generateFAQSchema } from '@/components/FAQ';
import { AdSlot } from '@/components/AdSlot';
import { ToolCard } from '@/components/ToolCard';
import { CategoryCard } from '@/components/CategoryCard';
import { categories, getPopularTools, getNewTools, tools } from '@/data/tools';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const homeFaqs = [
  { q: "Are all tools really free?", a: "Yes! All tools on GetToolsNow are completely free to use with no hidden fees or subscriptions required." },
  { q: "Do I need to create an account?", a: "No account is needed. Simply use any tool directly without signing up." },
  { q: "Is my data safe?", a: "Absolutely. Most of our tools process data locally in your browser. We never store your files on our servers." },
  { q: "Can I use these tools for commercial purposes?", a: "Yes, you can use our tools for both personal and commercial projects without any restrictions." },
  { q: "How often are new tools added?", a: "We regularly add new tools based on user feedback. Check back often for the latest additions!" },
];

const testimonials = [
  { name: "Priya Sharma", role: "HR Manager", text: "The letter generator saved me hours of work. Perfect for Indian businesses!", avatar: "PS" },
  { name: "Rahul Verma", role: "Freelancer", text: "I use the invoice generator daily. The GST calculation feature is amazing.", avatar: "RV" },
  { name: "Anita Patel", role: "Job Seeker", text: "Created my ATS-friendly resume in minutes. Got interview calls within a week!", avatar: "AP" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const popularTools = getPopularTools();
  const newTools = getNewTools();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({
        title: "Thanks for subscribing!",
        description: "You'll be notified when we launch new tools and features.",
      });
      setEmail('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <SEO
        title="Free Online Tools & Generators"
        description="GetToolsNow offers 30+ free online tools including resume builder, invoice generator, QR code maker, image compressor, and more. No signup required!"
        canonical="/"
        jsonLd={generateFAQSchema(homeFaqs)}
      />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="container relative z-10 text-center py-20">
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            <Sparkles className="h-3 w-3 mr-1" /> 30+ Free Tools • No Signup Required
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            Free Online Tools for
            <span className="block gradient-text">Everyone</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Create resumes, generate invoices, compress images, and more — all free, fast, and secure in your browser.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools... (e.g., resume, invoice, QR code)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-32 text-lg rounded-2xl"
              />
              <Button type="submit" variant="hero" size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl">
                Search
              </Button>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularTools.slice(0, 4).map(tool => (
              <Link key={tool.slug} to={`/tool/${tool.slug}`}>
                <Badge variant="outline" className="hover:bg-secondary cursor-pointer transition-colors">
                  {tool.title.split(' ')[0]}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-y border-border bg-card/50 py-6">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="h-5 w-5 text-primary" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" />
              <span>No Signup</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Always Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect tool for your needs across our organized categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Ad Slot */}
      <div className="container">
        <AdSlot type="banner" className="my-8" />
      </div>

      {/* Popular Tools */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Tools</h2>
              <p className="text-muted-foreground">Most used tools by our community</p>
            </div>
            <Link to="/tools">
              <Button variant="outline" className="hidden md:flex">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map(tool => (
              <ToolCard key={tool.slug} tool={tool} showCategory />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/tools">
              <Button variant="outline">
                View All Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Tools */}
      {newTools.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <div>
                <Badge variant="new" className="mb-2">Just Added</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">New Tools</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newTools.map(tool => (
                <ToolCard key={tool.slug} tool={tool} showCategory />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Thousands</h2>
            <p className="text-muted-foreground">See what our users have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 text-primary-foreground flex items-center justify-center font-bold mx-auto mb-4">
                  {testimonial.avatar}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container">
          <Card variant="gradient" className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Get notified when we launch new tools and features
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1" 
              />
              <Button type="submit" variant="hero">Subscribe</Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="container">
        <FAQ items={homeFaqs} />
      </section>

      {/* Ad Slot */}
      <div className="container">
        <AdSlot type="footer" className="my-8" />
      </div>
    </>
  );
};

export default Index;
