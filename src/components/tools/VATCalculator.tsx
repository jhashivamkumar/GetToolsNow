import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, ArrowRight } from 'lucide-react';

const presets = [
  { name: 'United States', rates: ['0%', '5%', '6%', '7%', '8%', '10%'] },
  { name: 'United Kingdom', rates: ['0%', '5%', '20%'] },
  { name: 'European Union', rates: ['0%', '5%', '10%', '15%', '20%', '21%', '23%', '25%'] },
  { name: 'Canada', rates: ['0%', '5%', '13%', '15%'] },
  { name: 'Australia', rates: ['0%', '10%'] },
];

export default function VATCalculator() {
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(20);
  const [calculationType, setCalculationType] = useState<'add' | 'remove'>('add');
  const [preset, setPreset] = useState('');

  const result = useMemo(() => {
    if (calculationType === 'add') {
      const taxAmount = (amount * rate) / 100;
      return {
        netAmount: amount,
        taxAmount,
        totalAmount: amount + taxAmount,
      };
    } else {
      const netAmount = (amount * 100) / (100 + rate);
      const taxAmount = amount - netAmount;
      return {
        netAmount,
        taxAmount,
        totalAmount: amount,
      };
    }
  }, [amount, rate, calculationType]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-3">
            <Label>Calculation Type</Label>
            <RadioGroup value={calculationType} onValueChange={(v) => setCalculationType(v as 'add' | 'remove')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="add" />
                <Label htmlFor="add" className="font-normal">Add tax to amount (Tax Exclusive)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remove" id="remove" />
                <Label htmlFor="remove" className="font-normal">Remove tax from amount (Tax Inclusive)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Tax Rate (%)
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                min={0}
                max={100}
                step={0.1}
                className="w-24"
              />
              <Select value={preset} onValueChange={(v) => { setPreset(v); setRate(parseFloat(v)); }}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Quick rates..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Exempt)</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="7">7% (US avg)</SelectItem>
                  <SelectItem value="10">10% (Australia)</SelectItem>
                  <SelectItem value="13">13% (Canada - Ontario)</SelectItem>
                  <SelectItem value="19">19% (Germany)</SelectItem>
                  <SelectItem value="20">20% (UK)</SelectItem>
                  <SelectItem value="21">21% (Spain, Belgium)</SelectItem>
                  <SelectItem value="23">23% (Portugal, Ireland)</SelectItem>
                  <SelectItem value="25">25% (Sweden, Denmark)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                <span className="text-muted-foreground">Tax ({rate}%)</span>
                <span className="text-xl font-semibold text-orange-500">
                  {calculationType === 'add' ? '+' : ''} {formatCurrency(result.taxAmount)}
                </span>
              </div>
              
              <hr />
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(result.totalAmount)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Formula Used:</p>
            {calculationType === 'add' ? (
              <p className="font-mono text-sm">
                {formatCurrency(amount)} × (1 + {rate}%) = {formatCurrency(result.totalAmount)}
              </p>
            ) : (
              <p className="font-mono text-sm">
                {formatCurrency(amount)} ÷ (1 + {rate}%) = {formatCurrency(result.netAmount)}
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Common Tax Rates by Country</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {presets.map((p) => (
            <div key={p.name} className="p-3 bg-muted rounded-lg">
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.rates.join(', ')}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
