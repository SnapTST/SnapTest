"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { summarizeNcertSolution, type SummarizeNcertSolutionOutput } from '@/ai/flows/summarize-ncert-solution';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Search, Loader2, Youtube } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  solutionText: z.string().min(50, { message: 'Solution text must be at least 50 characters long.' }),
});

export default function NcertSolutionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummarizeNcertSolutionOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      solutionText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await summarizeNcertSolution(values);
      setResult(response);
    } catch (error)
      {
      console.error("Failed to summarize solution:", error);
      toast({
        title: "Error",
        description: "Failed to summarize solution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
          <CheckSquare className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NCERT Solutions</h1>
            <p className="text-muted-foreground">Get AI-powered summaries and answers for NCERT questions.</p>
          </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Summarize a Solution</CardTitle>
          <CardDescription>Paste an NCERT solution below to get a quick summary and a relevant video explanation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="solutionText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Solution Text</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the full text of the NCERT solution here..." className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Summarize
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || result) && (
        <Card>
            <CardHeader>
                <CardTitle>AI Generated Summary</CardTitle>
                <CardDescription>Your summary and a helpful video will appear below.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert min-h-[150px]">
              {isLoading && (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {!isLoading && result && (
                <>
                  <p>{result.summary}</p>
                  {result.youtubeLink && (
                    <div className="mt-4">
                      <Button asChild>
                        <Link href={result.youtubeLink} target="_blank" rel="noopener noreferrer">
                          <Youtube className="mr-2 h-4 w-4" /> Watch on YouTube
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
