import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Zap, Users, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about ToolSprint - your go-to destination for free online tools. Our mission is to make productivity tools accessible to everyone."
        canonical="/about"
      />

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About ToolSprint</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            ToolSprint is your go-to destination for free, fast, and secure online tools. We believe that essential productivity tools should be accessible to everyone, without the burden of subscriptions or complex software installations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                All our tools are optimized for speed. Most processing happens right in your browser.
              </p>
            </Card>
            <Card>
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">100% Secure</h3>
              <p className="text-muted-foreground">
                Your data never leaves your device. We process everything locally for maximum privacy.
              </p>
            </Card>
            <Card>
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">User-Focused</h3>
              <p className="text-muted-foreground">
                Built based on real user feedback. We continuously improve based on your needs.
              </p>
            </Card>
            <Card>
              <Globe className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Always Free</h3>
              <p className="text-muted-foreground">
                No hidden fees, no subscriptions. Our tools are and will always be free to use.
              </p>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            We started ToolSprint with a simple mission: to provide high-quality, free online tools that help people work smarter, not harder. Whether you're a job seeker creating a resume, a freelancer generating invoices, or anyone needing quick utility tools, we've got you covered.
          </p>

          <h2 className="text-2xl font-bold mb-4">Privacy First</h2>
          <p className="text-muted-foreground">
            Unlike many online tools, we don't store your data on our servers. When you create a resume, generate an invoice, or compress an image, all the processing happens locally in your browser. Your files stay on your device, ensuring complete privacy and security.
          </p>
        </div>
      </div>
    </>
  );
}
