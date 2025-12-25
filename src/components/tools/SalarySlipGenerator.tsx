import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Download, Plus, Trash2, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EarningItem {
  id: string;
  name: string;
  amount: number;
}

interface DeductionItem {
  id: string;
  name: string;
  amount: number;
}

export default function SalarySlipGenerator() {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [payPeriod, setPayPeriod] = useState('');
  const [payDate, setPayDate] = useState('');
  
  const [earnings, setEarnings] = useState<EarningItem[]>([
    { id: '1', name: 'Basic Salary', amount: 0 },
    { id: '2', name: 'HRA', amount: 0 },
    { id: '3', name: 'Conveyance Allowance', amount: 0 },
    { id: '4', name: 'Medical Allowance', amount: 0 },
    { id: '5', name: 'Special Allowance', amount: 0 },
  ]);

  const [deductions, setDeductions] = useState<DeductionItem[]>([
    { id: '1', name: 'Provident Fund (PF)', amount: 0 },
    { id: '2', name: 'Professional Tax', amount: 0 },
    { id: '3', name: 'Income Tax (TDS)', amount: 0 },
    { id: '4', name: 'ESI', amount: 0 },
  ]);

  const slipRef = useRef<HTMLDivElement>(null);

  const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
  const netPay = totalEarnings - totalDeductions;

  const addEarning = () => {
    setEarnings([...earnings, { id: Date.now().toString(), name: '', amount: 0 }]);
  };

  const removeEarning = (id: string) => {
    setEarnings(earnings.filter(e => e.id !== id));
  };

  const updateEarning = (id: string, field: 'name' | 'amount', value: string | number) => {
    setEarnings(earnings.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addDeduction = () => {
    setDeductions([...deductions, { id: Date.now().toString(), name: '', amount: 0 }]);
  };

  const removeDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const updateDeduction = (id: string, field: 'name' | 'amount', value: string | number) => {
    setDeductions(deductions.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
  };

  const downloadPDF = async () => {
    if (!companyName || !employeeName) {
      toast({ title: 'Please fill company and employee details', variant: 'destructive' });
      return;
    }

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName || 'Company Name', pageWidth / 2, y, { align: 'center' });
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(companyAddress || 'Company Address', pageWidth / 2, y, { align: 'center' });
    y += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SALARY SLIP', pageWidth / 2, y, { align: 'center' });
    y += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`For the month of ${payPeriod}`, pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Employee Details Box
    doc.rect(15, y, pageWidth - 30, 35);
    y += 8;
    
    doc.setFontSize(9);
    doc.text(`Employee Name: ${employeeName}`, 20, y);
    doc.text(`Employee ID: ${employeeId}`, pageWidth / 2 + 10, y);
    y += 7;
    doc.text(`Designation: ${designation}`, 20, y);
    doc.text(`Department: ${department}`, pageWidth / 2 + 10, y);
    y += 7;
    doc.text(`PAN Number: ${panNumber}`, 20, y);
    doc.text(`Bank A/C: ${bankAccount}`, pageWidth / 2 + 10, y);
    y += 7;
    doc.text(`Pay Date: ${payDate}`, 20, y);
    y += 15;

    // Earnings and Deductions
    const tableStartY = y;
    const colWidth = (pageWidth - 30) / 2;
    
    // Earnings Header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, y, colWidth, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('EARNINGS', 20, y + 6);
    doc.text('Amount', 15 + colWidth - 25, y + 6);
    
    // Deductions Header
    doc.rect(15 + colWidth, y, colWidth, 8, 'F');
    doc.text('DEDUCTIONS', 20 + colWidth, y + 6);
    doc.text('Amount', 15 + colWidth * 2 - 25, y + 6);
    y += 10;

    doc.setFont('helvetica', 'normal');
    const maxRows = Math.max(earnings.length, deductions.length);
    
    for (let i = 0; i < maxRows; i++) {
      if (earnings[i]) {
        doc.text(earnings[i].name, 20, y + 5);
        doc.text(formatCurrency(earnings[i].amount), 15 + colWidth - 25, y + 5);
      }
      if (deductions[i]) {
        doc.text(deductions[i].name, 20 + colWidth, y + 5);
        doc.text(formatCurrency(deductions[i].amount), 15 + colWidth * 2 - 25, y + 5);
      }
      y += 7;
    }

    y += 3;
    doc.line(15, y, pageWidth - 15, y);
    y += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Total Earnings', 20, y);
    doc.text(formatCurrency(totalEarnings), 15 + colWidth - 25, y);
    doc.text('Total Deductions', 20 + colWidth, y);
    doc.text(formatCurrency(totalDeductions), 15 + colWidth * 2 - 25, y);
    
    y += 15;
    doc.setFillColor(230, 247, 255);
    doc.rect(15, y - 5, pageWidth - 30, 12, 'F');
    doc.setFontSize(12);
    doc.text(`NET PAY: ${formatCurrency(netPay)}`, pageWidth / 2, y + 2, { align: 'center' });
    
    y += 12;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(`(Rupees ${numberToWords(Math.round(netPay))} Only)`, pageWidth / 2, y, { align: 'center' });
    
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer-generated salary slip and does not require a signature.', pageWidth / 2, y, { align: 'center' });

    doc.save(`salary-slip-${employeeName.replace(/\s+/g, '-')}-${payPeriod.replace(/\s+/g, '-')}.pdf`);
    toast({ title: 'Salary slip downloaded!' });
  };

  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Details
            </h3>
            <div className="grid gap-4">
              <div>
                <Label>Company Name</Label>
                <Input 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ABC Technologies Pvt. Ltd."
                />
              </div>
              <div>
                <Label>Company Address</Label>
                <Input 
                  value={companyAddress} 
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="123, Business Park, Mumbai - 400001"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Employee Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Employee Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employee Name</Label>
                <Input 
                  value={employeeName} 
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Employee ID</Label>
                <Input 
                  value={employeeId} 
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="EMP001"
                />
              </div>
              <div>
                <Label>Designation</Label>
                <Input 
                  value={designation} 
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Input 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Engineering"
                />
              </div>
              <div>
                <Label>PAN Number</Label>
                <Input 
                  value={panNumber} 
                  onChange={(e) => setPanNumber(e.target.value)}
                  placeholder="ABCDE1234F"
                />
              </div>
              <div>
                <Label>Bank Account</Label>
                <Input 
                  value={bankAccount} 
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="XXXX1234"
                />
              </div>
              <div>
                <Label>Pay Period</Label>
                <Input 
                  value={payPeriod} 
                  onChange={(e) => setPayPeriod(e.target.value)}
                  placeholder="December 2024"
                />
              </div>
              <div>
                <Label>Pay Date</Label>
                <Input 
                  type="date"
                  value={payDate} 
                  onChange={(e) => setPayDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Earnings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-green-600">Earnings</h3>
              <Button variant="outline" size="sm" onClick={addEarning}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {earnings.map((item) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <Input 
                    value={item.name}
                    onChange={(e) => updateEarning(item.id, 'name', e.target.value)}
                    placeholder="Component name"
                    className="flex-1"
                  />
                  <Input 
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => updateEarning(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Amount"
                    className="w-32"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeEarning(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Deductions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-red-600">Deductions</h3>
              <Button variant="outline" size="sm" onClick={addDeduction}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {deductions.map((item) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <Input 
                    value={item.name}
                    onChange={(e) => updateDeduction(item.id, 'name', e.target.value)}
                    placeholder="Deduction name"
                    className="flex-1"
                  />
                  <Input 
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => updateDeduction(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="Amount"
                    className="w-32"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeDeduction(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
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
          
          <div ref={slipRef} className="bg-background border rounded-lg p-6 text-sm">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">{companyName || 'Company Name'}</h2>
              <p className="text-muted-foreground text-xs">{companyAddress || 'Company Address'}</p>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">SALARY SLIP</h3>
                <p className="text-muted-foreground text-xs">For the month of {payPeriod || 'Month Year'}</p>
              </div>
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg mb-6 text-xs">
              <div>
                <p><span className="text-muted-foreground">Employee Name:</span> <strong>{employeeName || '-'}</strong></p>
                <p><span className="text-muted-foreground">Designation:</span> {designation || '-'}</p>
                <p><span className="text-muted-foreground">PAN:</span> {panNumber || '-'}</p>
              </div>
              <div>
                <p><span className="text-muted-foreground">Employee ID:</span> {employeeId || '-'}</p>
                <p><span className="text-muted-foreground">Department:</span> {department || '-'}</p>
                <p><span className="text-muted-foreground">Bank A/C:</span> {bankAccount || '-'}</p>
              </div>
            </div>

            {/* Earnings & Deductions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-green-600 border-b pb-2 mb-2">EARNINGS</h4>
                {earnings.filter(e => e.name).map((item) => (
                  <div key={item.id} className="flex justify-between py-1 text-xs">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 font-semibold border-t mt-2">
                  <span>Total Earnings</span>
                  <span className="text-green-600">{formatCurrency(totalEarnings)}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 border-b pb-2 mb-2">DEDUCTIONS</h4>
                {deductions.filter(d => d.name).map((item) => (
                  <div key={item.id} className="flex justify-between py-1 text-xs">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 font-semibold border-t mt-2">
                  <span>Total Deductions</span>
                  <span className="text-red-600">{formatCurrency(totalDeductions)}</span>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-xs mb-1">NET PAY</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(netPay)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                ({numberToWords(Math.round(netPay))} Rupees Only)
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              This is a computer-generated salary slip and does not require a signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
