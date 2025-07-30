"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateTestFromBook, type GenerateTestFromBookOutput } from '@/ai/flows/generate-test-from-book';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Loader2, FileQuestion, Key } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from 'next/image';

const formSchema = z.object({
  bookName: z.string().min(1, { message: "Please select a book." }),
  chapterName: z.string().min(3, { message: "Chapter name must be at least 3 characters." }),
  numberOfQuestions: z.coerce.number().min(1, { message: "Must be at least 1 question." }).max(20, { message: "Cannot be more than 20 questions." }),
  difficultyLevel: z.enum(['easy', 'medium', 'hard'], { required_error: "Please select a difficulty." }),
});

export default function QuestionBankPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<GenerateTestFromBookOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookName: "NCERT",
      chapterName: '',
      numberOfQuestions: 10,
      difficultyLevel: 'medium',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedTest(null);
    try {
      const result = await generateTestFromBook(values);
      setGeneratedTest(result);
    } catch (error) {
      console.error("Failed to generate test:", error);
      toast({
        title: "Error",
        description: "Failed to generate test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const preMadePapers = [
    {
      title: "CBSE Class 10 Science - Sample Paper 2024",
      details: "Subject: Science | Grade: 10"
    },
    {
      title: "NCERT Class 12 Maths - Chapter 3 Matrices",
      details: "Subject: Mathematics | Grade: 12"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <BookOpen className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground">Generate tests from popular books or browse pre-made papers.</p>
        </div>
      </div>

       <div className="w-full flex justify-center">
          <Image src="https://placehold.co/728x90.png" width={728} height={90} alt="advertisement" data-ai-hint="advertisement banner" />
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate a New Test</CardTitle>
          <CardDescription>Select a book and chapter to create a custom test.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bookName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a book..." /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NCERT">NCERT</SelectItem>
                          <SelectItem value="CBSE">CBSE</SelectItem>
                          <SelectItem value="ICSE">ICSE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chapterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chapter</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Chapter 5: The Fundamental Unit of Life'" {...field} />
                      </FormControl>
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
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select difficulty..." /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Test
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="sr-only">Generating your test...</p>
        </div>
      )}

      {generatedTest && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Test</CardTitle>
            <CardDescription>Here is your custom-generated test. Review the questions and answers below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {generatedTest.testQuestions.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                  <AccordionTrigger className="p-4 border rounded-lg bg-secondary/30 hover:bg-secondary/50 hover:no-underline [&[data-state=open]]:bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <FileQuestion className="h-5 w-5 text-primary"/>
                      <span className="text-left font-semibold">Question {index + 1}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <div className="space-y-4 p-4 mt-2 rounded-md border bg-background">
                        <p className="font-medium">{item.question}</p>
                        <div className="flex items-start gap-3 text-sm text-green-700 dark:text-green-400">
                            <Key className="h-4 w-4 mt-1 flex-shrink-0" />
                            <p><strong>Answer:</strong> {item.answer}</p>
                        </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pre-made Question Papers</CardTitle>
          <CardDescription>Download ready-to-use question papers for various subjects.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {preMadePapers.map((paper) => (
              <li key={paper.title} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-4">
                <div className="flex-grow">
                  <h3 className="font-semibold">{paper.title}</h3>
                  <p className="text-sm text-muted-foreground">{paper.details}</p>
                </div>
                <Button variant="outline" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" /> Download Full PDF</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="w-full flex justify-center">
          <Image src="https://placehold.co/728x90.png" width={728} height={90} alt="advertisement" data-ai-hint="advertisement banner" />
      </div>
    </div>
  );
}
