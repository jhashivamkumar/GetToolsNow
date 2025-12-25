import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Download, Plus, Trash2, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  unit: string;
}

export default function QuotationMaker() {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyGST, setCompanyGST] = useState('');
  
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  
  const [quotationNumber, setQuotationNumber] = useState('QT-001');
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  const [gstRate, setGstRate] = useState(18);
  
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, unit: 'Nos' },
  ]);
  
  const [terms, setTerms] = useState(`1. Payment Terms: 50% advance, 50% on delivery
2. Delivery: Within 7-10 working days
3. Validity: This quotation is valid for 30 days
4. GST: As applicable
5. Prices are subject to change without prior notice`);

  const [notes, setNotes] = useState('');

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0, unit: 'Nos' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const gstAmount = (subtotal * gstRate) / 100;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  const total = subtotal + gstAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const downloadPDF = async () => {
    if (!companyName || !clientName || items.every(i => !i.description)) {
      toast({ title: 'Please fill required details', variant: 'destructive' });
      return;
    }

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Company Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 20, y);
    y += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (companyAddress) { doc.text(companyAddress, 20, y); y += 5; }
    if (companyPhone) { doc.text(`Phone: ${companyPhone}`, 20, y); y += 5; }
    if (companyEmail) { doc.text(`Email: ${companyEmail}`, 20, y); y += 5; }
    if (companyGST) { doc.text(`GSTIN: ${companyGST}`, 20, y); y += 5; }
    
    // Quotation Title
    y += 5;
    doc.setFillColor(59, 130, 246);
    doc.rect(0, y, pageWidth, 10, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('QUOTATION', pageWidth / 2, y + 7, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 18;

    // Quotation Details & Client Info
    const leftCol = 20;
    const rightCol = pageWidth / 2 + 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION TO:', leftCol, y);
    doc.text('QUOTATION DETAILS:', rightCol, y);
    y += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    // Client details
    doc.text(clientName, leftCol, y);
    doc.text(`Quotation No: ${quotationNumber}`, rightCol, y);
    y += 5;
    if (clientAddress) { doc.text(clientAddress, leftCol, y); }
    doc.text(`Date: ${quotationDate}`, rightCol, y);
    y += 5;
    if (clientPhone) { doc.text(`Phone: ${clientPhone}`, leftCol, y); }
    if (validUntil) { doc.text(`Valid Until: ${validUntil}`, rightCol, y); }
    y += 5;
    if (clientEmail) { doc.text(`Email: ${clientEmail}`, leftCol, y); }
    y += 15;

    // Items Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, y, pageWidth - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('#', 20, y + 6);
    doc.text('Description', 30, y + 6);
    doc.text('Unit', 100, y + 6);
    doc.text('Qty', 120, y + 6);
    doc.text('Rate', 140, y + 6);
    doc.text('Amount', 170, y + 6);
    y += 12;

    // Items
    doc.setFont('helvetica', 'normal');
    items.filter(item => item.description).forEach((item, index) => {
      const amount = item.quantity * item.rate;
      doc.text((index + 1).toString(), 20, y);
      doc.text(item.description.substring(0, 40), 30, y);
      doc.text(item.unit, 100, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(formatCurrency(item.rate).replace('₹', ''), 140, y);
      doc.text(formatCurrency(amount).replace('₹', ''), 170, y);
      y += 7;
    });

    // Totals
    y += 5;
    doc.line(15, y, pageWidth - 15, y);
    y += 8;
    
    const totalsX = 140;
    doc.text('Subtotal:', totalsX, y);
    doc.text(formatCurrency(subtotal), 170, y);
    y += 6;
    doc.text(`CGST (${gstRate/2}%):`, totalsX, y);
    doc.text(formatCurrency(cgst), 170, y);
    y += 6;
    doc.text(`SGST (${gstRate/2}%):`, totalsX, y);
    doc.text(formatCurrency(sgst), 170, y);
    y += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(59, 130, 246);
    doc.rect(totalsX - 5, y - 4, 60, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL:', totalsX, y + 3);
    doc.text(formatCurrency(total), 170, y + 3);
    doc.setTextColor(0, 0, 0);
    y += 20;

    // Terms & Conditions
    if (terms) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('TERMS & CONDITIONS:', 20, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const termLines = doc.splitTextToSize(terms, pageWidth - 40);
      doc.text(termLines, 20, y);
      y += termLines.length * 4 + 10;
    }

    // Notes
    if (notes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('NOTES:', 20, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const noteLines = doc.splitTextToSize(notes, pageWidth - 40);
      doc.text(noteLines, 20, y);
    }

    // Footer
    doc.setFontSize(8);
    doc.text('Thank you for your business!', pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });

    doc.save(`quotation-${quotationNumber}-${clientName.replace(/\s+/g, '-')}.pdf`);
    toast({ title: 'Quotation downloaded!' });
  };

  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Your Company Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Company Name *</Label>
                <Input 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Input 
                  value={companyAddress} 
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Company Address"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  value={companyPhone} 
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={companyEmail} 
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="email@company.com"
                />
              </div>
              <div className="col-span-2">
                <Label>GSTIN</Label>
                <Input 
                  value={companyGST} 
                  onChange={(e) => setCompanyGST(e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Client Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Client Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Client Name *</Label>
                <Input 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client/Company Name"
                />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Input 
                  value={clientAddress} 
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Client Address"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  value={clientPhone} 
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={clientEmail} 
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@email.com"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Quotation Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quotation Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Quotation No.</Label>
                <Input 
                  value={quotationNumber} 
                  onChange={(e) => setQuotationNumber(e.target.value)}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input 
                  type="date"
                  value={quotationDate} 
                  onChange={(e) => setQuotationDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Valid Until</Label>
                <Input 
                  type="date"
                  value={validUntil} 
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Items</h3>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label className="text-xs">Description</Label>
                    <Input 
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Unit</Label>
                    <Input 
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      placeholder="Nos"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label className="text-xs">Qty</Label>
                    <Input 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Rate (₹)</Label>
                    <Input 
                      type="number"
                      min="0"
                      value={item.rate || ''}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-sm font-medium">{formatCurrency(item.quantity * item.rate)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Label>GST Rate (%)</Label>
              <Input 
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                className="w-24"
              />
            </div>
          </div>

          <Separator />

          {/* Terms & Notes */}
          <div className="space-y-4">
            <div>
              <Label>Terms & Conditions</Label>
              <Textarea 
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={5}
              />
            </div>
            <div>
              <Label>Additional Notes</Label>
              <Textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes for the client..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Preview</h3>
            <Button onClick={downloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
          
          <div className="bg-background border rounded-lg p-6 text-sm">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold">{companyName || 'Your Company Name'}</h2>
              <p className="text-muted-foreground text-xs">{companyAddress}</p>
              {companyPhone && <p className="text-xs">Phone: {companyPhone}</p>}
              {companyEmail && <p className="text-xs">Email: {companyEmail}</p>}
              {companyGST && <p className="text-xs">GSTIN: {companyGST}</p>}
            </div>

            <div className="bg-primary text-primary-foreground text-center py-2 rounded mb-6">
              <h3 className="font-bold text-lg">QUOTATION</h3>
            </div>

            {/* Client & Quote Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold text-xs text-muted-foreground">QUOTATION TO:</p>
                <p className="font-medium">{clientName || 'Client Name'}</p>
                {clientAddress && <p className="text-xs">{clientAddress}</p>}
                {clientPhone && <p className="text-xs">Phone: {clientPhone}</p>}
                {clientEmail && <p className="text-xs">Email: {clientEmail}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs"><span className="text-muted-foreground">Quotation No:</span> {quotationNumber}</p>
                <p className="text-xs"><span className="text-muted-foreground">Date:</span> {quotationDate}</p>
                {validUntil && <p className="text-xs"><span className="text-muted-foreground">Valid Until:</span> {validUntil}</p>}
              </div>
            </div>

            {/* Items Table */}
            <div className="border rounded overflow-hidden mb-6">
              <div className="grid grid-cols-12 gap-2 p-2 bg-muted/50 text-xs font-semibold">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-1">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
              {items.filter(item => item.description).map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 p-2 border-t text-xs">
                  <div className="col-span-1">{index + 1}</div>
                  <div className="col-span-5">{item.description}</div>
                  <div className="col-span-2">{item.unit}</div>
                  <div className="col-span-1">{item.quantity}</div>
                  <div className="col-span-1">{formatCurrency(item.rate)}</div>
                  <div className="col-span-2 text-right">{formatCurrency(item.quantity * item.rate)}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-64 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>CGST ({gstRate/2}%):</span>
                  <span>{formatCurrency(cgst)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SGST ({gstRate/2}%):</span>
                  <span>{formatCurrency(sgst)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            {terms && (
              <div className="mb-4">
                <p className="font-semibold text-xs mb-2">TERMS & CONDITIONS:</p>
                <p className="text-xs text-muted-foreground whitespace-pre-line">{terms}</p>
              </div>
            )}

            {notes && (
              <div className="mb-4">
                <p className="font-semibold text-xs mb-2">NOTES:</p>
                <p className="text-xs text-muted-foreground">{notes}</p>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground mt-6">
              Thank you for your business!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
