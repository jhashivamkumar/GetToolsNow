import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.5 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.88 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 17.15 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1325 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.42 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.68 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.64 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.45 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rate: 3.75 },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const fromInfo = currencies.find(c => c.code === fromCurrency)!;
  const toInfo = currencies.find(c => c.code === toCurrency)!;

  const { convertedAmount, exchangeRate } = useMemo(() => {
    // Convert to USD first, then to target currency
    const inUSD = amount / fromInfo.rate;
    const convertedAmount = inUSD * toInfo.rate;
    const exchangeRate = toInfo.rate / fromInfo.rate;
    
    return { convertedAmount, exchangeRate };
  }, [amount, fromInfo, toInfo]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value: number, currency: typeof currencies[0]) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const quickAmounts = [1, 10, 50, 100, 500, 1000];

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-3 gap-4 items-end">
        {/* From */}
        <div className="space-y-2">
          <Label>From</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(c => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code} - {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={0}
            step={0.01}
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center pb-2">
          <Button variant="outline" size="icon" onClick={swapCurrencies}>
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <Label>To</Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(c => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code} - {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={formatCurrency(convertedAmount, toInfo)}
            readOnly
            className="bg-muted/50 font-medium"
          />
        </div>
      </div>

      {/* Result Card */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="text-center">
          <p className="text-lg">
            {formatCurrency(amount, fromInfo)} =
          </p>
          <p className="text-4xl font-bold text-primary my-2">
            {formatCurrency(convertedAmount, toInfo)}
          </p>
          <p className="text-sm text-muted-foreground">
            1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
          </p>
        </div>
      </Card>

      {/* Quick Amounts */}
      <div className="space-y-2">
        <Label>Quick Convert</Label>
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((amt) => (
            <Button
              key={amt}
              variant={amount === amt ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAmount(amt)}
            >
              {fromInfo.symbol}{amt}
            </Button>
          ))}
        </div>
      </div>

      {/* Conversion Table */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Quick Reference</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{fromCurrency} to {toCurrency}</p>
            <div className="space-y-1 text-sm">
              {[1, 5, 10, 50, 100, 500, 1000].map(amt => (
                <div key={amt} className="flex justify-between">
                  <span>{fromInfo.symbol}{amt}</span>
                  <span className="font-medium">{formatCurrency(amt * exchangeRate, toInfo)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">{toCurrency} to {fromCurrency}</p>
            <div className="space-y-1 text-sm">
              {[1, 5, 10, 50, 100, 500, 1000].map(amt => (
                <div key={amt} className="flex justify-between">
                  <span>{toInfo.symbol}{amt}</span>
                  <span className="font-medium">{formatCurrency(amt / exchangeRate, fromInfo)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          Rates are indicative and may differ from actual market rates
        </p>
      </Card>
    </div>
  );
}
