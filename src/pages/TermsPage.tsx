import { SEO } from '@/components/SEO';

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Read the terms and conditions for using ToolSprint's free online tools and services."
        canonical="/terms"
      />

      <div className="container py-12">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-4">Last updated: December 2024</p>

          <h2 className="text-xl font-bold mt-8 mb-4">Acceptance of Terms</h2>
          <p className="text-muted-foreground mb-4">
            By accessing and using ToolSprint, you accept and agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Use of Services</h2>
          <p className="text-muted-foreground mb-4">
            You may use our tools for personal and commercial purposes. You agree not to misuse our services or help anyone else do so.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            Content you create using our tools belongs to you. Our website design, logos, and tool implementations are our intellectual property.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Disclaimer</h2>
          <p className="text-muted-foreground mb-4">
            Our tools are provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of our services.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We may modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Contact</h2>
          <p className="text-muted-foreground mb-4">
            Questions about these terms? Contact us at legal@toolsprint.com.
          </p>
        </div>
      </div>
    </>
  );
}
