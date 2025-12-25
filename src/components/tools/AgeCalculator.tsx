import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Calendar, Cake, Clock, Heart } from 'lucide-react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  const result = useMemo(() => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    
    if (birth > target) return null;

    // Calculate age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Total calculations
    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      daysUntilBirthday,
      nextBirthday: nextBirthday.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    };
  }, [birthDate, targetDate]);

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Cake className="h-4 w-4" />
              Date of Birth
            </Label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={targetDate}
            />
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Age at Date (optional)
            </Label>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </div>

        {result && (
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Age</p>
              <div className="flex justify-center gap-4 text-center">
                <div>
                  <p className="text-4xl font-bold text-primary">{result.years}</p>
                  <p className="text-sm text-muted-foreground">Years</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">{result.months}</p>
                  <p className="text-sm text-muted-foreground">Months</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary">{result.days}</p>
                  <p className="text-sm text-muted-foreground">Days</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{result.totalMonths.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Months</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{result.totalWeeks.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Weeks</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{result.totalDays.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Days</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{result.totalHours.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <p className="font-semibold">Next Birthday</p>
                <p className="text-muted-foreground">{result.nextBirthday}</p>
                <p className="text-sm text-primary font-medium">{result.daysUntilBirthday} days to go! 🎉</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Lived
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Minutes:</span>
                <span className="font-mono">{result.totalMinutes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hours:</span>
                <span className="font-mono">{result.totalHours.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days:</span>
                <span className="font-mono">{result.totalDays.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weeks:</span>
                <span className="font-mono">{result.totalWeeks.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </>
      )}

      {!result && birthDate && (
        <Card className="p-6 text-center text-muted-foreground">
          <p>Please enter a valid birth date before the target date.</p>
        </Card>
      )}

      {!birthDate && (
        <Card className="p-6 text-center text-muted-foreground">
          <p>Enter your date of birth to calculate your age.</p>
        </Card>
      )}
    </div>
  );
}
