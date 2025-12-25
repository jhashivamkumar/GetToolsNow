export interface Tool {
  slug: string;
  title: string;
  category: string;
  icon: string;
  shortDesc: string;
  longDesc: string;
  faqs: { q: string; a: string }[];
  howToSteps: string[];
  relatedSlugs: string[];
  popular?: boolean;
  new?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const categories: Category[] = [
  {
    slug: "documents",
    name: "Documents",
    icon: "FileText",
    description: "Create professional documents, resumes, and letters",
    color: "from-cyan-500 to-blue-500",
  },
  {
    slug: "business",
    name: "Business",
    icon: "Briefcase",
    description: "Invoice generators, calculators, and business tools",
    color: "from-purple-500 to-pink-500",
  },
  {
    slug: "images",
    name: "Images",
    icon: "Image",
    description: "Compress, convert, and edit images",
    color: "from-orange-500 to-red-500",
  },
  {
    slug: "utilities",
    name: "Utilities",
    icon: "Wrench",
    description: "QR codes, converters, and everyday tools",
    color: "from-green-500 to-emerald-500",
  },
  {
    slug: "text",
    name: "Text Tools",
    icon: "Type",
    description: "Word counters, case converters, and more",
    color: "from-yellow-500 to-orange-500",
  },
  {
    slug: "calculators",
    name: "Calculators",
    icon: "Calculator",
    description: "Financial, scientific, and unit calculators",
    color: "from-indigo-500 to-purple-500",
  },
];

export const tools: Tool[] = [
  // DOCUMENTS
  {
    slug: "resume-builder",
    title: "Resume Builder (ATS-Friendly)",
    category: "documents",
    icon: "FileUser",
    shortDesc: "Create professional ATS-optimized resumes with modern templates",
    longDesc: "Build a stunning, ATS-friendly resume in minutes. Our resume builder offers multiple professional templates, real-time preview, and PDF export. Perfect for job seekers who want to stand out while ensuring their resume passes automated screening systems.",
    popular: true,
    faqs: [
      { q: "What is an ATS-friendly resume?", a: "An ATS (Applicant Tracking System) friendly resume uses standard formatting, clear section headers, and avoids complex graphics that automated systems can't read." },
      { q: "Can I download my resume as PDF?", a: "Yes! Export your resume as a high-quality PDF ready for job applications." },
      { q: "Is my data saved?", a: "Your resume data is saved locally in your browser. You can also export and import your data." },
    ],
    howToSteps: [
      "Fill in your personal information",
      "Add your work experience",
      "Include your education and skills",
      "Choose a template style",
      "Preview and download as PDF",
    ],
    relatedSlugs: ["cover-letter-generator", "linkedin-summary", "job-description-analyzer", "letter-generator", "word-counter"],
  },
  {
    slug: "letter-generator",
    title: "Letter Generator (India)",
    category: "documents",
    icon: "Mail",
    shortDesc: "Generate professional HR letters: offer, relieving, experience letters",
    longDesc: "Create professional HR letters in seconds. Includes templates for offer letters, relieving letters, experience certificates, and salary increment letters. Perfectly formatted for Indian businesses with all required elements.",
    popular: true,
    new: true,
    faqs: [
      { q: "What types of letters can I create?", a: "Offer letters, relieving letters, experience certificates, salary increment letters, and more." },
      { q: "Are the templates customizable?", a: "Yes, you can fully customize all fields and add your company letterhead." },
    ],
    howToSteps: [
      "Select letter type",
      "Fill in employee details",
      "Add company information",
      "Customize content if needed",
      "Download or copy the letter",
    ],
    relatedSlugs: ["resume-builder", "invoice-generator", "cover-letter-generator", "word-counter", "pdf-merger"],
  },
  {
    slug: "cover-letter-generator",
    title: "Cover Letter Generator",
    category: "documents",
    icon: "FileEdit",
    shortDesc: "Create compelling cover letters tailored to job descriptions",
    longDesc: "Generate professional cover letters that complement your resume. Our tool helps you craft personalized, engaging letters that highlight your qualifications and enthusiasm for the role.",
    faqs: [
      { q: "How long should a cover letter be?", a: "Ideally 250-400 words, covering your key qualifications and interest in the role." },
    ],
    howToSteps: ["Enter job details", "Add your experience highlights", "Choose tone and style", "Generate and customize", "Export as PDF"],
    relatedSlugs: ["resume-builder", "linkedin-summary", "letter-generator", "word-counter", "text-case-converter"],
  },
  {
    slug: "linkedin-summary",
    title: "LinkedIn Summary Generator",
    category: "documents",
    icon: "Linkedin",
    shortDesc: "Craft an engaging LinkedIn profile summary",
    longDesc: "Stand out on LinkedIn with a professionally written summary. Our generator helps you create a compelling narrative that showcases your experience and attracts recruiters.",
    faqs: [{ q: "What makes a good LinkedIn summary?", a: "A mix of professional achievements, personality, and clear career goals in 200-300 words." }],
    howToSteps: ["Enter your role and experience", "Add key achievements", "Select tone", "Generate summary", "Copy to LinkedIn"],
    relatedSlugs: ["resume-builder", "cover-letter-generator", "bio-generator", "word-counter", "text-case-converter"],
  },
  {
    slug: "pdf-merger",
    title: "PDF Merger",
    category: "documents",
    icon: "FileStack",
    shortDesc: "Combine multiple PDF files into one document",
    longDesc: "Merge PDF files quickly and securely in your browser. No upload to servers - all processing happens locally for maximum privacy.",
    faqs: [{ q: "Is my data secure?", a: "Yes, all processing happens in your browser. Files never leave your device." }],
    howToSteps: ["Upload PDF files", "Arrange order", "Click merge", "Download combined PDF"],
    relatedSlugs: ["pdf-splitter", "image-to-pdf", "resume-builder", "letter-generator", "image-compressor"],
  },
  {
    slug: "pdf-splitter",
    title: "PDF Splitter",
    category: "documents",
    icon: "Scissors",
    shortDesc: "Split PDF into multiple files or extract pages",
    longDesc: "Extract specific pages from PDF documents. Split large PDFs into smaller files or remove unwanted pages.",
    faqs: [{ q: "Can I select specific pages?", a: "Yes, you can select individual pages or page ranges to extract." }],
    howToSteps: ["Upload PDF", "Select pages to extract", "Split or extract", "Download files"],
    relatedSlugs: ["pdf-merger", "image-to-pdf", "image-compressor", "resume-builder", "letter-generator"],
  },
  // BUSINESS
  {
    slug: "invoice-generator",
    title: "Invoice Generator (India GST)",
    category: "business",
    icon: "Receipt",
    shortDesc: "Create professional GST-compliant invoices with CGST/SGST",
    longDesc: "Generate professional invoices with automatic GST calculations. Supports CGST/SGST split, multiple line items, and customizable templates. Perfect for Indian businesses and freelancers.",
    popular: true,
    faqs: [
      { q: "Does it calculate GST automatically?", a: "Yes, enter the GST rate and it automatically splits into CGST and SGST." },
      { q: "Can I add my logo?", a: "Absolutely! Upload your company logo for professional branding." },
    ],
    howToSteps: [
      "Enter business details and GSTIN",
      "Add client information",
      "List products/services with amounts",
      "Set GST rate",
      "Generate and download PDF",
    ],
    relatedSlugs: ["gst-calculator", "salary-slip-generator", "quotation-maker", "letter-generator", "resume-builder"],
  },
  {
    slug: "gst-calculator",
    title: "GST Calculator",
    category: "business",
    icon: "Percent",
    shortDesc: "Calculate GST with CGST/SGST/IGST breakdown",
    longDesc: "Instantly calculate GST amounts. Supports inclusive and exclusive calculations with detailed CGST/SGST or IGST breakdown.",
    faqs: [{ q: "What's the difference between CGST/SGST and IGST?", a: "CGST/SGST applies to intra-state sales, IGST applies to inter-state sales." }],
    howToSteps: ["Enter amount", "Select GST rate", "Choose calculation type", "View breakdown"],
    relatedSlugs: ["invoice-generator", "salary-calculator", "emi-calculator", "percentage-calculator", "quotation-maker"],
  },
  {
    slug: "salary-slip-generator",
    title: "Salary Slip Generator",
    category: "business",
    icon: "FileSpreadsheet",
    shortDesc: "Generate professional salary slips for employees",
    longDesc: "Create detailed salary slips with earnings, deductions, and net pay calculations. Includes PF, ESI, and tax deductions.",
    faqs: [{ q: "Can I customize deductions?", a: "Yes, add custom earning and deduction components as needed." }],
    howToSteps: ["Enter employee details", "Add earnings components", "Add deductions", "Generate slip", "Download PDF"],
    relatedSlugs: ["invoice-generator", "letter-generator", "gst-calculator", "salary-calculator", "resume-builder"],
  },
  {
    slug: "quotation-maker",
    title: "Quotation Maker",
    category: "business",
    icon: "FileCheck",
    shortDesc: "Create professional quotations and estimates",
    longDesc: "Generate detailed quotations with itemized pricing, terms, and validity. Perfect for freelancers and small businesses.",
    faqs: [{ q: "Can I set quotation validity?", a: "Yes, specify validity period and payment terms." }],
    howToSteps: ["Enter business details", "Add client info", "List items with prices", "Add terms", "Generate quotation"],
    relatedSlugs: ["invoice-generator", "gst-calculator", "salary-slip-generator", "letter-generator", "pdf-merger"],
  },
  // IMAGES
  {
    slug: "image-compressor",
    title: "Image Compressor",
    category: "images",
    icon: "ImageDown",
    shortDesc: "Reduce image file size without losing quality",
    longDesc: "Compress images up to 80% smaller while maintaining visual quality. Supports JPG, PNG, and WebP. All processing happens in your browser for privacy.",
    popular: true,
    faqs: [
      { q: "How much can images be compressed?", a: "Typically 50-80% size reduction while maintaining visual quality." },
      { q: "Are my images uploaded to a server?", a: "No, all compression happens locally in your browser." },
    ],
    howToSteps: ["Upload an image", "Adjust quality slider", "Preview result", "Compare before/after sizes", "Download compressed image"],
    relatedSlugs: ["image-resizer", "image-to-pdf", "png-to-jpg", "webp-converter", "background-remover"],
  },
  {
    slug: "image-resizer",
    title: "Image Resizer",
    category: "images",
    icon: "Maximize",
    shortDesc: "Resize images to exact dimensions",
    longDesc: "Resize images to specific dimensions while maintaining aspect ratio. Perfect for social media, websites, and print.",
    faqs: [{ q: "Can I maintain aspect ratio?", a: "Yes, lock aspect ratio to prevent distortion." }],
    howToSteps: ["Upload image", "Set dimensions", "Choose resize mode", "Download resized image"],
    relatedSlugs: ["image-compressor", "image-cropper", "png-to-jpg", "webp-converter", "background-remover"],
  },
  {
    slug: "png-to-jpg",
    title: "PNG to JPG Converter",
    category: "images",
    icon: "RefreshCw",
    shortDesc: "Convert PNG images to JPG format",
    longDesc: "Quickly convert PNG images to JPG format. Reduce file size by converting transparent PNGs to JPG.",
    faqs: [{ q: "What happens to transparency?", a: "Transparent areas become white (or your chosen background color)." }],
    howToSteps: ["Upload PNG", "Choose background color", "Convert", "Download JPG"],
    relatedSlugs: ["jpg-to-png", "image-compressor", "webp-converter", "image-resizer", "image-to-pdf"],
  },
  {
    slug: "jpg-to-png",
    title: "JPG to PNG Converter",
    category: "images",
    icon: "RefreshCcw",
    shortDesc: "Convert JPG images to PNG format",
    longDesc: "Convert JPG images to PNG format for better quality and transparency support.",
    faqs: [{ q: "Why convert to PNG?", a: "PNG supports transparency and lossless compression." }],
    howToSteps: ["Upload JPG", "Convert", "Download PNG"],
    relatedSlugs: ["png-to-jpg", "image-compressor", "webp-converter", "image-resizer", "background-remover"],
  },
  {
    slug: "webp-converter",
    title: "WebP Converter",
    category: "images",
    icon: "FileImage",
    shortDesc: "Convert images to/from WebP format",
    longDesc: "Convert images to WebP for smaller file sizes or convert WebP to other formats for compatibility.",
    faqs: [{ q: "Why use WebP?", a: "WebP offers 25-35% smaller file sizes than PNG/JPG with similar quality." }],
    howToSteps: ["Upload image", "Choose output format", "Convert", "Download"],
    relatedSlugs: ["image-compressor", "png-to-jpg", "jpg-to-png", "image-resizer", "image-to-pdf"],
  },
  {
    slug: "background-remover",
    title: "Background Remover",
    category: "images",
    icon: "Eraser",
    shortDesc: "Remove background from images automatically",
    longDesc: "AI-powered background removal. Perfect for product photos, portraits, and social media content.",
    new: true,
    faqs: [{ q: "How accurate is the removal?", a: "Our AI handles most images well, especially portraits and products." }],
    howToSteps: ["Upload image", "Wait for processing", "Download with transparent background"],
    relatedSlugs: ["image-compressor", "image-resizer", "png-to-jpg", "webp-converter", "image-cropper"],
  },
  {
    slug: "image-to-pdf",
    title: "Image to PDF",
    category: "images",
    icon: "FileOutput",
    shortDesc: "Convert images to PDF documents",
    longDesc: "Combine multiple images into a single PDF document. Arrange pages, set orientation, and customize margins.",
    faqs: [{ q: "Can I combine multiple images?", a: "Yes, add multiple images and arrange them in any order." }],
    howToSteps: ["Upload images", "Arrange order", "Set page options", "Generate PDF", "Download"],
    relatedSlugs: ["pdf-merger", "image-compressor", "image-resizer", "pdf-splitter", "png-to-jpg"],
  },
  {
    slug: "image-cropper",
    title: "Image Cropper",
    category: "images",
    icon: "Crop",
    shortDesc: "Crop images with precise controls",
    longDesc: "Crop images with preset aspect ratios or custom dimensions. Perfect for profile pictures and thumbnails.",
    faqs: [{ q: "Are there preset aspect ratios?", a: "Yes, includes 1:1, 4:3, 16:9, and custom options." }],
    howToSteps: ["Upload image", "Select crop area", "Apply crop", "Download"],
    relatedSlugs: ["image-resizer", "image-compressor", "background-remover", "png-to-jpg", "webp-converter"],
  },
  // UTILITIES
  {
    slug: "qr-code-generator",
    title: "QR Code Generator",
    category: "utilities",
    icon: "QrCode",
    shortDesc: "Create custom QR codes for URLs, text, WiFi, vCard, and UPI",
    longDesc: "Generate high-quality QR codes for various purposes. Supports URLs, plain text, WiFi credentials, vCard contacts, and UPI payment links. Customize colors, size, and error correction level.",
    popular: true,
    faqs: [
      { q: "What formats can I export?", a: "Download as PNG or SVG for scalable quality." },
      { q: "Can I customize colors?", a: "Yes, customize foreground and background colors." },
    ],
    howToSteps: ["Select QR type", "Enter content", "Customize appearance", "Generate QR code", "Download PNG/SVG"],
    relatedSlugs: ["barcode-generator", "url-shortener", "wifi-qr", "vcard-generator", "upi-qr"],
  },
  {
    slug: "barcode-generator",
    title: "Barcode Generator",
    category: "utilities",
    icon: "Barcode",
    shortDesc: "Generate barcodes in multiple formats",
    longDesc: "Create barcodes in various formats including Code128, EAN-13, UPC-A, and more. Perfect for inventory and product labeling.",
    faqs: [{ q: "What barcode formats are supported?", a: "Code128, Code39, EAN-13, EAN-8, UPC-A, and more." }],
    howToSteps: ["Select barcode type", "Enter data", "Customize options", "Generate", "Download"],
    relatedSlugs: ["qr-code-generator", "label-maker", "inventory-tracker", "pdf-merger", "image-compressor"],
  },
  {
    slug: "color-picker",
    title: "Color Picker",
    category: "utilities",
    icon: "Palette",
    shortDesc: "Pick colors and get HEX, RGB, HSL values",
    longDesc: "Professional color picker with multiple formats. Extract colors from images, generate palettes, and check contrast ratios.",
    faqs: [{ q: "What color formats are supported?", a: "HEX, RGB, HSL, and CMYK." }],
    howToSteps: ["Select or enter color", "View all formats", "Copy values", "Generate palette"],
    relatedSlugs: ["gradient-generator", "contrast-checker", "palette-generator", "css-generator", "image-compressor"],
  },
  {
    slug: "gradient-generator",
    title: "Gradient Generator",
    category: "utilities",
    icon: "Blend",
    shortDesc: "Create beautiful CSS gradients",
    longDesc: "Design stunning linear and radial gradients. Copy CSS code directly or download as an image.",
    faqs: [{ q: "Can I add multiple colors?", a: "Yes, add unlimited color stops to create complex gradients." }],
    howToSteps: ["Choose gradient type", "Add color stops", "Adjust angle", "Copy CSS code"],
    relatedSlugs: ["color-picker", "css-generator", "palette-generator", "contrast-checker", "background-remover"],
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    category: "utilities",
    icon: "Braces",
    shortDesc: "Format, validate, and beautify JSON",
    longDesc: "Format messy JSON with proper indentation. Validate syntax and find errors instantly.",
    faqs: [{ q: "Can it validate JSON?", a: "Yes, it highlights syntax errors with line numbers." }],
    howToSteps: ["Paste JSON", "Format or minify", "Copy result"],
    relatedSlugs: ["xml-formatter", "code-beautifier", "base64-encoder", "url-encoder", "word-counter"],
  },
  {
    slug: "base64-encoder",
    title: "Base64 Encoder/Decoder",
    category: "utilities",
    icon: "Binary",
    shortDesc: "Encode and decode Base64 strings",
    longDesc: "Convert text or files to Base64 encoding and vice versa. Useful for data URIs and API integrations.",
    faqs: [{ q: "Can I encode files?", a: "Yes, encode images and files to Base64 data URIs." }],
    howToSteps: ["Enter text or upload file", "Choose encode/decode", "Copy result"],
    relatedSlugs: ["url-encoder", "json-formatter", "hash-generator", "text-case-converter", "word-counter"],
  },
  {
    slug: "url-encoder",
    title: "URL Encoder/Decoder",
    category: "utilities",
    icon: "Link2",
    shortDesc: "Encode and decode URL strings",
    longDesc: "Encode special characters for URLs or decode encoded URLs back to readable text.",
    faqs: [{ q: "When should I use this?", a: "When passing special characters or non-ASCII text in URLs." }],
    howToSteps: ["Enter URL or text", "Encode or decode", "Copy result"],
    relatedSlugs: ["base64-encoder", "json-formatter", "qr-code-generator", "hash-generator", "word-counter"],
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    category: "utilities",
    icon: "Hash",
    shortDesc: "Generate MD5, SHA-1, SHA-256 hashes",
    longDesc: "Calculate cryptographic hashes for text or files. Supports MD5, SHA-1, SHA-256, and SHA-512.",
    faqs: [{ q: "Which hash should I use?", a: "SHA-256 is recommended for security. MD5 is faster but less secure." }],
    howToSteps: ["Enter text or upload file", "Select algorithm", "Generate hash", "Copy result"],
    relatedSlugs: ["base64-encoder", "url-encoder", "password-generator", "uuid-generator", "json-formatter"],
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    category: "utilities",
    icon: "KeyRound",
    shortDesc: "Generate secure random passwords",
    longDesc: "Create strong, random passwords with customizable length and character sets. Check password strength instantly.",
    faqs: [{ q: "How long should my password be?", a: "At least 12-16 characters for good security." }],
    howToSteps: ["Set length", "Choose character types", "Generate", "Copy password"],
    relatedSlugs: ["hash-generator", "uuid-generator", "random-number", "qr-code-generator", "base64-encoder"],
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    category: "utilities",
    icon: "Fingerprint",
    shortDesc: "Generate unique UUIDs (v1, v4)",
    longDesc: "Generate universally unique identifiers for databases, APIs, and applications.",
    faqs: [{ q: "What's the difference between v1 and v4?", a: "v1 uses timestamp, v4 is completely random. v4 is more common." }],
    howToSteps: ["Select version", "Generate UUIDs", "Copy to clipboard"],
    relatedSlugs: ["password-generator", "hash-generator", "random-number", "json-formatter", "base64-encoder"],
  },
  // TEXT TOOLS
  {
    slug: "word-counter",
    title: "Word Counter",
    category: "text",
    icon: "FileText",
    shortDesc: "Count words, characters, sentences, and paragraphs",
    longDesc: "Analyze text with detailed statistics. Count words, characters (with/without spaces), sentences, paragraphs, and estimated reading time.",
    faqs: [{ q: "How is reading time calculated?", a: "Based on average reading speed of 200 words per minute." }],
    howToSteps: ["Paste or type text", "View statistics", "Copy results"],
    relatedSlugs: ["character-counter", "text-case-converter", "lorem-ipsum", "text-diff", "plagiarism-checker"],
  },
  {
    slug: "text-case-converter",
    title: "Text Case Converter",
    category: "text",
    icon: "CaseSensitive",
    shortDesc: "Convert text between different cases",
    longDesc: "Transform text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and more.",
    faqs: [{ q: "What cases are available?", a: "Upper, lower, title, sentence, camel, pascal, snake, and kebab case." }],
    howToSteps: ["Enter text", "Select case", "Copy result"],
    relatedSlugs: ["word-counter", "text-reverse", "text-replace", "lorem-ipsum", "character-counter"],
  },
  {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    category: "text",
    icon: "Text",
    shortDesc: "Generate placeholder text",
    longDesc: "Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words for design mockups.",
    faqs: [{ q: "What is Lorem Ipsum?", a: "Placeholder text used in design to show how content will look." }],
    howToSteps: ["Select type", "Set amount", "Generate", "Copy text"],
    relatedSlugs: ["word-counter", "text-case-converter", "random-name", "bio-generator", "character-counter"],
  },
  {
    slug: "text-diff",
    title: "Text Diff Checker",
    category: "text",
    icon: "GitCompare",
    shortDesc: "Compare two texts and highlight differences",
    longDesc: "Compare two texts side by side and see exactly what changed. Highlights additions, deletions, and modifications.",
    faqs: [{ q: "Can I ignore whitespace?", a: "Yes, there's an option to ignore whitespace differences." }],
    howToSteps: ["Paste original text", "Paste modified text", "Compare", "View differences"],
    relatedSlugs: ["word-counter", "text-case-converter", "plagiarism-checker", "text-replace", "json-formatter"],
  },
  // CALCULATORS
  {
    slug: "emi-calculator",
    title: "EMI Calculator",
    category: "calculators",
    icon: "Calculator",
    shortDesc: "Calculate loan EMI with amortization schedule",
    longDesc: "Calculate monthly EMI for loans with detailed amortization schedule. Supports home, car, and personal loans.",
    faqs: [{ q: "What's included in the schedule?", a: "Monthly breakdown of principal, interest, and balance." }],
    howToSteps: ["Enter loan amount", "Set interest rate", "Choose tenure", "View EMI and schedule"],
    relatedSlugs: ["sip-calculator", "fd-calculator", "gst-calculator", "age-calculator", "percentage-calculator"],
  },
  {
    slug: "sip-calculator",
    title: "SIP Calculator",
    category: "calculators",
    icon: "TrendingUp",
    shortDesc: "Calculate SIP returns with graphical projections",
    longDesc: "Plan your investments with our SIP calculator. See how your monthly investments grow over time with compound interest.",
    faqs: [{ q: "How is SIP return calculated?", a: "Using compound interest formula with monthly compounding." }],
    howToSteps: ["Enter monthly amount", "Set expected return", "Choose duration", "View projections"],
    relatedSlugs: ["emi-calculator", "fd-calculator", "compound-interest", "percentage-calculator", "gst-calculator"],
  },
  {
    slug: "age-calculator",
    title: "Age Calculator",
    category: "calculators",
    icon: "Calendar",
    shortDesc: "Calculate exact age in years, months, and days",
    longDesc: "Calculate your exact age down to the day. Also shows upcoming birthday countdown and total days lived.",
    faqs: [{ q: "Does it account for leap years?", a: "Yes, all calculations are leap-year accurate." }],
    howToSteps: ["Enter birth date", "View age breakdown", "See birthday countdown"],
    relatedSlugs: ["date-calculator", "days-between", "time-zone-converter", "emi-calculator", "percentage-calculator"],
  },
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    category: "calculators",
    icon: "Percent",
    shortDesc: "Calculate percentages, increases, and decreases",
    longDesc: "All-in-one percentage calculator. Find percentages, calculate increases/decreases, and convert fractions.",
    faqs: [{ q: "What calculations are supported?", a: "X% of Y, X is what % of Y, percentage change, and more." }],
    howToSteps: ["Choose calculation type", "Enter values", "Get result"],
    relatedSlugs: ["gst-calculator", "emi-calculator", "discount-calculator", "tip-calculator", "salary-calculator"],
  },
  {
    slug: "salary-calculator",
    title: "Salary Calculator (India)",
    category: "calculators",
    icon: "IndianRupee",
    shortDesc: "Calculate in-hand salary with tax breakdown",
    longDesc: "Calculate take-home salary after PF, tax, and other deductions. Supports new and old tax regimes.",
    popular: true,
    faqs: [{ q: "Which tax regime is better?", a: "Depends on your deductions. The calculator compares both." }],
    howToSteps: ["Enter CTC", "Add deductions", "Choose tax regime", "View salary breakdown"],
    relatedSlugs: ["gst-calculator", "emi-calculator", "percentage-calculator", "invoice-generator", "salary-slip-generator"],
  },
];

export const getToolsByCategory = (categorySlug: string): Tool[] => {
  return tools.filter(tool => tool.category === categorySlug);
};

export const getToolBySlug = (slug: string): Tool | undefined => {
  return tools.find(tool => tool.slug === slug);
};

export const getRelatedTools = (slugs: string[]): Tool[] => {
  return tools.filter(tool => slugs.includes(tool.slug));
};

export const getPopularTools = (): Tool[] => {
  return tools.filter(tool => tool.popular);
};

export const getNewTools = (): Tool[] => {
  return tools.filter(tool => tool.new);
};

export const searchTools = (query: string): Tool[] => {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    tool =>
      tool.title.toLowerCase().includes(lowerQuery) ||
      tool.shortDesc.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
  );
};
