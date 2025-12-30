import { useParams, Link } from 'react-router-dom';
import { getToolBySlug, getRelatedTools, categories } from '@/data/tools';
import { SEO, generateBreadcrumbSchema, generateSoftwareApplicationSchema, generateHowToSchema } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FAQ, generateFAQSchema } from '@/components/FAQ';
import { AdSlot } from '@/components/AdSlot';
import { ToolCard } from '@/components/ToolCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Share2, CheckCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useFavorites, useRecentlyUsed } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';
import type { ComponentType } from 'react';
import { toast } from '@/hooks/use-toast';

// Tool Components
import ResumeBuilder from '@/components/tools/ResumeBuilder';
import InvoiceGenerator from '@/components/tools/InvoiceGenerator';
import QRCodeGenerator from '@/components/tools/QRCodeGenerator';
import ImageCompressor from '@/components/tools/ImageCompressor';
import LetterGenerator from '@/components/tools/LetterGenerator';

// Image Tools
import ImageResizer from '@/components/tools/ImageResizer';
import PNGtoJPG from '@/components/tools/PNGtoJPG';
import JPGtoPNG from '@/components/tools/JPGtoPNG';
import WebPConverter from '@/components/tools/WebPConverter';
import ImageCropper from '@/components/tools/ImageCropper';
import ImageToPDF from '@/components/tools/ImageToPDF';
import BackgroundRemover from '@/components/tools/BackgroundRemover';

// Text tools
import WordCounter from '@/components/tools/WordCounter';
import TextCaseConverter from '@/components/tools/TextCaseConverter';
import LoremIpsumGenerator from '@/components/tools/LoremIpsumGenerator';
import TextDiffChecker from '@/components/tools/TextDiffChecker';
import CoverLetterGenerator from '@/components/tools/CoverLetterGenerator';
import LinkedInSummaryGenerator from '@/components/tools/LinkedInSummaryGenerator';

// Calculators
import EMICalculator from '@/components/tools/EMICalculator';
import SIPCalculator from '@/components/tools/SIPCalculator';
import AgeCalculator from '@/components/tools/AgeCalculator';
import PercentageCalculator from '@/components/tools/PercentageCalculator';
import SalaryCalculator from '@/components/tools/SalaryCalculator';
import GSTCalculator from '@/components/tools/GSTCalculator';

// Utilities
import PasswordGenerator from '@/components/tools/PasswordGenerator';
import JSONFormatter from '@/components/tools/JSONFormatter';
import Base64Encoder from '@/components/tools/Base64Encoder';
import BarcodeGenerator from '@/components/tools/BarcodeGenerator';
import ColorPicker from '@/components/tools/ColorPicker';
import GradientGenerator from '@/components/tools/GradientGenerator';
import URLEncoder from '@/components/tools/URLEncoder';
import HashGenerator from '@/components/tools/HashGenerator';
import UUIDGenerator from '@/components/tools/UUIDGenerator';

// International Tools
import InvoiceGeneratorGlobal from '@/components/tools/InvoiceGeneratorGlobal';
import VATCalculator from '@/components/tools/VATCalculator';
import SalaryCalculatorGlobal from '@/components/tools/SalaryCalculatorGlobal';
import CurrencyConverter from '@/components/tools/CurrencyConverter';
import TipCalculator from '@/components/tools/TipCalculator';

// Business Tools
import SalarySlipGenerator from '@/components/tools/SalarySlipGenerator';
import QuotationMaker from '@/components/tools/QuotationMaker';

const toolComponents: Record<string, ComponentType> = {
  'resume-builder': ResumeBuilder,
  'invoice-generator': InvoiceGenerator,
  'qr-code-generator': QRCodeGenerator,
  'image-compressor': ImageCompressor,
  'letter-generator': LetterGenerator,

  'word-counter': WordCounter,
  'text-case-converter': TextCaseConverter,
  'lorem-ipsum': LoremIpsumGenerator,
  'text-diff': TextDiffChecker,
  'cover-letter-generator': CoverLetterGenerator,
  'linkedin-summary': LinkedInSummaryGenerator,

  'emi-calculator': EMICalculator,
  'sip-calculator': SIPCalculator,
  'age-calculator': AgeCalculator,
  'percentage-calculator': PercentageCalculator,
  'salary-calculator': SalaryCalculator,
  'gst-calculator': GSTCalculator,

  'password-generator': PasswordGenerator,
  'json-formatter': JSONFormatter,
  'base64-encoder': Base64Encoder,
  'barcode-generator': BarcodeGenerator,
  'color-picker': ColorPicker,
  'gradient-generator': GradientGenerator,
  'url-encoder': URLEncoder,
  'hash-generator': HashGenerator,
  'uuid-generator': UUIDGenerator,

  'invoice-generator-global': InvoiceGeneratorGlobal,
  'vat-calculator': VATCalculator,
  'salary-calculator-global': SalaryCalculatorGlobal,
  'currency-converter': CurrencyConverter,
  'tip-calculator': TipCalculator,

  // Business Tools
  'salary-slip-generator': SalarySlipGenerator,
  'quotation-maker': QuotationMaker,

  // Image Tools
  'image-resizer': ImageResizer,
  'png-to-jpg': PNGtoJPG,
  'jpg-to-png': JPGtoPNG,
  'webp-converter': WebPConverter,
  'image-cropper': ImageCropper,
  'image-to-pdf': ImageToPDF,
  'background-remover': BackgroundRemover,
};

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug || '');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToRecent } = useRecentlyUsed();

  useEffect(() => {
    if (tool) {
      addToRecent(tool.slug);
    }
  }, [tool?.slug]);

  if (!tool) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-muted-foreground mb-6">The tool you're looking for doesn't exist.</p>
        <Link to="/tools">
          <Button>Browse All Tools</Button>
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.slug === tool.category);
  const relatedTools = getRelatedTools(tool.relatedSlugs).slice(0, 6);
  const ToolComponent = toolComponents[tool.slug];

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
  };

  const breadcrumbItems = [
    { label: 'Tools', href: '/tools' },
    { label: category?.name || '', href: `/tools/${tool.category}` },
    { label: tool.title },
  ];

  const handleShare = async () => {
    try {
      await navigator.share({
        title: tool.title,
        text: tool.shortDesc,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  return (
    <>
      <SEO
        title={tool.title}
        description={tool.shortDesc}
        canonical={`/tool/${tool.slug}`}
        jsonLd={[
          generateBreadcrumbSchema(breadcrumbItems.map((b, i) => ({ name: b.label, url: b.href || `/tool/${tool.slug}` }))),
          generateFAQSchema(tool.faqs),
          generateSoftwareApplicationSchema({
            name: tool.title,
            description: tool.shortDesc,
            category: category?.name || 'Utility',
            url: `/tool/${tool.slug}`
          }),
          generateHowToSchema({
            name: tool.title,
            steps: tool.howToSteps
          })
        ]}
      />

      <div className="container py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${category?.color || 'from-primary to-cyan-400'} text-white flex items-center justify-center shadow-lg`}>
                {getIcon(tool.icon)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{tool.title}</h1>
                  {tool.popular && <Badge variant="popular">Popular</Badge>}
                  {tool.new && <Badge variant="new">New</Badge>}
                </div>
                <p className="text-muted-foreground">{tool.shortDesc}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant={isFavorite(tool.slug) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleFavorite(tool.slug)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite(tool.slug) ? 'fill-current' : ''}`} />
                {isFavorite(tool.slug) ? 'Favorited' : 'Add to Favorites'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Sidebar Ad */}
          <div className="lg:w-72">
            <AdSlot type="sidebar" />
          </div>
        </div>

        {/* Tool Component */}
        <Card className="mb-8 overflow-hidden">
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">This tool is coming soon!</p>
              <Button variant="outline" onClick={() => toggleFavorite(tool.slug)}>
                <Heart className="h-4 w-4 mr-2" />
                Get Notified
              </Button>
            </div>
          )}
        </Card>

        {/* In-content Ad */}
        <AdSlot type="in-content" className="mb-8" />

        {/* How to Use */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">How to Use {tool.title}</h2>
          <ol className="space-y-3">
            {tool.howToSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* About */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">About This Tool</h2>
          <p className="text-muted-foreground leading-relaxed">{tool.longDesc}</p>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>No Registration</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Browser-Based</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Secure & Private</span>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        {tool.faqs.length > 0 && (
          <FAQ items={tool.faqs} title={`Frequently Asked Questions about ${tool.title}`} />
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map(t => (
                <ToolCard key={t.slug} tool={t} showCategory />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
