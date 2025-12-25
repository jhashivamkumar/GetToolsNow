import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Download, Save, Upload, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  skills: string;
  experience: Experience[];
  education: Education[];
}

const initialData: ResumeData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  summary: '',
  skills: '',
  experience: [],
  education: [],
};

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const previewRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof ResumeData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), institution: '', degree: '', field: '', startDate: '', endDate: '' },
      ],
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const saveToLocal = () => {
    localStorage.setItem('resume-data', JSON.stringify(data));
    toast({ title: 'Resume saved locally!' });
  };

  const loadFromLocal = () => {
    const saved = localStorage.getItem('resume-data');
    if (saved) {
      setData(JSON.parse(saved));
      toast({ title: 'Resume loaded!' });
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    
    // Name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(data.name || 'Your Name', 105, y, { align: 'center' });
    y += 10;
    
    // Contact
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const contact = [data.email, data.phone, data.city].filter(Boolean).join(' | ');
    doc.text(contact, 105, y, { align: 'center' });
    y += 15;
    
    // Summary
    if (data.summary) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PROFESSIONAL SUMMARY', 20, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(data.summary, 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 10;
    }
    
    // Experience
    if (data.experience.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('WORK EXPERIENCE', 20, y);
      y += 7;
      
      data.experience.forEach(exp => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(exp.position, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`${exp.startDate} - ${exp.endDate}`, 190, y, { align: 'right' });
        y += 5;
        doc.text(exp.company, 20, y);
        y += 5;
        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, 170);
          doc.text(descLines, 20, y);
          y += descLines.length * 5;
        }
        y += 5;
      });
      y += 5;
    }
    
    // Education
    if (data.education.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('EDUCATION', 20, y);
      y += 7;
      
      data.education.forEach(edu => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`${edu.degree} in ${edu.field}`, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`${edu.startDate} - ${edu.endDate}`, 190, y, { align: 'right' });
        y += 5;
        doc.text(edu.institution, 20, y);
        y += 8;
      });
      y += 5;
    }
    
    // Skills
    if (data.skills) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('SKILLS', 20, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(data.skills, 20, y);
    }
    
    doc.save(`${data.name || 'resume'}.pdf`);
    toast({ title: 'PDF downloaded!' });
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={saveToLocal}>
          <Save className="h-4 w-4 mr-2" /> Save
        </Button>
        <Button variant="outline" size="sm" onClick={loadFromLocal}>
          <Upload className="h-4 w-4 mr-2" /> Load
        </Button>
        <Button variant="hero" size="sm" onClick={downloadPDF}>
          <Download className="h-4 w-4 mr-2" /> Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          <Tabs defaultValue="personal">
            <TabsList className="w-full">
              <TabsTrigger value="personal" className="flex-1">Personal</TabsTrigger>
              <TabsTrigger value="experience" className="flex-1">Experience</TabsTrigger>
              <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
              <TabsTrigger value="skills" className="flex-1">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={data.name} onChange={e => updateField('name', e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={data.email} onChange={e => updateField('email', e.target.value)} placeholder="john@example.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={data.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={data.city} onChange={e => updateField('city', e.target.value)} placeholder="Mumbai, India" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea value={data.summary} onChange={e => updateField('summary', e.target.value)} placeholder="A brief summary of your professional background..." rows={4} />
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4 mt-4">
              {data.experience.map((exp, index) => (
                <Card key={exp.id} className="p-4 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeExperience(exp.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Badge variant="secondary" className="mb-3">Experience {index + 1}</Badge>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder="Software Engineer" />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Tech Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2020" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label>Description</Label>
                    <Textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3} />
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addExperience} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Experience
              </Button>
            </TabsContent>

            <TabsContent value="education" className="space-y-4 mt-4">
              {data.education.map((edu, index) => (
                <Card key={edu.id} className="p-4 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEducation(edu.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Badge variant="secondary" className="mb-3">Education {index + 1}</Badge>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2 col-span-2">
                      <Label>Institution</Label>
                      <Input value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University of Delhi" />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor's" />
                    </div>
                    <div className="space-y-2">
                      <Label>Field</Label>
                      <Input value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} placeholder="2016" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} placeholder="2020" />
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addEducation} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Education
              </Button>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Skills (comma-separated)</Label>
                <Textarea value={data.skills} onChange={e => updateField('skills', e.target.value)} placeholder="JavaScript, React, Node.js, Python, SQL, Git..." rows={4} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        <div className="bg-white text-black rounded-lg p-8 min-h-[600px]" ref={previewRef}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{data.name || 'Your Name'}</h1>
            <p className="text-sm text-gray-600">
              {[data.email, data.phone, data.city].filter(Boolean).join(' • ') || 'email@example.com • +91 12345 67890 • City'}
            </p>
          </div>

          {data.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
              <p className="text-sm text-gray-700">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">WORK EXPERIENCE</h2>
              {data.experience.map(exp => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{exp.position || 'Position'}</p>
                      <p className="text-sm text-gray-600">{exp.company || 'Company'}</p>
                    </div>
                    <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                  </div>
                  {exp.description && <p className="text-xs text-gray-700 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">EDUCATION</h2>
              {data.education.map(edu => (
                <div key={edu.id} className="mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{edu.degree} in {edu.field}</p>
                      <p className="text-sm text-gray-600">{edu.institution || 'Institution'}</p>
                    </div>
                    <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.skills && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-2">SKILLS</h2>
              <p className="text-sm text-gray-700">{data.skills}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
