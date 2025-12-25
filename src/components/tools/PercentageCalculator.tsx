import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Percent, ArrowRight } from 'lucide-react';

export default function PercentageCalculator() {
  // Basic percentage
  const [basicPercent, setBasicPercent] = useState('');
  const [basicOf, setBasicOf] = useState('');
  
  // What percent is X of Y
  const [whatIsX, setWhatIsX] = useState('');
  const [whatOfY, setWhatOfY] = useState('');
  
  // Percentage change
  const [changeFrom, setChangeFrom] = useState('');
  const [changeTo, setChangeTo] = useState('');
  
  // Increase/Decrease
  const [incDecValue, setIncDecValue] = useState('');
  const [incDecPercent, setIncDecPercent] = useState('');

  // Calculate results
  const basicResult = basicPercent && basicOf 
    ? (parseFloat(basicPercent) / 100) * parseFloat(basicOf) 
    : null;

  const whatPercentResult = whatIsX && whatOfY && parseFloat(whatOfY) !== 0
    ? (parseFloat(whatIsX) / parseFloat(whatOfY)) * 100 
    : null;

  const percentChangeResult = changeFrom && changeTo && parseFloat(changeFrom) !== 0
    ? ((parseFloat(changeTo) - parseFloat(changeFrom)) / parseFloat(changeFrom)) * 100 
    : null;

  const increaseResult = incDecValue && incDecPercent
    ? parseFloat(incDecValue) * (1 + parseFloat(incDecPercent) / 100)
    : null;

  const decreaseResult = incDecValue && incDecPercent
    ? parseFloat(incDecValue) * (1 - parseFloat(incDecPercent) / 100)
    : null;

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="what-percent">What %</TabsTrigger>
          <TabsTrigger value="change">% Change</TabsTrigger>
          <TabsTrigger value="inc-dec">Inc/Dec</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">What is X% of Y?</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">What is</span>
                <Input
                  type="number"
                  value={basicPercent}
                  onChange={(e) => setBasicPercent(e.target.value)}
                  placeholder="10"
                  className="w-24"
                />
                <span className="text-muted-foreground">% of</span>
                <Input
                  type="number"
                  value={basicOf}
                  onChange={(e) => setBasicOf(e.target.value)}
                  placeholder="200"
                  className="w-32"
                />
                <span className="text-muted-foreground">?</span>
              </div>
            </div>
            
            {basicResult !== null && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{basicPercent}% of {basicOf} =</span>
                  <span className="text-2xl font-bold text-primary">{basicResult.toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="what-percent" className="space-y-4 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">X is what percent of Y?</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <Input
                type="number"
                value={whatIsX}
                onChange={(e) => setWhatIsX(e.target.value)}
                placeholder="25"
                className="w-24"
              />
              <span className="text-muted-foreground">is what % of</span>
              <Input
                type="number"
                value={whatOfY}
                onChange={(e) => setWhatOfY(e.target.value)}
                placeholder="200"
                className="w-32"
              />
              <span className="text-muted-foreground">?</span>
            </div>
            
            {whatPercentResult !== null && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{whatIsX} is</span>
                  <span className="text-2xl font-bold text-primary">{whatPercentResult.toFixed(2)}%</span>
                  <span className="text-muted-foreground">of {whatOfY}</span>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="change" className="space-y-4 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Percentage Change</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="space-y-2">
                <Label>From</Label>
                <Input
                  type="number"
                  value={changeFrom}
                  onChange={(e) => setChangeFrom(e.target.value)}
                  placeholder="100"
                  className="w-32"
                />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-6" />
              <div className="space-y-2">
                <Label>To</Label>
                <Input
                  type="number"
                  value={changeTo}
                  onChange={(e) => setChangeTo(e.target.value)}
                  placeholder="150"
                  className="w-32"
                />
              </div>
            </div>
            
            {percentChangeResult !== null && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Change:</span>
                  <span className={`text-2xl font-bold ${percentChangeResult >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {percentChangeResult >= 0 ? '+' : ''}{percentChangeResult.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {percentChangeResult >= 0 ? 'Increase' : 'Decrease'} of {Math.abs(parseFloat(changeTo) - parseFloat(changeFrom)).toFixed(2)}
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="inc-dec" className="space-y-4 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Increase / Decrease by Percentage</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  type="number"
                  value={incDecValue}
                  onChange={(e) => setIncDecValue(e.target.value)}
                  placeholder="100"
                  className="w-32"
                />
              </div>
              <div className="space-y-2">
                <Label>Percentage</Label>
                <Input
                  type="number"
                  value={incDecPercent}
                  onChange={(e) => setIncDecPercent(e.target.value)}
                  placeholder="20"
                  className="w-24"
                />
              </div>
            </div>
            
            {increaseResult !== null && decreaseResult !== null && (
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Increase by {incDecPercent}%</p>
                  <p className="text-2xl font-bold text-green-500">{increaseResult.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Decrease by {incDecPercent}%</p>
                  <p className="text-2xl font-bold text-red-500">{decreaseResult.toFixed(2)}</p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Percent className="h-5 w-5" />
          Quick Reference
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium">Common Percentages</p>
            <ul className="text-muted-foreground space-y-1 mt-2">
              <li>10% = 1/10 = 0.1</li>
              <li>25% = 1/4 = 0.25</li>
              <li>33.33% = 1/3 ≈ 0.333</li>
              <li>50% = 1/2 = 0.5</li>
              <li>75% = 3/4 = 0.75</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Formulas</p>
            <ul className="text-muted-foreground space-y-1 mt-2">
              <li>X% of Y = (X/100) × Y</li>
              <li>X is what % of Y = (X/Y) × 100</li>
              <li>% Change = ((New-Old)/Old) × 100</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Tips</p>
            <ul className="text-muted-foreground space-y-1 mt-2">
              <li>To find 10%, divide by 10</li>
              <li>To find 1%, divide by 100</li>
              <li>5% = half of 10%</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
