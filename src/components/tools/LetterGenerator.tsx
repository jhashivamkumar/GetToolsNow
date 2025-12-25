import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, FileText, Building2, User, Briefcase, TrendingUp, Check, Info, Zap, Sparkles, Award, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

type LetterType = 'offer' | 'relieving' | 'experience' | 'increment';

interface LetterData {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeAddress: string;
  designation: string;
  department: string;
  joiningDate: string;
  lastWorkingDate: string;
  salary: string;
  newSalary: string;
  incrementPercentage: string;
  effectiveDate: string;
  signatoryName: string;
  signatoryDesignation: string;
}

const initialData: LetterData = {
  companyName: '',
  companyAddress: '',
  employeeName: '',
  employeeAddress: '',
  designation: '',
  department: '',
  joiningDate: '',
  lastWorkingDate: '',
  salary: '',
  newSalary: '',
  incrementPercentage: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  signatoryName: '',
  signatoryDesignation: 'HR Manager',
};

const letterTypes = [
  { value: 'offer', label: 'Offer Letter', icon: Award, color: 'text-green-500' },
  { value: 'relieving', label: 'Relieving', icon: Clock, color: 'text-blue-500' },
  { value: 'experience', label: 'Experience', icon: Briefcase, color: 'text-purple-500' },
  { value: 'increment', label: 'Increment', icon: TrendingUp, color: 'text-orange-500' },
];

const letterTemplates = {
  offer: (data: LetterData) => `
${data.companyName}
${data.companyAddress}

Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

To,
${data.employeeName}
${data.employeeAddress}

Subject: Offer of Employment

Dear ${data.employeeName},

We are pleased to offer you the position of ${data.designation} in the ${data.department} department at ${data.companyName}.

Your starting salary will be ₹${data.salary} per annum, and your date of joining is ${data.joiningDate}.

This offer is contingent upon successful completion of background verification and submission of required documents.

Please sign and return a copy of this letter to indicate your acceptance of this offer.

We look forward to welcoming you to our team.

Sincerely,

${data.signatoryName}
${data.signatoryDesignation}
${data.companyName}
`,

  relieving: (data: LetterData) => `
${data.companyName}
${data.companyAddress}

Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

To Whom It May Concern,

RELIEVING LETTER

This is to certify that ${data.employeeName} was employed with ${data.companyName} as ${data.designation} in the ${data.department} department from ${data.joiningDate} to ${data.lastWorkingDate}.

${data.employeeName} has been relieved of all duties and responsibilities with effect from ${data.lastWorkingDate}. All dues have been settled and there are no outstanding liabilities.

We wish ${data.employeeName} all the best in future endeavors.

This letter is issued upon request for official purposes.

Sincerely,

${data.signatoryName}
${data.signatoryDesignation}
${data.companyName}
`,

  experience: (data: LetterData) => `
${data.companyName}
${data.companyAddress}

Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

To Whom It May Concern,

EXPERIENCE CERTIFICATE

This is to certify that ${data.employeeName} was employed with ${data.companyName} from ${data.joiningDate} to ${data.lastWorkingDate}.

During this period, ${data.employeeName} served as ${data.designation} in the ${data.department} department and was responsible for various duties associated with this role.

${data.employeeName} demonstrated excellent professional skills, dedication, and commitment during the tenure with us. The conduct and performance were satisfactory throughout the employment period.

We wish ${data.employeeName} success in all future endeavors.

This certificate is issued at the request of ${data.employeeName} for official purposes.

Sincerely,

${data.signatoryName}
${data.signatoryDesignation}
${data.companyName}
`,

  increment: (data: LetterData) => `
${data.companyName}
${data.companyAddress}

Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

To,
${data.employeeName}
${data.department}

Subject: Salary Increment Letter

Dear ${data.employeeName},

We are pleased to inform you that based on your performance and contribution to the organization, the management has decided to revise your salary.

Your current salary of ₹${data.salary} per annum has been revised to ₹${data.newSalary} per annum, an increment of ${data.incrementPercentage}%.

This revision will be effective from ${data.effectiveDate}.

We appreciate your hard work and dedication and expect you to continue contributing to the growth of the organization.

Congratulations on your well-deserved increment!

Sincerely,

${data.signatoryName}
${data.signatoryDesignation}
${data.companyName}
`,
};

export default function LetterGenerator() {
  const [letterType, setLetterType] = useState<LetterType>('offer');
  const [data, setData] = useState<LetterData>(initialData);
  const [copied, setCopied] = useState(false);

  const updateField = (field: keyof LetterData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generatedLetter = letterTemplates[letterType](data);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast({ title: '✅ Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(generatedLetter.trim(), 170);
    doc.setFontSize(11);
    doc.text(lines, 20, 20);
    doc.save(`${letterType}-letter.pdf`);
    toast({ title: '✅ PDF downloaded!' });
  };

  const currentLetterType = letterTypes.find(t => t.value === letterType);

  return (
    <div className="p-4 md:p-6">
      {/* Pro Tips */}
      <Card variant="glass" className="mb-6 p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">HR Letter Tips</h4>
          <p className="text-xs text-muted-foreground">
            Use company letterhead when printing. For legal compliance, ensure all dates and details are accurate before issuing.
          </p>
        </div>
      </Card>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button 
          size="sm" 
          onClick={downloadPDF}
          className="gap-2 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90"
        >
          <Download className="h-4 w-4" /> Download PDF
        </Button>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-5">
          {/* Letter Type Selector */}
          <Card variant="gradient" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Letter Type</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {letterTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setLetterType(type.value as LetterType)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      letterType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mx-auto mb-1 ${type.color}`} />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Company Details */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Company Details</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Company Name</Label>
                <Input value={data.companyName} onChange={e => updateField('companyName', e.target.value)} placeholder="ABC Pvt Ltd" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Company Address</Label>
                <Textarea value={data.companyAddress} onChange={e => updateField('companyAddress', e.target.value)} placeholder="123 Business Park, Mumbai" rows={2} className="resize-none" />
              </div>
            </div>
          </Card>

          {/* Employee Details */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Employee Details</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Employee Name</Label>
                  <Input value={data.employeeName} onChange={e => updateField('employeeName', e.target.value)} placeholder="Rahul Kumar" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Designation</Label>
                  <Input value={data.designation} onChange={e => updateField('designation', e.target.value)} placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Department</Label>
                  <Input value={data.department} onChange={e => updateField('department', e.target.value)} placeholder="Engineering" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Joining Date</Label>
                  <Input value={data.joiningDate} onChange={e => updateField('joiningDate', e.target.value)} placeholder="1st January 2020" />
                </div>
              </div>
              {(letterType === 'relieving' || letterType === 'experience') && (
                <div className="space-y-2">
                  <Label className="text-xs">Last Working Date</Label>
                  <Input value={data.lastWorkingDate} onChange={e => updateField('lastWorkingDate', e.target.value)} placeholder="31st December 2024" />
                </div>
              )}
              {letterType === 'offer' && (
                <div className="space-y-2">
                  <Label className="text-xs">Employee Address</Label>
                  <Textarea value={data.employeeAddress} onChange={e => updateField('employeeAddress', e.target.value)} placeholder="Employee Address" rows={2} className="resize-none" />
                </div>
              )}
            </div>
          </Card>

          {/* Salary Details */}
          {(letterType === 'offer' || letterType === 'increment') && (
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Salary Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">{letterType === 'increment' ? 'Current Salary (₹/year)' : 'Salary (₹/year)'}</Label>
                  <Input value={data.salary} onChange={e => updateField('salary', e.target.value)} placeholder="600000" />
                </div>
                {letterType === 'increment' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs">New Salary (₹/year)</Label>
                      <Input value={data.newSalary} onChange={e => updateField('newSalary', e.target.value)} placeholder="720000" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Increment %</Label>
                      <Input value={data.incrementPercentage} onChange={e => updateField('incrementPercentage', e.target.value)} placeholder="20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Effective Date</Label>
                      <Input type="date" value={data.effectiveDate} onChange={e => updateField('effectiveDate', e.target.value)} />
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Signatory */}
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Signatory</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Name</Label>
                <Input value={data.signatoryName} onChange={e => updateField('signatoryName', e.target.value)} placeholder="HR Manager Name" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Designation</Label>
                <Input value={data.signatoryDesignation} onChange={e => updateField('signatoryDesignation', e.target.value)} placeholder="HR Manager" />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">Letter Preview</span>
            {currentLetterType && (
              <Badge variant="secondary" className="ml-auto gap-1">
                <currentLetterType.icon className={`h-3 w-3 ${currentLetterType.color}`} />
                {currentLetterType.label}
              </Badge>
            )}
          </div>

          <Card className="bg-white text-black rounded-xl p-6 md:p-8 min-h-[700px] shadow-xl font-serif">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {generatedLetter}
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Zap, label: 'Instant Generation' },
              { icon: Download, label: 'PDF Export' },
              { icon: Copy, label: 'Copy to Clipboard' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}