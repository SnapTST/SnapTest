"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateWorksheet } from '@/ai/flows/generate-worksheet';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Wand2, Loader2, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  gradeLevel: z.string().min(1, { message: 'Please select a grade level.' }),
  numberOfQuestions: z.coerce.number().min(1, { message: 'Must be at least 1 question.' }).max(20, { message: "Cannot be more than 20 questions." }),
});

export default function WorksheetGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [worksheetContent, setWorksheetContent] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      gradeLevel: '',
      numberOfQuestions: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setWorksheetContent(null);
    try {
      const result = await generateWorksheet(values);
      setWorksheetContent(result.worksheetContent);
    } catch (error) {
      console.error("Failed to generate worksheet:", error);
      toast({
        title: "Error",
        description: "Failed to generate worksheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print Worksheet</title>');
      printWindow.document.write('<style>body { font-family: sans-serif; } pre { white-space: pre-wrap; word-wrap: break-word; font-family: sans-serif; }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h1>Worksheet</h1><hr>');
      printWindow.document.write(`<pre>${worksheetContent}</pre>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
          <FileText className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Worksheet Generator</h1>
            <p className="text-muted-foreground">Create printable worksheets for any topic and grade level.</p>
          </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create a Worksheet</CardTitle>
          <CardDescription>Fill in the details below to generate a new worksheet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'The Solar System'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="gradeLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Grade 1-3">Grade 1-3</SelectItem>
                                <SelectItem value="Grade 4-6">Grade 4-6</SelectItem>
                                <SelectItem value="Grade 7-9">Grade 7-9</SelectItem>
                                <SelectItem value="Grade 10-12">Grade 10-12</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="numberOfQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Questions</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4"/>}
                  Generate Worksheet
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {worksheetContent && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Worksheet</CardTitle>
              <CardDescription>Your printable worksheet is ready.</CardDescription>
            </div>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="mr-2 h-4 w-4"/> Print
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 bg-secondary/30 min-h-[300px]">
              <pre className="whitespace-pre-wrap font-sans text-sm">{worksheetContent}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
