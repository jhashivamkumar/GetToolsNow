import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndianRupee, TrendingDown, Building, User } from 'lucide-react';

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [hraPercent, setHraPercent] = useState(50);
  const [isMetro, setIsMetro] = useState(true);
  const [rentPaid, setRentPaid] = useState(20000);
  const [section80C, setSection80C] = useState(150000);
  const [section80D, setSection80D] = useState(25000);
  const [nps, setNps] = useState(0);
  const [homeLoanInterest, setHomeLoanInterest] = useState(0);

  const result = useMemo(() => {
    const basic = (ctc * basicPercent) / 100;
    const hra = (basic * hraPercent) / 100;
    const monthlyBasic = basic / 12;
    const monthlyHra = hra / 12;
    
    // PF Calculation
    const pfEmployee = Math.min(basic * 0.12, 21600); // Max 1800/month
    const pfEmployer = Math.min(basic * 0.12, 21600);
    
    // Gross Salary
    const specialAllowance = ctc - basic - hra - pfEmployer;
    const gross = basic + hra + specialAllowance;
    
    // HRA Exemption
    const hraReceived = hra;
    const hraExempt1 = hraReceived;
    const hraExempt2 = rentPaid * 12 - 0.1 * basic;
    const hraExempt3 = isMetro ? 0.5 * basic : 0.4 * basic;
    const hraExemption = Math.max(0, Math.min(hraExempt1, hraExempt2, hraExempt3));
    
    // Standard Deduction
    const standardDeduction = 50000;
    
    // Taxable Income Old Regime
    const totalDeductionsOld = Math.min(section80C, 150000) + Math.min(section80D, 50000) + Math.min(nps, 50000) + Math.min(homeLoanInterest, 200000) + standardDeduction + hraExemption;
    const taxableIncomeOld = Math.max(0, gross - totalDeductionsOld);
    
    // Taxable Income New Regime
    const taxableIncomeNew = Math.max(0, gross - standardDeduction);
    
    // Old Regime Tax
    let taxOld = 0;
    if (taxableIncomeOld > 1000000) {
      taxOld = 112500 + (taxableIncomeOld - 1000000) * 0.3;
    } else if (taxableIncomeOld > 500000) {
      taxOld = 12500 + (taxableIncomeOld - 500000) * 0.2;
    } else if (taxableIncomeOld > 250000) {
      taxOld = (taxableIncomeOld - 250000) * 0.05;
    }
    // 87A Rebate
    if (taxableIncomeOld <= 500000) taxOld = 0;
    taxOld = taxOld * 1.04; // 4% cess
    
    // New Regime Tax (FY 2023-24)
    let taxNew = 0;
    if (taxableIncomeNew > 1500000) {
      taxNew = 150000 + (taxableIncomeNew - 1500000) * 0.3;
    } else if (taxableIncomeNew > 1200000) {
      taxNew = 105000 + (taxableIncomeNew - 1200000) * 0.2;
    } else if (taxableIncomeNew > 900000) {
      taxNew = 60000 + (taxableIncomeNew - 900000) * 0.15;
    } else if (taxableIncomeNew > 600000) {
      taxNew = 30000 + (taxableIncomeNew - 600000) * 0.1;
    } else if (taxableIncomeNew > 300000) {
      taxNew = (taxableIncomeNew - 300000) * 0.05;
    }
    // 87A Rebate
    if (taxableIncomeNew <= 700000) taxNew = 0;
    taxNew = taxNew * 1.04; // 4% cess
    
    const bestRegime = taxOld < taxNew ? 'old' : 'new';
    const tax = Math.min(taxOld, taxNew);
    
    // Monthly calculations
    const monthlyGross = gross / 12;
    const monthlyPF = pfEmployee / 12;
    const monthlyTax = tax / 12;
    const monthlyNet = monthlyGross - monthlyPF - monthlyTax;
    
    return {
      basic,
      hra,
      specialAllowance,
      gross,
      pfEmployee,
      pfEmployer,
      hraExemption,
      standardDeduction,
      totalDeductionsOld,
      taxableIncomeOld,
      taxableIncomeNew,
      taxOld,
      taxNew,
      bestRegime,
      tax,
      monthlyBasic,
      monthlyHra,
      monthlyGross,
      monthlyPF,
      monthlyTax,
      monthlyNet,
      annualNet: gross - pfEmployee - tax,
    };
  }, [ctc, basicPercent, hraPercent, isMetro, rentPaid, section80C, section80D, nps, homeLoanInterest]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Salary Details</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Salary Structure
              </h3>
              
              <div className="space-y-2">
                <Label>Annual CTC</Label>
                <Input
                  type="number"
                  value={ctc}
                  onChange={(e) => setCtc(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Basic (% of CTC)</Label>
                <Input
                  type="number"
                  value={basicPercent}
                  onChange={(e) => setBasicPercent(Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label>HRA (% of Basic)</Label>
                <Input
                  type="number"
                  value={hraPercent}
                  onChange={(e) => setHraPercent(Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                HRA Details
              </h3>
              
              <div className="flex items-center justify-between">
                <Label>Metro City (Delhi, Mumbai, etc.)</Label>
                <Switch checked={isMetro} onCheckedChange={setIsMetro} />
              </div>
              
              <div className="space-y-2">
                <Label>Monthly Rent Paid</Label>
                <Input
                  type="number"
                  value={rentPaid}
                  onChange={(e) => setRentPaid(Number(e.target.value))}
                />
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <TrendingDown className="h-5 w-5" />
              Tax Deductions (Old Regime)
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section 80C (Max ₹1.5L)</Label>
                <Input
                  type="number"
                  value={section80C}
                  onChange={(e) => setSection80C(Number(e.target.value))}
                  placeholder="PPF, ELSS, LIC, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Section 80D (Max ₹50K)</Label>
                <Input
                  type="number"
                  value={section80D}
                  onChange={(e) => setSection80D(Number(e.target.value))}
                  placeholder="Health Insurance"
                />
              </div>
              
              <div className="space-y-2">
                <Label>NPS 80CCD(1B) (Max ₹50K)</Label>
                <Input
                  type="number"
                  value={nps}
                  onChange={(e) => setNps(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Home Loan Interest (Max ₹2L)</Label>
                <Input
                  type="number"
                  value={homeLoanInterest}
                  onChange={(e) => setHomeLoanInterest(Number(e.target.value))}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Basic</p>
              <p className="text-xl font-semibold">{formatCurrency(result.basic)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">HRA</p>
              <p className="text-xl font-semibold">{formatCurrency(result.hra)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Special Allowance</p>
              <p className="text-xl font-semibold">{formatCurrency(result.specialAllowance)}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">PF (Employee)</p>
              <p className="text-xl font-semibold">{formatCurrency(result.pfEmployee)}</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Monthly In-Hand</p>
            <p className="text-4xl font-bold text-primary">{formatCurrency(result.monthlyNet)}</p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Annual In-Hand</p>
            <p className="text-3xl font-bold">{formatCurrency(result.annualNet)}</p>
          </div>
        </Card>
      </div>

      {/* Tax Comparison */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Tax Regime Comparison</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${result.bestRegime === 'old' ? 'bg-green-500/10 border border-green-500' : 'bg-muted'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Old Regime</p>
              {result.bestRegime === 'old' && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Better</span>}
            </div>
            <p className="text-sm text-muted-foreground">Taxable: {formatCurrency(result.taxableIncomeOld)}</p>
            <p className="text-xl font-semibold">Tax: {formatCurrency(result.taxOld)}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${result.bestRegime === 'new' ? 'bg-green-500/10 border border-green-500' : 'bg-muted'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">New Regime</p>
              {result.bestRegime === 'new' && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Better</span>}
            </div>
            <p className="text-sm text-muted-foreground">Taxable: {formatCurrency(result.taxableIncomeNew)}</p>
            <p className="text-xl font-semibold">Tax: {formatCurrency(result.taxNew)}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          You save {formatCurrency(Math.abs(result.taxOld - result.taxNew))} with {result.bestRegime === 'old' ? 'Old' : 'New'} Regime
        </p>
      </Card>

      {/* Monthly Breakdown */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Monthly Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gross Salary</span>
            <span className="font-medium">{formatCurrency(result.monthlyGross)}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>(-) PF Deduction</span>
            <span>{formatCurrency(result.monthlyPF)}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>(-) Income Tax</span>
            <span>{formatCurrency(result.monthlyTax)}</span>
          </div>
          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Net In-Hand</span>
            <span className="text-primary">{formatCurrency(result.monthlyNet)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
