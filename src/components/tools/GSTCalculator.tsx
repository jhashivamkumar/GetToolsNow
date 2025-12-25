import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, Percent, ArrowRight } from 'lucide-react';

export default function GSTCalculator() {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState('18');
  const [calculationType, setCalculationType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [supplyType, setSupplyType] = useState<'intra' | 'inter'>('intra');

  const result = useMemo(() => {
    const rate = parseFloat(gstRate);
    
    let netAmount: number;
    let gstAmount: number;
    let totalAmount: number;

    if (calculationType === 'exclusive') {
      // GST not included - add GST to amount
      netAmount = amount;
      gstAmount = (amount * rate) / 100;
      totalAmount = amount + gstAmount;
    } else {
      // GST included - extract GST from amount
      totalAmount = amount;
      netAmount = (amount * 100) / (100 + rate);
      gstAmount = totalAmount - netAmount;
    }

    const halfGst = gstAmount / 2;

    return {
      netAmount,
      gstAmount,
      totalAmount,
      cgst: supplyType === 'intra' ? halfGst : 0,
      sgst: supplyType === 'intra' ? halfGst : 0,
      igst: supplyType === 'inter' ? gstAmount : 0,
      rate,
    };
  }, [amount, gstRate, calculationType, supplyType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Amount
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-3">
            <Label>Calculation Type</Label>
            <RadioGroup value={calculationType} onValueChange={(v) => setCalculationType(v as 'exclusive' | 'inclusive')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exclusive" id="exclusive" />
                <Label htmlFor="exclusive" className="font-normal">GST Exclusive (Add GST to amount)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inclusive" id="inclusive" />
                <Label htmlFor="inclusive" className="font-normal">GST Inclusive (Extract GST from amount)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              GST Rate
            </Label>
            <Select value={gstRate} onValueChange={setGstRate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (Exempt)</SelectItem>
                <SelectItem value="0.25">0.25%</SelectItem>
                <SelectItem value="3">3%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Supply Type</Label>
            <RadioGroup value={supplyType} onValueChange={(v) => setSupplyType(v as 'intra' | 'inter')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intra" id="intra" />
                <Label htmlFor="intra" className="font-normal">Intra-State (CGST + SGST)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inter" id="inter" />
                <Label htmlFor="inter" className="font-normal">Inter-State (IGST)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Net Amount</span>
                <span className="text-xl font-semibold">{formatCurrency(result.netAmount)}</span>
              </div>
              
              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">GST ({result.rate}%)</span>
                <span className="text-xl font-semibold text-orange-500">+ {formatCurrency(result.gstAmount)}</span>
              </div>
              
              <hr />
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>
          </Card>

          {/* GST Breakdown */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">GST Breakdown</h3>
            
            {supplyType === 'intra' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">CGST ({result.rate / 2}%)</span>
                  <span className="font-medium">{formatCurrency(result.cgst)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">SGST ({result.rate / 2}%)</span>
                  <span className="font-medium">{formatCurrency(result.sgst)}</span>
                </div>
                <hr />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total GST</span>
                  <span className="font-bold">{formatCurrency(result.gstAmount)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">IGST ({result.rate}%)</span>
                  <span className="font-medium">{formatCurrency(result.igst)}</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* GST Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">GST Rate Reference</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">0% - Exempt</p>
            <p className="text-muted-foreground">Fresh vegetables, milk, eggs, newspapers</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">5%</p>
            <p className="text-muted-foreground">Sugar, tea, coffee, edible oil, transport</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">12%</p>
            <p className="text-muted-foreground">Processed foods, computers, mobiles</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">18%</p>
            <p className="text-muted-foreground">Most services, electronics, restaurant food</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
