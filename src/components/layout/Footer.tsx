import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import logoIcon from '@/assets/logo-icon.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    tools: [
      { href: '/tool/resume-builder', label: 'Resume Builder' },
      { href: '/tool/invoice-generator-global', label: 'Invoice Generator' },
      { href: '/tool/qr-code-generator', label: 'QR Code Generator' },
      { href: '/tool/image-compressor', label: 'Image Compressor' },
      { href: '/tool/password-generator', label: 'Password Generator' },
      { href: '/tool/currency-converter', label: 'Currency Converter' },
    ],
    categories: [
      { href: '/tools/documents', label: 'Documents' },
      { href: '/tools/business', label: 'Business' },
      { href: '/tools/images', label: 'Images' },
      { href: '/tools/utilities', label: 'Utilities' },
      { href: '/tools/text', label: 'Text Tools' },
      { href: '/tools/calculators', label: 'Calculators' },
    ],
    company: [
      { href: '/about', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
      { href: '/favorites', label: 'My Favorites' },
    ],
    legal: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  };

  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logoIcon} alt="GetToolsNow Logo" className="h-6 w-6" />
              <span className="text-lg font-bold gradient-text">GetToolsNow</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Free online tools to boost your productivity. No signup required.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <Link 
                to="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Contact"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Popular Tools */}
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

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map(link => (
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

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
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
            © {currentYear} GetToolsNow. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/tools" className="hover:text-foreground transition-colors">
              All Tools
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
