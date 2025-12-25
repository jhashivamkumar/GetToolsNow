import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    tools: [
      { href: '/tool/resume-builder', label: 'Resume Builder' },
      { href: '/tool/invoice-generator', label: 'Invoice Generator' },
      { href: '/tool/qr-code-generator', label: 'QR Code Generator' },
      { href: '/tool/image-compressor', label: 'Image Compressor' },
      { href: '/tool/letter-generator', label: 'Letter Generator' },
    ],
    resources: [
      { href: '/blog', label: 'Blog' },
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/advertise', label: 'Advertise' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/disclaimer', label: 'Disclaimer' },
      { href: '/cookies', label: 'Cookie Policy' },
    ],
  };

  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">ToolSprint</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Free online tools to boost your productivity. No signup required.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ToolSprint. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for productivity enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
}
