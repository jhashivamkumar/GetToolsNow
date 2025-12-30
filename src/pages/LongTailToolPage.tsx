import { useParams, Navigate } from 'react-router-dom';

// Long-tail keyword mappings to actual tool slugs
const longTailMappings: Record<string, string> = {
  // Resume Builder variants
  'free-resume-builder-online': 'resume-builder',
  'ats-resume-builder-free': 'resume-builder',
  'resume-maker-no-signup': 'resume-builder',
  'professional-resume-generator': 'resume-builder',
  
  // Image Compressor variants
  'compress-image-online-free': 'image-compressor',
  'reduce-image-size-free': 'image-compressor',
  'image-size-reducer-online': 'image-compressor',
  'photo-compressor-free': 'image-compressor',
  
  // QR Code Generator variants
  'qr-code-maker-free': 'qr-code-generator',
  'free-qr-generator-online': 'qr-code-generator',
  'wifi-qr-code-generator': 'qr-code-generator',
  'upi-qr-code-generator': 'qr-code-generator',
  
  // Invoice Generator variants
  'gst-invoice-generator-free': 'invoice-generator',
  'invoice-maker-india': 'invoice-generator',
  'free-invoice-generator-pdf': 'invoice-generator-global',
  'online-invoice-maker-free': 'invoice-generator-global',
  
  // Password Generator variants
  'strong-password-generator': 'password-generator',
  'random-password-generator-free': 'password-generator',
  'secure-password-maker': 'password-generator',
  
  // EMI Calculator variants
  'home-loan-emi-calculator': 'emi-calculator',
  'car-loan-emi-calculator': 'emi-calculator',
  'personal-loan-emi-calculator': 'emi-calculator',
  'loan-emi-calculator-india': 'emi-calculator',
  
  // Image Converters
  'png-to-jpg-converter-free': 'png-to-jpg',
  'jpg-to-png-converter-online': 'jpg-to-png',
  'webp-to-png-converter': 'webp-converter',
  'image-to-webp-converter': 'webp-converter',
  
  // Word Counter
  'word-counter-online-free': 'word-counter',
  'character-counter-tool': 'word-counter',
  'text-word-counter': 'word-counter',
  
  // Other tools
  'salary-calculator-india': 'salary-calculator',
  'take-home-salary-calculator': 'salary-calculator',
  'gst-calculator-india': 'gst-calculator',
  'cgst-sgst-calculator': 'gst-calculator',
  'sip-calculator-india': 'sip-calculator',
  'mutual-fund-sip-calculator': 'sip-calculator',
};

export default function LongTailToolPage() {
  const { keyword } = useParams<{ keyword: string }>();
  
  const actualSlug = keyword ? longTailMappings[keyword] : null;
  
  if (actualSlug) {
    return <Navigate to={`/tool/${actualSlug}`} replace />;
  }
  
  return <Navigate to="/tools" replace />;
}
