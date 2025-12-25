import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download, Printer, FileText, Building2, Users, Package, Calculator, Info, Zap, IndianRupee, Receipt } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  businessName: string;
  businessAddress: string;
  gstin: string;
  clientName: string;
  clientAddress: string;
  clientGstin: string;
  items: InvoiceItem[];
  gstRate: number;
  notes: string;
}

const initialData: InvoiceData = {
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  businessName: '',
  businessAddress: '',
  gstin: '',
  clientName: '',
  clientAddress: '',
  clientGstin: '',
  items: [{ id: '1', description: '', quantity: 1, rate: 0 }],
  gstRate: 18,
  notes: '',
};

const gstPresets = [
  { label: '0%', value: 0 },
  { label: '5%', value: 5 },
  { label: '12%', value: 12 },
  { label: '18%', value: 18 },
  { label: '28%', value: 28 },
];

export default function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(initialData);

  const updateField = (field: keyof InvoiceData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }],
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeItem = (id: string) => {
    if (data.items.length > 1) {
      setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
    }
  };

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const cgst = (subtotal * data.gstRate) / 200;
  const sgst = (subtotal * data.gstRate) / 200;
  const total = subtotal + cgst + sgst;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 105, y, { align: 'center' });
    y += 15;

    // Invoice details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${data.invoiceNumber}`, 20, y);
    doc.text(`Date: ${data.invoiceDate}`, 190, y, { align: 'right' });
    y += 15;

    // From
    doc.setFont('helvetica', 'bold');
    doc.text('From:', 20, y);
    doc.setFont('helvetica', 'normal');
    y += 5;
    doc.text(data.businessName || 'Your Business', 20, y);
    y += 5;
    if (data.businessAddress) {
      const addrLines = doc.splitTextToSize(data.businessAddress, 80);
      doc.text(addrLines, 20, y);
      y += addrLines.length * 5;
    }
    if (data.gstin) {
      doc.text(`GSTIN: ${data.gstin}`, 20, y);
      y += 5;
    }

    // To (same y level)
    let toY = y - 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 120, toY);
    doc.setFont('helvetica', 'normal');
    toY += 5;
    doc.text(data.clientName || 'Client Name', 120, toY);
    toY += 5;
    if (data.clientAddress) {
      const addrLines = doc.splitTextToSize(data.clientAddress, 70);
      doc.text(addrLines, 120, toY);
    }

    y += 15;

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y, 170, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 22, y + 5);
    doc.text('Qty', 120, y + 5);
    doc.text('Rate', 140, y + 5);
    doc.text('Amount', 165, y + 5);
    y += 12;

    // Items
    doc.setFont('helvetica', 'normal');
    data.items.forEach(item => {
      doc.text(item.description || '-', 22, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(formatCurrency(item.rate), 140, y);
      doc.text(formatCurrency(item.quantity * item.rate), 165, y);
      y += 7;
    });

    y += 10;

    // Totals
    doc.text('Subtotal:', 140, y);
    doc.text(formatCurrency(subtotal), 190, y, { align: 'right' });
    y += 6;
    doc.text(`CGST (${data.gstRate / 2}%):`, 140, y);
    doc.text(formatCurrency(cgst), 190, y, { align: 'right' });
    y += 6;
    doc.text(`SGST (${data.gstRate / 2}%):`, 140, y);
    doc.text(formatCurrency(sgst), 190, y, { align: 'right' });
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 140, y);
    doc.text(formatCurrency(total), 190, y, { align: 'right' });

    // Notes
    if (data.notes) {
      y += 20;
      doc.setFont('helvetica', 'normal');
      doc.text('Notes:', 20, y);
      y += 5;
      const noteLines = doc.splitTextToSize(data.notes, 170);
      doc.text(noteLines, 20, y);
    }

    doc.save(`${data.invoiceNumber}.pdf`);
    toast({ title: '✅ Invoice downloaded!' });
  };

  return (
    <div className="p-4 md:p-6">
      {/* Pro Tips */}
      <Card variant="glass" className="mb-6 p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">GST Invoice Tips</h4>
          <p className="text-xs text-muted-foreground">
            Include your GSTIN for B2B invoices. Use CGST + SGST for intra-state and IGST for inter-state transactions.
          </p>
        </div>
      </Card>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button 
          size="sm" 
          onClick={downloadPDF}
          className="gap-2 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90"
        >
          <Download className="h-4 w-4" /> Download PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Print
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-5">
          {/* Invoice Details */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Invoice Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Invoice No.</Label>
                <Input value={data.invoiceNumber} onChange={e => updateField('invoiceNumber', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Invoice Date</Label>
                <Input type="date" value={data.invoiceDate} onChange={e => updateField('invoiceDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Due Date</Label>
                <Input type="date" value={data.dueDate} onChange={e => updateField('dueDate', e.target.value)} />
              </div>
            </div>
          </Card>

          {/* Business Details */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Your Business</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Business Name</Label>
                <Input value={data.businessName} onChange={e => updateField('businessName', e.target.value)} placeholder="Your Company Pvt Ltd" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Address</Label>
                <Textarea value={data.businessAddress} onChange={e => updateField('businessAddress', e.target.value)} placeholder="123 Business Street, City" rows={2} className="resize-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">GSTIN</Label>
                <Input value={data.gstin} onChange={e => updateField('gstin', e.target.value)} placeholder="22AAAAA0000A1Z5" className="font-mono" />
              </div>
            </div>
          </Card>

          {/* Client Details */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Bill To</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Client Name</Label>
                <Input value={data.clientName} onChange={e => updateField('clientName', e.target.value)} placeholder="Client Company" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Address</Label>
                <Textarea value={data.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} placeholder="Client Address" rows={2} className="resize-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Client GSTIN (optional)</Label>
                <Input value={data.clientGstin} onChange={e => updateField('clientGstin', e.target.value)} placeholder="22BBBBB0000B1Z5" className="font-mono" />
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card variant="gradient" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Line Items</h3>
              <Badge variant="secondary" className="ml-auto">{data.items.length} item(s)</Badge>
            </div>
            <div className="space-y-3">
              {data.items.map((item, index) => (
                <div key={item.id} className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Item {index + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)} disabled={data.items.length === 1}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-6 space-y-1">
                      <Input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Description" className="text-sm" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} min={1} className="text-sm" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} min={0} className="text-sm" />
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <span className="text-sm font-medium">{formatCurrency(item.quantity * item.rate)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addItem} size="sm" className="w-full gap-2 border-dashed">
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </div>
          </Card>

          {/* GST & Notes */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tax & Notes</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-xs mb-2 block">GST Rate</Label>
                <div className="flex gap-2">
                  {gstPresets.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => updateField('gstRate', preset.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        data.gstRate === preset.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Notes / Payment Terms</Label>
                <Textarea value={data.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Payment terms, bank details, etc." rows={3} className="resize-none" />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">Invoice Preview</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              <Zap className="h-3 w-3 mr-1" /> Live
            </Badge>
          </div>

          <Card className="bg-white text-black rounded-xl p-6 md:p-8 min-h-[700px] shadow-xl">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">TAX INVOICE</h1>
            </div>

            <div className="flex justify-between mb-6 text-sm">
              <div className="space-y-1">
                <p><strong>Invoice No:</strong> {data.invoiceNumber}</p>
                <p><strong>Date:</strong> {data.invoiceDate}</p>
                {data.dueDate && <p><strong>Due Date:</strong> {data.dueDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-bold text-xs text-gray-500 mb-1">FROM</p>
                <p className="font-semibold text-sm">{data.businessName || 'Your Business'}</p>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">{data.businessAddress}</p>
                {data.gstin && <p className="text-xs mt-1"><strong>GSTIN:</strong> {data.gstin}</p>}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-bold text-xs text-gray-500 mb-1">BILL TO</p>
                <p className="font-semibold text-sm">{data.clientName || 'Client Name'}</p>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">{data.clientAddress}</p>
                {data.clientGstin && <p className="text-xs mt-1"><strong>GSTIN:</strong> {data.clientGstin}</p>}
              </div>
            </div>

            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 rounded-l-lg">#</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Qty</th>
                  <th className="text-right p-2">Rate</th>
                  <th className="text-right p-2 rounded-r-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="p-2 text-gray-500">{index + 1}</td>
                    <td className="p-2">{item.description || '-'}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">{formatCurrency(item.rate)}</td>
                    <td className="p-2 text-right font-medium">{formatCurrency(item.quantity * item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">CGST ({data.gstRate / 2}%)</span>
                  <span>{formatCurrency(cgst)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">SGST ({data.gstRate / 2}%)</span>
                  <span>{formatCurrency(sgst)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {data.notes && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="font-semibold text-xs text-gray-500 mb-1">NOTES</p>
                <p className="text-sm text-gray-600">{data.notes}</p>
              </div>
            )}
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: IndianRupee, label: 'GST Ready' },
              { icon: Download, label: 'PDF Export' },
              { icon: Printer, label: 'Print Ready' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}