export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  relatedTools: string[];
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-create-ats-friendly-resume",
    title: "How to Create an ATS-Friendly Resume in 2024",
    description: "Learn the essential tips and tricks to make your resume pass through Applicant Tracking Systems and land more interviews.",
    content: `# How to Create an ATS-Friendly Resume in 2024

An ATS (Applicant Tracking System) is software used by employers to filter resumes before human review. Here's how to optimize yours.

## Key Tips

1. **Use standard section headers** - "Work Experience", "Education", "Skills"
2. **Avoid graphics and tables** - ATS can't read them
3. **Use common fonts** - Arial, Calibri, Times New Roman
4. **Include keywords** - Match job description terms
5. **Save as PDF** - Maintains formatting

## Common Mistakes to Avoid

- Fancy templates with columns
- Headers/footers with contact info
- Uncommon file formats

Use our Resume Builder to create an ATS-optimized resume in minutes.`,
    author: "Career Team",
    date: "2024-01-15",
    tags: ["resume", "career", "job-search", "ats"],
    relatedTools: ["resume-builder", "cover-letter-generator", "linkedin-summary"],
  },
  {
    slug: "complete-guide-gst-invoicing-india",
    title: "Complete Guide to GST Invoicing in India",
    description: "Everything you need to know about creating GST-compliant invoices, including CGST, SGST, and IGST calculations.",
    content: `# Complete Guide to GST Invoicing in India

Understanding GST invoicing is crucial for Indian businesses. Here's your complete guide.

## GST Components

- **CGST**: Central GST (goes to central government)
- **SGST**: State GST (goes to state government)  
- **IGST**: Integrated GST (for inter-state transactions)

## Invoice Requirements

1. Supplier details with GSTIN
2. Invoice number and date
3. Recipient details
4. HSN/SAC codes
5. Taxable value and GST breakdown

Use our Invoice Generator for automatic GST calculations.`,
    author: "Finance Team",
    date: "2024-01-10",
    tags: ["gst", "invoice", "india", "business"],
    relatedTools: ["invoice-generator", "gst-calculator", "salary-slip-generator"],
  },
  {
    slug: "image-compression-explained",
    title: "Image Compression Explained: When and How to Compress",
    description: "Understand the science behind image compression and learn when to use lossy vs lossless compression.",
    content: `# Image Compression Explained

Large images slow down websites. Here's how compression helps.

## Types of Compression

### Lossy Compression
- Permanently removes data
- Smaller file sizes
- Best for photos (JPEG)

### Lossless Compression  
- No data loss
- Larger than lossy
- Best for graphics (PNG)

## When to Compress

- Website images: Always
- Print: Minimal compression
- Thumbnails: Heavy compression OK

Try our Image Compressor for instant results.`,
    author: "Tech Team",
    date: "2024-01-08",
    tags: ["images", "compression", "web-performance"],
    relatedTools: ["image-compressor", "image-resizer", "webp-converter"],
  },
  {
    slug: "qr-codes-business-uses",
    title: "10 Creative Ways to Use QR Codes for Your Business",
    description: "Discover innovative ways to leverage QR codes for marketing, payments, and customer engagement.",
    content: `# 10 Creative Ways to Use QR Codes

QR codes are versatile tools for business. Here are top uses:

1. **Digital menus** - Contactless restaurant experience
2. **Payment links** - UPI QR for instant payments
3. **WiFi sharing** - Easy guest network access
4. **Business cards** - vCard QR for contact info
5. **Product info** - Link to manuals/videos
6. **Event check-in** - Fast registration
7. **Feedback forms** - Quick survey access
8. **Social media** - Profile links
9. **Coupons** - Scannable discounts
10. **App downloads** - Direct store links

Create yours with our QR Code Generator.`,
    author: "Marketing Team",
    date: "2024-01-05",
    tags: ["qr-code", "marketing", "business"],
    relatedTools: ["qr-code-generator", "barcode-generator", "vcard-generator"],
  },
  {
    slug: "hr-letter-templates-india",
    title: "Essential HR Letter Templates for Indian Companies",
    description: "Download professional templates for offer letters, relieving letters, experience certificates, and more.",
    content: `# Essential HR Letter Templates

Professional HR letters are crucial. Here's what you need.

## Common HR Letters

### Offer Letter
- Compensation details
- Joining date
- Terms and conditions

### Relieving Letter
- Confirmation of resignation
- Last working day
- No-dues confirmation

### Experience Certificate
- Employment duration
- Designation held
- Brief performance note

Generate all these instantly with our Letter Generator.`,
    author: "HR Team",
    date: "2024-01-03",
    tags: ["hr", "letters", "india", "templates"],
    relatedTools: ["letter-generator", "resume-builder", "salary-slip-generator"],
  },
  {
    slug: "password-security-best-practices",
    title: "Password Security: Best Practices for 2024",
    description: "Learn how to create and manage strong passwords to protect your online accounts.",
    content: `# Password Security Best Practices

Weak passwords are a major security risk. Here's how to stay safe.

## Creating Strong Passwords

- Minimum 12 characters
- Mix of upper/lowercase
- Include numbers and symbols
- Avoid personal information

## Password Management

1. Use a password manager
2. Enable 2FA everywhere
3. Never reuse passwords
4. Change compromised passwords immediately

Generate secure passwords with our Password Generator.`,
    author: "Security Team",
    date: "2024-01-01",
    tags: ["security", "passwords", "privacy"],
    relatedTools: ["password-generator", "hash-generator", "uuid-generator"],
  },
  {
    slug: "understanding-emi-calculations",
    title: "Understanding EMI Calculations: A Beginner's Guide",
    description: "Learn how EMI is calculated and strategies to reduce your loan burden.",
    content: `# Understanding EMI Calculations

EMI (Equated Monthly Installment) is your monthly loan payment.

## EMI Formula

EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)

Where:
- P = Principal amount
- r = Monthly interest rate
- n = Number of months

## Tips to Reduce EMI

1. Make larger down payment
2. Choose longer tenure (but pay more interest)
3. Compare interest rates
4. Make prepayments when possible

Calculate your EMI with our EMI Calculator.`,
    author: "Finance Team",
    date: "2023-12-28",
    tags: ["finance", "loans", "emi", "calculator"],
    relatedTools: ["emi-calculator", "sip-calculator", "salary-calculator"],
  },
  {
    slug: "webp-vs-png-vs-jpg",
    title: "WebP vs PNG vs JPG: Which Image Format Should You Use?",
    description: "Compare popular image formats and learn when to use each for optimal results.",
    content: `# WebP vs PNG vs JPG

Choosing the right format matters for quality and file size.

## Format Comparison

### JPG
- Best for: Photos
- Pros: Small size
- Cons: Lossy, no transparency

### PNG
- Best for: Graphics, logos
- Pros: Lossless, transparency
- Cons: Larger files

### WebP
- Best for: Web images
- Pros: Best compression, transparency
- Cons: Limited compatibility

Convert between formats with our WebP Converter.`,
    author: "Tech Team",
    date: "2023-12-25",
    tags: ["images", "formats", "webp", "optimization"],
    relatedTools: ["webp-converter", "image-compressor", "png-to-jpg"],
  },
  {
    slug: "sip-investment-strategy",
    title: "SIP Investment Strategy for Long-term Wealth",
    description: "Master the art of systematic investment planning to build wealth over time.",
    content: `# SIP Investment Strategy

SIP is a disciplined way to invest in mutual funds.

## Benefits of SIP

1. **Rupee cost averaging** - Buy more when prices are low
2. **Compounding** - Earnings generate more earnings
3. **Discipline** - Automatic monthly investments
4. **Flexibility** - Start small, increase later

## Tips for Success

- Start early
- Stay consistent
- Review annually
- Don't time the market

Plan your SIP with our SIP Calculator.`,
    author: "Investment Team",
    date: "2023-12-22",
    tags: ["investment", "sip", "mutual-funds", "finance"],
    relatedTools: ["sip-calculator", "emi-calculator", "fd-calculator"],
  },
  {
    slug: "json-formatting-tips",
    title: "JSON Formatting Tips for Developers",
    description: "Learn best practices for working with JSON data, including formatting and validation.",
    content: `# JSON Formatting Tips

JSON is the standard for data exchange. Here are tips for working with it.

## Best Practices

1. **Use consistent indentation** - 2 or 4 spaces
2. **Quote all keys** - Required by spec
3. **Use meaningful names** - Clear property names
4. **Validate before use** - Catch errors early

## Common Mistakes

- Trailing commas
- Single quotes instead of double
- Missing quotes on keys
- Invalid escape sequences

Format your JSON with our JSON Formatter.`,
    author: "Dev Team",
    date: "2023-12-20",
    tags: ["json", "development", "formatting"],
    relatedTools: ["json-formatter", "base64-encoder", "url-encoder"],
  },
  {
    slug: "salary-structure-india-explained",
    title: "Understanding Salary Structure in India: CTC, Gross, Net",
    description: "Decode your salary slip and understand all components from CTC to take-home pay.",
    content: `# Salary Structure in India Explained

Understanding your salary components helps in financial planning.

## Key Terms

- **CTC**: Total cost to company
- **Gross Salary**: Before deductions
- **Net Salary**: Take-home pay

## Common Components

### Earnings
- Basic salary (40-50% of CTC)
- HRA
- Special allowances
- Bonuses

### Deductions
- PF (12% of basic)
- Professional tax
- Income tax (TDS)

Calculate your salary with our Salary Calculator.`,
    author: "Finance Team",
    date: "2023-12-18",
    tags: ["salary", "india", "tax", "finance"],
    relatedTools: ["salary-calculator", "salary-slip-generator", "gst-calculator"],
  },
  {
    slug: "linkedin-profile-optimization",
    title: "LinkedIn Profile Optimization: Stand Out to Recruiters",
    description: "Transform your LinkedIn profile into a recruiter magnet with these proven strategies.",
    content: `# LinkedIn Profile Optimization

Your LinkedIn profile is your digital resume. Make it count.

## Key Sections

1. **Headline** - More than just job title
2. **Summary** - Your professional story
3. **Experience** - Achievement-focused
4. **Skills** - Relevant keywords

## Optimization Tips

- Use a professional photo
- Write a compelling summary
- Get recommendations
- Engage with content

Create your summary with our LinkedIn Summary Generator.`,
    author: "Career Team",
    date: "2023-12-15",
    tags: ["linkedin", "career", "networking", "job-search"],
    relatedTools: ["linkedin-summary", "resume-builder", "cover-letter-generator"],
  },
  {
    slug: "base64-encoding-explained",
    title: "Base64 Encoding Explained: When and Why to Use It",
    description: "Understand Base64 encoding, its use cases, and when you should (or shouldn't) use it.",
    content: `# Base64 Encoding Explained

Base64 converts binary data to ASCII text. Here's when to use it.

## Common Use Cases

1. **Email attachments** - MIME encoding
2. **Data URIs** - Embed images in HTML/CSS
3. **API payloads** - Binary data in JSON
4. **Basic auth** - HTTP authentication

## Pros and Cons

### Pros
- Text-safe encoding
- Universal compatibility
- Easy to transport

### Cons
- 33% size increase
- Not encryption
- Processing overhead

Encode/decode with our Base64 Tool.`,
    author: "Dev Team",
    date: "2023-12-12",
    tags: ["base64", "encoding", "development"],
    relatedTools: ["base64-encoder", "url-encoder", "hash-generator"],
  },
  {
    slug: "writing-effective-cover-letters",
    title: "Writing Effective Cover Letters That Get Interviews",
    description: "Master the art of cover letter writing with templates and examples that work.",
    content: `# Writing Effective Cover Letters

A great cover letter can be the difference between an interview and rejection.

## Structure

1. **Opening** - Hook the reader
2. **Body** - Your qualifications
3. **Closing** - Call to action

## Do's and Don'ts

### Do
- Customize for each job
- Show enthusiasm
- Quantify achievements
- Keep it concise (one page)

### Don't
- Repeat your resume
- Use generic templates
- Make it about you only
- Forget to proofread

Create yours with our Cover Letter Generator.`,
    author: "Career Team",
    date: "2023-12-10",
    tags: ["cover-letter", "career", "job-search"],
    relatedTools: ["cover-letter-generator", "resume-builder", "linkedin-summary"],
  },
  {
    slug: "pdf-tips-and-tricks",
    title: "PDF Tips and Tricks: Merge, Split, and Convert Like a Pro",
    description: "Master PDF manipulation with these essential tips for merging, splitting, and converting documents.",
    content: `# PDF Tips and Tricks

PDFs are universal but sometimes need manipulation.

## Common Tasks

### Merging PDFs
- Combine multiple documents
- Arrange pages in order
- Create single file

### Splitting PDFs
- Extract specific pages
- Remove unwanted content
- Create smaller files

### Converting
- Images to PDF
- PDF to images
- Maintain formatting

Use our PDF tools for all these tasks.`,
    author: "Productivity Team",
    date: "2023-12-08",
    tags: ["pdf", "documents", "productivity"],
    relatedTools: ["pdf-merger", "pdf-splitter", "image-to-pdf"],
  },
];

export const getBlogPost = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getRecentPosts = (count: number = 5): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => post.tags.includes(tag));
};

export const searchBlogPosts = (query: string): BlogPost[] => {
  const lowerQuery = query.toLowerCase();
  return blogPosts.filter(
    post =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.includes(lowerQuery))
  );
};
