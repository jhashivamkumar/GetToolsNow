import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, FileText } from 'lucide-react';
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

  const updateField = (field: keyof LetterData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generatedLetter = letterTemplates[letterType](data);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({ title: 'Copied to clipboard!' });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(generatedLetter.trim(), 170);
    doc.setFontSize(11);
    doc.text(lines, 20, 20);
    doc.save(`${letterType}-letter.pdf`);
    toast({ title: 'PDF downloaded!' });
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="hero" size="sm" onClick={downloadPDF}>
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" /> Copy Text
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          <Tabs value={letterType} onValueChange={(v) => setLetterType(v as LetterType)}>
            <TabsList className="w-full">
              <TabsTrigger value="offer" className="flex-1">Offer</TabsTrigger>
              <TabsTrigger value="relieving" className="flex-1">Relieving</TabsTrigger>
              <TabsTrigger value="experience" className="flex-1">Experience</TabsTrigger>
              <TabsTrigger value="increment" className="flex-1">Increment</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Company Details */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Company Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={data.companyName} onChange={e => updateField('companyName', e.target.value)} placeholder="ABC Pvt Ltd" />
              </div>
              <div className="space-y-2">
                <Label>Company Address</Label>
                <Textarea value={data.companyAddress} onChange={e => updateField('companyAddress', e.target.value)} placeholder="123 Business Park, Mumbai" rows={2} />
              </div>
            </div>
          </Card>

          {/* Employee Details */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Employee Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Employee Name</Label>
                  <Input value={data.employeeName} onChange={e => updateField('employeeName', e.target.value)} placeholder="Rahul Kumar" />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={data.designation} onChange={e => updateField('designation', e.target.value)} placeholder="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={data.department} onChange={e => updateField('department', e.target.value)} placeholder="Engineering" />
                </div>
                <div className="space-y-2">
                  <Label>Joining Date</Label>
                  <Input value={data.joiningDate} onChange={e => updateField('joiningDate', e.target.value)} placeholder="1st January 2020" />
                </div>
              </div>
              {(letterType === 'relieving' || letterType === 'experience') && (
                <div className="space-y-2">
                  <Label>Last Working Date</Label>
                  <Input value={data.lastWorkingDate} onChange={e => updateField('lastWorkingDate', e.target.value)} placeholder="31st December 2024" />
                </div>
              )}
              {letterType === 'offer' && (
                <div className="space-y-2">
                  <Label>Employee Address</Label>
                  <Textarea value={data.employeeAddress} onChange={e => updateField('employeeAddress', e.target.value)} placeholder="Employee Address" rows={2} />
                </div>
              )}
            </div>
          </Card>

          {/* Salary Details */}
          {(letterType === 'offer' || letterType === 'increment') && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Salary Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{letterType === 'increment' ? 'Current Salary' : 'Salary'}</Label>
                  <Input value={data.salary} onChange={e => updateField('salary', e.target.value)} placeholder="600000" />
                </div>
                {letterType === 'increment' && (
                  <>
                    <div className="space-y-2">
                      <Label>New Salary</Label>
                      <Input value={data.newSalary} onChange={e => updateField('newSalary', e.target.value)} placeholder="720000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Increment %</Label>
                      <Input value={data.incrementPercentage} onChange={e => updateField('incrementPercentage', e.target.value)} placeholder="20" />
                    </div>
                    <div className="space-y-2">
                      <Label>Effective Date</Label>
                      <Input type="date" value={data.effectiveDate} onChange={e => updateField('effectiveDate', e.target.value)} />
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Signatory */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Signatory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={data.signatoryName} onChange={e => updateField('signatoryName', e.target.value)} placeholder="HR Manager Name" />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input value={data.signatoryDesignation} onChange={e => updateField('signatoryDesignation', e.target.value)} placeholder="HR Manager" />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="bg-white text-black rounded-lg p-8 min-h-[600px] font-serif text-sm leading-relaxed whitespace-pre-wrap">
          {generatedLetter}
        </div>
      </div>
    </div>
  );
}
