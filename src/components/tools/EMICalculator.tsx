import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { IndianRupee, Calendar, Percent, TrendingUp } from 'lucide-react';

interface AmortizationRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(60);

  const { emi, totalAmount, totalInterest, schedule } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    const schedule: AmortizationRow[] = [];
    let balance = principal;

    for (let month = 1; month <= tenure; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;

      schedule.push({
        month,
        emi: Math.round(emi),
        principal: Math.round(principalPaid),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    return { emi, totalAmount, totalInterest, schedule };
  }, [principal, rate, tenure]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
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
                Loan Amount
              </Label>
              <span className="font-semibold">{formatCurrency(principal)}</span>
            </div>
            <Slider
              value={[principal]}
              onValueChange={([v]) => setPrincipal(v)}
              min={100000}
              max={10000000}
              step={50000}
              className="w-full"
            />
            <Input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Interest Rate (% p.a.)
              </Label>
              <span className="font-semibold">{rate}%</span>
            </div>
            <Slider
              value={[rate]}
              onValueChange={([v]) => setRate(v)}
              min={5}
              max={20}
              step={0.1}
              className="w-full"
            />
            <Input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              step={0.1}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Loan Tenure (months)
              </Label>
              <span className="font-semibold">{tenure} months ({(tenure / 12).toFixed(1)} years)</span>
            </div>
            <Slider
              value={[tenure]}
              onValueChange={([v]) => setTenure(v)}
              min={12}
              max={360}
              step={12}
              className="w-full"
            />
            <Input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="mt-2"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(emi)}</p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Principal Amount</p>
              <p className="text-xl font-semibold">{formatCurrency(principal)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-xl font-semibold text-orange-500">{formatCurrency(totalInterest)}</p>
            </Card>
          </div>

          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Amount Payable</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          </Card>

          {/* Visual Breakdown */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Payment Breakdown</p>
            <div className="h-4 rounded-full overflow-hidden flex">
              <div 
                className="bg-primary" 
                style={{ width: `${(principal / totalAmount) * 100}%` }}
                title="Principal"
              />
              <div 
                className="bg-orange-500" 
                style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
                title="Interest"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Principal: {((principal / totalAmount) * 100).toFixed(1)}%</span>
              <span>Interest: {((totalInterest / totalAmount) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Amortization Schedule
        </h3>
        <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-right">EMI</th>
                <th className="p-3 text-right">Principal</th>
                <th className="p-3 text-right">Interest</th>
                <th className="p-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month} className="border-t">
                  <td className="p-3">{row.month}</td>
                  <td className="p-3 text-right">{formatCurrency(row.emi)}</td>
                  <td className="p-3 text-right text-primary">{formatCurrency(row.principal)}</td>
                  <td className="p-3 text-right text-orange-500">{formatCurrency(row.interest)}</td>
                  <td className="p-3 text-right">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
