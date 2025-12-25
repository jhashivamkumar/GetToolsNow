import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Copy, RefreshCw, Check, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeAmbiguous) {
      chars = chars.replace(/[0OIl1|]/g, '');
    }

    if (!chars) {
      toast({ title: 'Please select at least one character type', variant: 'destructive' });
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    
    setPassword(result);
    setCopied(false);
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast({ title: 'Password copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (!password) return { label: 'None', color: 'bg-muted', score: 0 };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', score: 25, icon: ShieldAlert };
    if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', score: 50, icon: Shield };
    if (score <= 5) return { label: 'Good', color: 'bg-blue-500', score: 75, icon: Shield };
    return { label: 'Strong', color: 'bg-green-500', score: 100, icon: ShieldCheck };
  };

  const strength = getStrength();
  const StrengthIcon = strength.icon || Shield;

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Settings */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Password Length</Label>
              <span className="font-semibold">{length} characters</span>
            </div>
            <Slider
              value={[length]}
              onValueChange={([v]) => setLength(v)}
              min={4}
              max={64}
              step={1}
            />
          </div>

          <Card className="p-4 space-y-4">
            <h3 className="font-semibold">Character Types</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase" className="font-normal">Uppercase (A-Z)</Label>
              <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase" className="font-normal">Lowercase (a-z)</Label>
              <Switch id="lowercase" checked={lowercase} onCheckedChange={setLowercase} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers" className="font-normal">Numbers (0-9)</Label>
              <Switch id="numbers" checked={numbers} onCheckedChange={setNumbers} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols" className="font-normal">Symbols (!@#$%...)</Label>
              <Switch id="symbols" checked={symbols} onCheckedChange={setSymbols} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ambiguous" className="font-normal">Exclude Ambiguous</Label>
                <p className="text-xs text-muted-foreground">Removes 0, O, I, l, 1, |</p>
              </div>
              <Switch id="ambiguous" checked={excludeAmbiguous} onCheckedChange={setExcludeAmbiguous} />
            </div>
          </Card>

          <Button onClick={generatePassword} className="w-full" size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Password
          </Button>
        </div>

        {/* Result */}
        <div className="space-y-4">
          <Card className="p-6">
            <Label className="mb-2 block">Generated Password</Label>
            <div className="flex gap-2">
              <Input
                value={password}
                readOnly
                className="font-mono text-lg"
                placeholder="Click generate to create password"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyToClipboard}
                disabled={!password}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {password && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <StrengthIcon className="h-4 w-4" />
                    Password Strength
                  </span>
                  <span className={`font-medium ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strength.color} transition-all`} 
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </Card>

          {password && (
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Password Stats</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Length</p>
                  <p className="font-medium">{password.length} chars</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entropy</p>
                  <p className="font-medium">~{Math.floor(password.length * 4.5)} bits</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uppercase</p>
                  <p className="font-medium">{(password.match(/[A-Z]/g) || []).length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Numbers</p>
                  <p className="font-medium">{(password.match(/[0-9]/g) || []).length}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
