
'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import {
  BookText,
  Loader2,
  Download,
  Sparkles,
  Layers,
  XCircle,
  Upload,
  Printer,
  FileCheck,
} from 'lucide-react';

import { generateTestPaper } from '@/ai/flows/generate-test-paper';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Helper to convert file to Base64
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const QUESTION_TYPES = [
  { id: 'mcq', label: 'Multiple Choice' },
  { id: 'short-answer', label: 'Short Answer' },
  { id: 'essay', label: 'Essay' },
  { id: 'fill-in-the-blanks', label: 'Fill in the Blanks' },
  { id: 'true-false', label: 'True/False' },
  { id: 'matching', label: 'Matching' },
  { id: 'definitions', label: 'Definitions' },
  { id: 'diagram', label: 'Diagram Questions' },
  { id: 'problem-solving', label: 'Problem Solving' },
  { id: 'case-study', label: 'Case Study' },
];

const LANGUAGES = [
    { value: 'English', label: 'English' },
    { value: 'Assamese', label: 'Assamese' },
    { value: 'Bengali', label: 'Bengali' },
    { value: 'Bodo', label: 'Bodo' },
    { value: 'Dogri', label: 'Dogri' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Kannada', label: 'Kannada' },
    { value: 'Kashmiri', label: 'Kashmiri' },
    { value: 'Konkani', label: 'Konkani' },
    { value: 'Maithili', label: 'Maithili' },
    { value: 'Malayalam', label: 'Malayalam' },
    { value: 'Manipuri', label: 'Manipuri' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Nepali', label: 'Nepali' },
    { value: 'Odia', label: 'Odia' },
    { value: 'Punjabi', label: 'Punjabi' },
    { value: 'Sanskrit', label: 'Sanskrit' },
    { value: 'Santali', label: 'Santali' },
    { value: 'Sindhi', label: 'Sindhi' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Telugu', label: 'Telugu' },
    { value: 'Urdu', label: 'Urdu' },
];


export default function PaperGeneratorPage() {
  const { toast } = useToast();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [marks, setMarks] = useState('10');
  const [language, setLanguage] = useState('English');
  const [examFormat, setExamFormat] = useState('');
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const [generatedTest, setGeneratedTest] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formatFileInputRef = useRef<HTMLInputElement>(null);
  const [formatImageFile, setFormatImageFile] = useState<File | null>(null);
  const [formatImagePreview, setFormatImagePreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      // Basic validation for image type
      for (const file of newFiles) {
        if (!file.type.startsWith('image/')) {
          toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload only image files (e.g., PNG, JPG, WEBP).',
          });
          return;
        }
      }
      
      const currentFiles = [...imageFiles, ...newFiles];
      setImageFiles(currentFiles);

      const newPreviews: string[] = [];
      const filePromises = newFiles.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push(reader.result as string);
            resolve("");
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then(() => {
        setImagePreviews([...imagePreviews, ...newPreviews]);
      });
    }
  };

  const handleFormatImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an image file for the format.',
        });
        return;
      }
      setFormatImageFile(file);
      toBase64(file).then(setFormatImagePreview);
    }
  }

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  }

  const removeFormatImage = () => {
    setFormatImageFile(null);
    setFormatImagePreview(null);
  }

  const handleQuestionTypeChange = (checked: boolean, typeLabel: string) => {
    setQuestionTypes(prev => 
      checked ? [...prev, typeLabel] : prev.filter(t => t !== typeLabel)
    );
  };

  const handleGenerateTest = async () => {
    if (imageFiles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Images Selected',
        description: 'Please upload at least one image to generate a test paper.',
      });
      return;
    }
    
    if (!marks || parseInt(marks, 10) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Marks',
        description: 'Please enter a valid number for total marks.',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedTest(null);

    try {
      const photoDataUris = await Promise.all(imageFiles.map(toBase64));
      const formatPhotoDataUri = formatImageFile ? await toBase64(formatImageFile) : undefined;

      const result = await generateTestPaper({
        photoDataUris,
        marks: parseInt(marks, 10),
        language,
        examFormat,
        questionTypes,
        formatPhotoDataUri,
      });
      setGeneratedTest(result.testPaper);
      toast({
        title: 'Success!',
        description: 'Your test paper has been generated.',
      });
       setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error generating test paper:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'Something went wrong. Please try again with a clearer image.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrint = () => {
    if (generatedTest) {
        const printContent = document.getElementById('printable-area');
        if (printContent) {
            const newWindow = window.open('', '', 'height=800, width=800');
            newWindow?.document.write('<html><head><title>Print</title>');
            newWindow?.document.write('<style>body { font-family: sans-serif; } pre { white-space: pre-wrap; font-family: sans-serif; }</style>');
            newWindow?.document.write('</head><body>');
            newWindow?.document.write(printContent.innerHTML);
            newWindow?.document.write('</body></html>');
            newWindow?.document.close();
            newWindow?.focus();
            newWindow?.print();
            newWindow?.close();
        }
    }
  };

  const handleDownload = () => {
    if (!generatedTest) return;
    const blob = new Blob([generatedTest], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-paper.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
        title: 'Downloaded',
        description: 'The test paper has been saved as a text file.',
      });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Layers className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Paper Generator</h1>
          <p className="text-muted-foreground">
            Upload textbook pages to create custom test papers.
          </p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <BookText />
            Create Your Test
          </CardTitle>
          <CardDescription>
            Upload textbook pages, set marks, and customize the format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="font-bold">1. Upload Textbook Pages</Label>
            <div>
              <input
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                multiple
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2" />
                Upload Images
              </Button>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={src}
                      alt={`Selected preview ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label className="font-bold">2. Configure Test</Label>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="marks-input">
                  Total Marks
                </Label>
                <Input
                  id="marks-input"
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="E.g. 25"
                  min="1"
                  className="w-full max-w-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language-select">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger
                    id="language-select"
                    className="w-full max-w-xs"
                  >
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="font-bold">3. Customize Questions (Optional)</Label>
            <div className="space-y-2">
                <Label>Question Types</Label>
                <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
                    {QUESTION_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center gap-2">
                        <Checkbox
                        id={type.id}
                        onCheckedChange={(checked) =>
                            handleQuestionTypeChange(checked as boolean, type.label)
                        }
                        />
                        <Label htmlFor={type.id} className="font-normal">
                        {type.label}
                        </Label>
                    </div>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="exam-format-input">
                Exam Format Instructions
                </Label>
                <Textarea
                id="exam-format-input"
                value={examFormat}
                onChange={(e) => setExamFormat(e.target.value)}
                placeholder="e.g., 'Section A contains 10 multiple choice questions...' or upload a format image below."
                className="min-h-[100px]"
                />
            </div>
            <div className="space-y-2">
                <Label>Upload Format Image</Label>
                <div>
                <input
                    ref={formatFileInputRef}
                    id="format-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFormatImageChange}
                />
                <Button
                    variant="secondary"
                    onClick={() => formatFileInputRef.current?.click()}
                >
                    <Upload className="mr-2" />
                    Upload Format Image
                </Button>
                </div>
                {formatImagePreview && (
                    <div className="relative aspect-square w-24 mt-2">
                        <Image
                        src={formatImagePreview}
                        alt="Format preview"
                        fill
                        className="rounded-lg object-cover"
                        />
                        <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFormatImage();
                        }}
                        >
                        <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
          </div>


        </CardContent>
        <CardFooter className="flex-col gap-4 items-stretch">
          <Button
            onClick={handleGenerateTest}
            disabled={imageFiles.length === 0 || isLoading}
            className="w-full font-bold"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Generate Test Paper'}
          </Button>
          {generatedTest && !isLoading && (
            <Button
                onClick={() => previewRef.current?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="w-full font-bold md:hidden"
                size="lg"
            >
                <FileCheck className="mr-2 h-4 w-4" />
                Go to Preview
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {(isLoading || generatedTest) && (
        <div ref={previewRef} className="mt-8">
            <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline text-2xl">Generated Test Paper</CardTitle>
                    <CardDescription>Preview, print, or download your test paper.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handlePrint} disabled={!generatedTest}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                    </Button>
                    <Button onClick={handleDownload} disabled={!generatedTest}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex flex-col justify-center items-center p-10 min-h-[300px]">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground font-semibold">AI is generating your test...</p>
                        <p className="text-muted-foreground text-sm">This can take a minute or two.</p>
                    </div>
                )}
                {generatedTest && (
                    <ScrollArea className="h-[70vh] rounded-md border p-4" id="printable-area">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{generatedTest}</pre>
                    </ScrollArea>
                )}
            </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}

    