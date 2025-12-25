import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Download, Save, Upload, Eye, User, Briefcase, GraduationCap, Sparkles, Zap, Info, Check, FileText, Palette, RotateCcw } from 'lucide-react';
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

const colorThemes = [
  { name: 'Classic', primary: '#1a1a1a', accent: '#4b5563' },
  { name: 'Ocean', primary: '#0891b2', accent: '#06b6d4' },
  { name: 'Forest', primary: '#16a34a', accent: '#22c55e' },
  { name: 'Royal', primary: '#7c3aed', accent: '#8b5cf6' },
  { name: 'Coral', primary: '#f43f5e', accent: '#fb7185' },
];

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeTheme, setActiveTheme] = useState(colorThemes[0]);
  const [activeTab, setActiveTab] = useState('personal');
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
    toast({ title: '✅ Resume saved locally!' });
  };

  const loadFromLocal = () => {
    const saved = localStorage.getItem('resume-data');
    if (saved) {
      setData(JSON.parse(saved));
      toast({ title: '✅ Resume loaded!' });
    } else {
      toast({ title: 'No saved resume found', variant: 'destructive' });
    }
  };

  const resetData = () => {
    setData(initialData);
    toast({ title: 'Resume cleared' });
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
    toast({ title: '✅ PDF downloaded!' });
  };

  const completionScore = () => {
    let score = 0;
    if (data.name) score += 15;
    if (data.email) score += 10;
    if (data.phone) score += 10;
    if (data.summary) score += 20;
    if (data.experience.length > 0) score += 25;
    if (data.education.length > 0) score += 10;
    if (data.skills) score += 10;
    return score;
  };

  const tabIcons = {
    personal: User,
    experience: Briefcase,
    education: GraduationCap,
    skills: Sparkles,
  };

  return (
    <div className="p-4 md:p-6">
      {/* Pro Tips */}
      <Card variant="glass" className="mb-6 p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Info className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">ATS-Friendly Resume Tips</h4>
          <p className="text-xs text-muted-foreground">
            Use keywords from job descriptions, quantify achievements with numbers, and keep formatting simple for better ATS parsing.
          </p>
        </div>
      </Card>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={saveToLocal} className="gap-2">
          <Save className="h-4 w-4" /> Save Draft
        </Button>
        <Button variant="outline" size="sm" onClick={loadFromLocal} className="gap-2">
          <Upload className="h-4 w-4" /> Load Draft
        </Button>
        <Button variant="ghost" size="sm" onClick={resetData} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <div className="flex-1" />
        <Button 
          size="sm" 
          onClick={downloadPDF}
          className="gap-2 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90"
        >
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          {/* Progress */}
          <Card variant="gradient" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Resume Completion</span>
              <Badge variant={completionScore() >= 80 ? 'success' : 'secondary'}>{completionScore()}%</Badge>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-cyan-500 transition-all duration-500"
                style={{ width: `${completionScore()}%` }}
              />
            </div>
            {completionScore() < 100 && (
              <p className="text-xs text-muted-foreground mt-2">
                Add {!data.summary ? 'a summary, ' : ''}{data.experience.length === 0 ? 'work experience, ' : ''}{!data.skills ? 'skills' : ''} to improve your resume
              </p>
            )}
          </Card>

          {/* Color Themes */}
          <Card variant="glass" className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Accent Color</span>
            </div>
            <div className="flex gap-2">
              {colorThemes.map(theme => (
                <button
                  key={theme.name}
                  onClick={() => setActiveTheme(theme)}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                    activeTheme.name === theme.name ? 'border-primary scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: theme.primary }}
                  title={theme.name}
                >
                  {activeTheme.name === theme.name && (
                    <Check className="h-4 w-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 h-12">
              {(['personal', 'experience', 'education', 'skills'] as const).map(tab => {
                const Icon = tabIcons[tab];
                return (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="personal" className="mt-4 animate-fade-in">
              <Card variant="glass" className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Full Name *</Label>
                    <Input value={data.name} onChange={e => updateField('name', e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Email *</Label>
                    <Input value={data.email} onChange={e => updateField('email', e.target.value)} placeholder="john@example.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Phone *</Label>
                    <Input value={data.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">City</Label>
                    <Input value={data.city} onChange={e => updateField('city', e.target.value)} placeholder="Mumbai, India" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Professional Summary</Label>
                  <Textarea 
                    value={data.summary} 
                    onChange={e => updateField('summary', e.target.value)} 
                    placeholder="A brief summary of your professional background and key achievements..." 
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">{data.summary.length}/500 characters</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="mt-4 space-y-4 animate-fade-in">
              {data.experience.map((exp, index) => (
                <Card key={exp.id} variant="glass" className="p-4 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removeExperience(exp.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Badge variant="secondary" className="mb-3">Experience {index + 1}</Badge>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Position</Label>
                      <Input value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder="Software Engineer" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Company</Label>
                      <Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Tech Corp" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Start Date</Label>
                      <Input value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2020" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">End Date</Label>
                      <Input value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label className="text-xs">Description & Achievements</Label>
                    <Textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="• Led team of 5 engineers&#10;• Increased performance by 40%..." rows={3} className="resize-none" />
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addExperience} className="w-full gap-2 border-dashed">
                <Plus className="h-4 w-4" /> Add Work Experience
              </Button>
            </TabsContent>

            <TabsContent value="education" className="mt-4 space-y-4 animate-fade-in">
              {data.education.map((edu, index) => (
                <Card key={edu.id} variant="glass" className="p-4 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => removeEducation(edu.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Badge variant="secondary" className="mb-3">Education {index + 1}</Badge>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2 col-span-full">
                      <Label className="text-xs">Institution</Label>
                      <Input value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University of Delhi" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Degree</Label>
                      <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor's" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Field of Study</Label>
                      <Input value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Start Year</Label>
                      <Input value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} placeholder="2016" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">End Year</Label>
                      <Input value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} placeholder="2020" />
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addEducation} className="w-full gap-2 border-dashed">
                <Plus className="h-4 w-4" /> Add Education
              </Button>
            </TabsContent>

            <TabsContent value="skills" className="mt-4 animate-fade-in">
              <Card variant="glass" className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Skills & Expertise</h3>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Skills (comma-separated)</Label>
                  <Textarea 
                    value={data.skills} 
                    onChange={e => updateField('skills', e.target.value)} 
                    placeholder="JavaScript, React, Node.js, Python, SQL, Git, AWS, Docker..." 
                    rows={4}
                    className="resize-none"
                  />
                </div>
                {data.skills && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {data.skills.split(',').map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{skill.trim()}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <span className="font-semibold">Live Preview</span>
            <Badge variant="secondary" className="text-xs ml-auto">
              <Zap className="h-3 w-3 mr-1" /> Auto-updating
            </Badge>
          </div>

          <Card className="bg-white text-black rounded-xl p-6 md:p-8 min-h-[700px] shadow-xl" ref={previewRef}>
            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: activeTheme.primary }}>
              <h1 className="text-2xl font-bold" style={{ color: activeTheme.primary }}>
                {data.name || 'Your Name'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {[data.email, data.phone, data.city].filter(Boolean).join(' • ') || 'email@example.com • +91 12345 67890 • City'}
              </p>
            </div>

            {data.summary && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: activeTheme.primary }}>
                  Professional Summary
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
              </div>
            )}

            {data.experience.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: activeTheme.primary }}>
                  Work Experience
                </h2>
                {data.experience.map(exp => (
                  <div key={exp.id} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{exp.position || 'Position'}</p>
                        <p className="text-sm" style={{ color: activeTheme.accent }}>{exp.company || 'Company'}</p>
                      </div>
                      <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {data.education.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: activeTheme.primary }}>
                  Education
                </h2>
                {data.education.map(edu => (
                  <div key={edu.id} className="mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{edu.degree} in {edu.field}</p>
                        <p className="text-sm" style={{ color: activeTheme.accent }}>{edu.institution || 'Institution'}</p>
                      </div>
                      <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.skills && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b" style={{ color: activeTheme.primary }}>
                  Skills
                </h2>
                <p className="text-sm text-gray-700">{data.skills}</p>
              </div>
            )}

            {!data.name && !data.summary && data.experience.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FileText className="h-16 w-16 mb-4 opacity-50" />
                <p>Start filling the form to see your resume</p>
              </div>
            )}
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Zap, label: 'ATS-Optimized' },
              { icon: Download, label: 'PDF Export' },
              { icon: Save, label: 'Auto-Save Draft' },
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