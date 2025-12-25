import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Download, Building, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export default function InvoiceGeneratorGlobal() {
  const [currency, setCurrency] = useState('USD');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [taxLabel, setTaxLabel] = useState('VAT');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0 }
  ]);

  const currencyInfo = currencies.find(c => c.code === currency) || currencies[0];

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const { subtotal, taxAmount, total } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  }, [items, taxRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text('INVOICE', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Invoice #: ${invoiceNumber}`, 140, 20);
    doc.text(`Date: ${invoiceDate}`, 140, 26);
    if (dueDate) doc.text(`Due: ${dueDate}`, 140, 32);
    
    // Business Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('From:', 20, 50);
    doc.setFontSize(10);
    doc.text(businessName || 'Your Business', 20, 58);
    doc.setTextColor(100);
    const businessLines = businessAddress.split('\n');
    businessLines.forEach((line, i) => doc.text(line, 20, 64 + (i * 5)));
    if (businessEmail) doc.text(businessEmail, 20, 64 + businessLines.length * 5);
    
    // Client Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Bill To:', 120, 50);
    doc.setFontSize(10);
    doc.text(clientName || 'Client Name', 120, 58);
    doc.setTextColor(100);
    const clientLines = clientAddress.split('\n');
    clientLines.forEach((line, i) => doc.text(line, 120, 64 + (i * 5)));
    if (clientEmail) doc.text(clientEmail, 120, 64 + clientLines.length * 5);
    
    // Table Header
    let y = 100;
    doc.setFillColor(59, 130, 246);
    doc.rect(20, y, 170, 8, 'F');
    doc.setTextColor(255);
    doc.setFontSize(10);
    doc.text('Description', 25, y + 6);
    doc.text('Qty', 110, y + 6);
    doc.text('Rate', 130, y + 6);
    doc.text('Amount', 160, y + 6);
    
    // Table Rows
    y += 12;
    doc.setTextColor(0);
    items.forEach((item) => {
      const amount = item.quantity * item.rate;
      doc.text(item.description || 'Item', 25, y);
      doc.text(item.quantity.toString(), 110, y);
      doc.text(formatCurrency(item.rate), 130, y);
      doc.text(formatCurrency(amount), 160, y);
      y += 8;
    });
    
    // Totals
    y += 10;
    doc.text('Subtotal:', 130, y);
    doc.text(formatCurrency(subtotal), 160, y);
    
    if (taxRate > 0) {
      y += 8;
      doc.text(`${taxLabel} (${taxRate}%):`, 130, y);
      doc.text(formatCurrency(taxAmount), 160, y);
    }
    
    y += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 130, y);
    doc.text(formatCurrency(total), 160, y);
    
    // Notes
    if (notes) {
      y += 20;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Notes:', 20, y);
      doc.setTextColor(100);
      doc.text(notes, 20, y + 6);
    }
    
    doc.save(`${invoiceNumber}.pdf`);
    toast({ title: 'Invoice downloaded!' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Business Details */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" />
            Your Business
          </h3>
          <div className="space-y-3">
            <div>
              <Label>Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your Company Name" />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Street, City, Country" rows={2} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="business@example.com" />
            </div>
          </div>
        </Card>

        {/* Client Details */}
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Bill To
          </h3>
          <div className="space-y-3">
            <div>
              <Label>Client Name</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client or Company Name" />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Street, City, Country" rows={2} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@example.com" />
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice Meta */}
      <Card className="p-6">
        <div className="grid md:grid-cols-5 gap-4">
          <div>
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Invoice #</Label>
            <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
          </div>
          <div>
            <Label>Invoice Date</Label>
            <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <Label>{taxLabel} Rate (%)</Label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                value={taxRate} 
                onChange={(e) => setTaxRate(Number(e.target.value))} 
                min={0} 
                max={100}
                className="w-20"
              />
              <Input 
                value={taxLabel} 
                onChange={(e) => setTaxLabel(e.target.value)} 
                placeholder="VAT"
                className="w-24"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Line Items</h3>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5">
                <Input 
                  value={item.description} 
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-2">
                <Input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className="col-span-2">
                <Input 
                  type="number" 
                  value={item.rate} 
                  onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="col-span-2 text-right font-medium">
                {formatCurrency(item.quantity * item.rate)}
              </div>
              <div className="col-span-1">
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addItem} className="mt-4">
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </Card>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Label>Notes</Label>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, thank you note, etc."
            rows={4}
          />
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{taxLabel} ({taxRate}%)</span>
              <span className="font-medium">{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
          
          <Button onClick={generatePDF} className="w-full mt-4" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </Card>
      </div>
    </div>
  );
}
