import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Users, DollarSign, Percent } from 'lucide-react';

const tipPresets = [
  { label: 'Poor', value: 10, emoji: '😐' },
  { label: 'Average', value: 15, emoji: '🙂' },
  { label: 'Good', value: 18, emoji: '😊' },
  { label: 'Great', value: 20, emoji: '😄' },
  { label: 'Excellent', value: 25, emoji: '🤩' },
];

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState(50);
  const [tipPercent, setTipPercent] = useState(18);
  const [numPeople, setNumPeople] = useState(1);
  const [roundUp, setRoundUp] = useState(false);

  const tipAmount = (billAmount * tipPercent) / 100;
  let total = billAmount + tipAmount;
  
  if (roundUp) {
    total = Math.ceil(total);
  }
  
  const perPerson = total / numPeople;
  const tipPerPerson = tipAmount / numPeople;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Bill Amount
            </Label>
            <Input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(Number(e.target.value))}
              min={0}
              step={0.01}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Tip Percentage
              </Label>
              <span className="font-semibold">{tipPercent}%</span>
            </div>
            <Slider
              value={[tipPercent]}
              onValueChange={([v]) => setTipPercent(v)}
              min={0}
              max={50}
              step={1}
            />
            <div className="flex flex-wrap gap-2">
              {tipPresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={tipPercent === preset.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTipPercent(preset.value)}
                >
                  {preset.emoji} {preset.value}%
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Split Between
              </Label>
              <span className="font-semibold">{numPeople} {numPeople === 1 ? 'person' : 'people'}</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                disabled={numPeople <= 1}
              >
                -
              </Button>
              <Slider
                value={[numPeople]}
                onValueChange={([v]) => setNumPeople(v)}
                min={1}
                max={20}
                step={1}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setNumPeople(Math.min(20, numPeople + 1))}
                disabled={numPeople >= 20}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="roundup"
              checked={roundUp}
              onChange={(e) => setRoundUp(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="roundup" className="font-normal">Round up total</Label>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Bill</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(total)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Including {formatCurrency(tipAmount)} tip
              </p>
            </div>
          </Card>

          {numPeople > 1 && (
            <Card className="p-6 bg-green-500/5 border-green-500/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Per Person</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(perPerson)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  ({formatCurrency(tipPerPerson)} tip each)
                </p>
              </div>
            </Card>
          )}

          <Card className="p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bill Amount</span>
              <span className="font-medium">{formatCurrency(billAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tip ({tipPercent}%)</span>
              <span className="font-medium text-green-600">+{formatCurrency(tipAmount)}</span>
            </div>
            {roundUp && total !== billAmount + tipAmount && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rounded up</span>
                <span>+{formatCurrency(total - (billAmount + tipAmount))}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Tip Guide */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Tipping Guide</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">🇺🇸 United States</p>
            <p className="text-muted-foreground">15-20% standard, 20-25% for excellent service</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">🇬🇧 United Kingdom</p>
            <p className="text-muted-foreground">10-15% or round up, service charge often included</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">🇪🇺 Europe</p>
            <p className="text-muted-foreground">5-10% or round up, varies by country</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
