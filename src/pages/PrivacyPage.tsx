import { SEO } from '@/components/SEO';

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how ToolSprint handles your data. We prioritize your privacy with browser-based processing and no data storage."
        canonical="/privacy"
      />

      <div className="container py-12">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-4">Last updated: December 2024</p>

          <h2 className="text-xl font-bold mt-8 mb-4">Introduction</h2>
          <p className="text-muted-foreground mb-4">
            At ToolSprint, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our website and tools.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Data We Collect</h2>
          <p className="text-muted-foreground mb-4">
            <strong>Local Processing:</strong> Most of our tools process data entirely in your browser. This means your files, documents, and personal information never leave your device.
          </p>
          <p className="text-muted-foreground mb-4">
            <strong>Analytics:</strong> We may collect anonymous usage data to improve our services, such as which tools are most popular and how users navigate our site.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Cookies</h2>
          <p className="text-muted-foreground mb-4">
            We use cookies to enhance your experience, including remembering your preferences and favorites. You can disable cookies in your browser settings.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Third-Party Services</h2>
          <p className="text-muted-foreground mb-4">
            We may use third-party services for analytics and advertising. These services have their own privacy policies.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement appropriate security measures to protect any data we collect. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy, please contact us at calculatorsolution@gmail.com.
          </p>
        </div>
      </div>
    </>
  );
}
