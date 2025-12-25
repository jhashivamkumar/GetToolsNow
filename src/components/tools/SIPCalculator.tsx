import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { IndianRupee, Percent, Calendar, TrendingUp } from 'lucide-react';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const { futureValue, totalInvested, totalReturns, yearlyBreakdown } = useMemo(() => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = timePeriod * 12;
    
    // SIP Formula: FV = P × [(1 + r)^n – 1] / r × (1 + r)
    const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvested = monthlyInvestment * months;
    const totalReturns = futureValue - totalInvested;

    // Calculate yearly breakdown
    const yearlyBreakdown = [];
    for (let year = 1; year <= timePeriod; year++) {
      const monthsInvested = year * 12;
      const fv = monthlyInvestment * (((Math.pow(1 + monthlyRate, monthsInvested) - 1) / monthlyRate) * (1 + monthlyRate));
      const invested = monthlyInvestment * monthsInvested;
      yearlyBreakdown.push({
        year,
        invested,
        returns: fv - invested,
        total: fv,
      });
    }

    return { futureValue, totalInvested, totalReturns, yearlyBreakdown };
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatLakhs = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Monthly Investment
              </Label>
              <span className="font-semibold">{formatCurrency(monthlyInvestment)}</span>
            </div>
            <Slider
              value={[monthlyInvestment]}
              onValueChange={([v]) => setMonthlyInvestment(v)}
              min={500}
              max={100000}
              step={500}
            />
            <Input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Expected Return (% p.a.)
              </Label>
              <span className="font-semibold">{expectedReturn}%</span>
            </div>
            <Slider
              value={[expectedReturn]}
              onValueChange={([v]) => setExpectedReturn(v)}
              min={1}
              max={30}
              step={0.5}
            />
            <Input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              step={0.5}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Time Period (years)
              </Label>
              <span className="font-semibold">{timePeriod} years</span>
            </div>
            <Slider
              value={[timePeriod]}
              onValueChange={([v]) => setTimePeriod(v)}
              min={1}
              max={40}
              step={1}
            />
            <Input
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-4xl font-bold text-primary">{formatLakhs(futureValue)}</p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Invested Amount</p>
              <p className="text-xl font-semibold">{formatLakhs(totalInvested)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Est. Returns</p>
              <p className="text-xl font-semibold text-green-500">{formatLakhs(totalReturns)}</p>
            </Card>
          </div>

          {/* Visual Breakdown */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Investment vs Returns</p>
            <div className="h-4 rounded-full overflow-hidden flex">
              <div 
                className="bg-primary" 
                style={{ width: `${(totalInvested / futureValue) * 100}%` }}
              />
              <div 
                className="bg-green-500" 
                style={{ width: `${(totalReturns / futureValue) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Invested: {((totalInvested / futureValue) * 100).toFixed(1)}%</span>
              <span>Returns: {((totalReturns / futureValue) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Year-wise Growth
        </h3>
        <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-3 text-left">Year</th>
                <th className="p-3 text-right">Invested</th>
                <th className="p-3 text-right">Returns</th>
                <th className="p-3 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {yearlyBreakdown.map((row) => (
                <tr key={row.year} className="border-t">
                  <td className="p-3">{row.year}</td>
                  <td className="p-3 text-right">{formatLakhs(row.invested)}</td>
                  <td className="p-3 text-right text-green-500">{formatLakhs(row.returns)}</td>
                  <td className="p-3 text-right font-semibold">{formatLakhs(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
