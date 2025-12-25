import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Download, Printer } from 'lucide-react';
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
    toast({ title: 'Invoice downloaded!' });
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="hero" size="sm" onClick={downloadPDF}>
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" /> Print
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          {/* Invoice Details */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Invoice Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Invoice No.</Label>
                <Input value={data.invoiceNumber} onChange={e => updateField('invoiceNumber', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input type="date" value={data.invoiceDate} onChange={e => updateField('invoiceDate', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={data.dueDate} onChange={e => updateField('dueDate', e.target.value)} />
              </div>
            </div>
          </Card>

          {/* Business Details */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Your Business</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input value={data.businessName} onChange={e => updateField('businessName', e.target.value)} placeholder="Your Company Pvt Ltd" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={data.businessAddress} onChange={e => updateField('businessAddress', e.target.value)} placeholder="123 Business Street, City" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input value={data.gstin} onChange={e => updateField('gstin', e.target.value)} placeholder="22AAAAA0000A1Z5" />
              </div>
            </div>
          </Card>

          {/* Client Details */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Bill To</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input value={data.clientName} onChange={e => updateField('clientName', e.target.value)} placeholder="Client Company" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={data.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} placeholder="Client Address" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Client GSTIN (optional)</Label>
                <Input value={data.clientGstin} onChange={e => updateField('clientGstin', e.target.value)} placeholder="22BBBBB0000B1Z5" />
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-3">
              {data.items.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Item description" />
                  </div>
                  <div className="w-20 space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} min={1} />
                  </div>
                  <div className="w-28 space-y-1">
                    <Label className="text-xs">Rate (₹)</Label>
                    <Input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} min={0} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} disabled={data.items.length === 1}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addItem} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </Card>

          {/* GST & Notes */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GST Rate (%)</Label>
                <Input type="number" value={data.gstRate} onChange={e => updateField('gstRate', Number(e.target.value))} min={0} max={28} />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label>Notes</Label>
              <Textarea value={data.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Payment terms, bank details, etc." rows={3} />
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="bg-white text-black rounded-lg p-8 min-h-[600px]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">TAX INVOICE</h1>
          </div>

          <div className="flex justify-between mb-6 text-sm">
            <div>
              <p><strong>Invoice No:</strong> {data.invoiceNumber}</p>
              <p><strong>Date:</strong> {data.invoiceDate}</p>
              {data.dueDate && <p><strong>Due Date:</strong> {data.dueDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="font-bold text-gray-700 mb-1">From:</p>
              <p className="font-semibold">{data.businessName || 'Your Business'}</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.businessAddress}</p>
              {data.gstin && <p className="text-sm"><strong>GSTIN:</strong> {data.gstin}</p>}
            </div>
            <div>
              <p className="font-bold text-gray-700 mb-1">Bill To:</p>
              <p className="font-semibold">{data.clientName || 'Client Name'}</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.clientAddress}</p>
              {data.clientGstin && <p className="text-sm"><strong>GSTIN:</strong> {data.clientGstin}</p>}
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">#</th>
                <th className="text-left p-2">Description</th>
                <th className="text-right p-2">Qty</th>
                <th className="text-right p-2">Rate</th>
                <th className="text-right p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.description || '-'}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                  <td className="p-2 text-right">{formatCurrency(item.rate)}</td>
                  <td className="p-2 text-right">{formatCurrency(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST ({data.gstRate / 2}%):</span>
                <span>{formatCurrency(cgst)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST ({data.gstRate / 2}%):</span>
                <span>{formatCurrency(sgst)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {data.notes && (
            <div className="mt-8 pt-4 border-t">
              <p className="font-semibold text-sm">Notes:</p>
              <p className="text-sm text-gray-600">{data.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
