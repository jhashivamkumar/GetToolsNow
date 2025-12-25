import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingDown, Briefcase } from 'lucide-react';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface CountryTax {
  name: string;
  currency: string;
  symbol: string;
  brackets: TaxBracket[];
  standardDeduction?: number;
  socialSecurity?: number;
}

const countries: Record<string, CountryTax> = {
  us: {
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    brackets: [
      { min: 0, max: 11600, rate: 10 },
      { min: 11600, max: 47150, rate: 12 },
      { min: 47150, max: 100525, rate: 22 },
      { min: 100525, max: 191950, rate: 24 },
      { min: 191950, max: 243725, rate: 32 },
      { min: 243725, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 },
    ],
    standardDeduction: 14600,
    socialSecurity: 7.65,
  },
  uk: {
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    brackets: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12570, max: 50270, rate: 20 },
      { min: 50270, max: 125140, rate: 40 },
      { min: 125140, max: Infinity, rate: 45 },
    ],
    socialSecurity: 12,
  },
  canada: {
    name: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    brackets: [
      { min: 0, max: 55867, rate: 15 },
      { min: 55867, max: 111733, rate: 20.5 },
      { min: 111733, max: 173205, rate: 26 },
      { min: 173205, max: 246752, rate: 29 },
      { min: 246752, max: Infinity, rate: 33 },
    ],
    standardDeduction: 15705,
    socialSecurity: 5.95,
  },
  australia: {
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    brackets: [
      { min: 0, max: 18200, rate: 0 },
      { min: 18200, max: 45000, rate: 19 },
      { min: 45000, max: 120000, rate: 32.5 },
      { min: 120000, max: 180000, rate: 37 },
      { min: 180000, max: Infinity, rate: 45 },
    ],
  },
  germany: {
    name: 'Germany',
    currency: 'EUR',
    symbol: '€',
    brackets: [
      { min: 0, max: 11604, rate: 0 },
      { min: 11604, max: 17005, rate: 14 },
      { min: 17005, max: 66760, rate: 24 },
      { min: 66760, max: 277825, rate: 42 },
      { min: 277825, max: Infinity, rate: 45 },
    ],
    socialSecurity: 20,
  },
};

export default function SalaryCalculatorGlobal() {
  const [country, setCountry] = useState('us');
  const [grossSalary, setGrossSalary] = useState(75000);
  const [additionalDeductions, setAdditionalDeductions] = useState(0);

  const countryInfo = countries[country];

  const result = useMemo(() => {
    const info = countries[country];
    let taxableIncome = grossSalary;
    
    // Apply standard deduction if exists
    if (info.standardDeduction) {
      taxableIncome = Math.max(0, taxableIncome - info.standardDeduction);
    }
    
    // Calculate tax based on brackets
    let incomeTax = 0;
    let remainingIncome = taxableIncome;
    
    for (const bracket of info.brackets) {
      if (remainingIncome <= 0) break;
      
      const bracketRange = bracket.max - bracket.min;
      const taxableInBracket = Math.min(remainingIncome, bracketRange);
      incomeTax += taxableInBracket * (bracket.rate / 100);
      remainingIncome -= taxableInBracket;
    }
    
    // Social security / NI
    const socialSecurityAmount = info.socialSecurity 
      ? grossSalary * (info.socialSecurity / 100) 
      : 0;
    
    const totalDeductions = incomeTax + socialSecurityAmount + additionalDeductions;
    const netSalary = grossSalary - totalDeductions;
    const effectiveRate = (totalDeductions / grossSalary) * 100;
    
    return {
      grossSalary,
      standardDeduction: info.standardDeduction || 0,
      taxableIncome,
      incomeTax,
      socialSecurityAmount,
      additionalDeductions,
      totalDeductions,
      netSalary,
      monthlyNet: netSalary / 12,
      effectiveRate,
    };
  }, [country, grossSalary, additionalDeductions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: countryInfo.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countries).map(([code, info]) => (
                  <SelectItem key={code} value={code}>
                    {info.symbol} {info.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Annual Gross Salary ({countryInfo.symbol})
            </Label>
            <Input
              type="number"
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Additional Deductions (optional)
            </Label>
            <Input
              type="number"
              value={additionalDeductions}
              onChange={(e) => setAdditionalDeductions(Number(e.target.value))}
              min={0}
              placeholder="Retirement, insurance, etc."
            />
          </div>

          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {countryInfo.name} Tax Info
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {countryInfo.standardDeduction && (
                <li>Standard Deduction: {formatCurrency(countryInfo.standardDeduction)}</li>
              )}
              {countryInfo.socialSecurity && (
                <li>Social Security/NI: {countryInfo.socialSecurity}%</li>
              )}
              <li>Tax Brackets: {countryInfo.brackets.length} levels</li>
            </ul>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Annual Take-Home</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(result.netSalary)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {formatCurrency(result.monthlyNet)} / month
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Salary</span>
              <span className="font-medium">{formatCurrency(result.grossSalary)}</span>
            </div>
            
            {result.standardDeduction > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">(-) Standard Deduction</span>
                <span>{formatCurrency(result.standardDeduction)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxable Income</span>
              <span>{formatCurrency(result.taxableIncome)}</span>
            </div>
            
            <hr />
            
            <div className="flex justify-between text-red-500">
              <span>(-) Income Tax</span>
              <span>{formatCurrency(result.incomeTax)}</span>
            </div>
            
            {result.socialSecurityAmount > 0 && (
              <div className="flex justify-between text-red-500">
                <span>(-) Social Security/NI</span>
                <span>{formatCurrency(result.socialSecurityAmount)}</span>
              </div>
            )}
            
            {result.additionalDeductions > 0 && (
              <div className="flex justify-between text-red-500">
                <span>(-) Other Deductions</span>
                <span>{formatCurrency(result.additionalDeductions)}</span>
              </div>
            )}
            
            <hr />
            
            <div className="flex justify-between font-bold text-lg">
              <span>Net Salary</span>
              <span className="text-primary">{formatCurrency(result.netSalary)}</span>
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              Effective Tax Rate: {result.effectiveRate.toFixed(1)}%
            </div>
          </Card>
        </div>
      </div>

      {/* Tax Brackets */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">{countryInfo.name} Tax Brackets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Income Range</th>
                <th className="p-2 text-right">Tax Rate</th>
              </tr>
            </thead>
            <tbody>
              {countryInfo.brackets.map((bracket, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">
                    {formatCurrency(bracket.min)} – {bracket.max === Infinity ? '∞' : formatCurrency(bracket.max)}
                  </td>
                  <td className="p-2 text-right font-medium">{bracket.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Note: These are simplified federal/national rates. Actual taxes may vary based on state/province, filing status, and other factors.
        </p>
      </Card>
    </div>
  );
}
