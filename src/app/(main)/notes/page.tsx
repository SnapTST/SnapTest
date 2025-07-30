"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateRevisionNotes } from '@/ai/flows/generate-revision-notes';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Wand2, Upload, Loader2, Download } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const formSchema = z.object({
  content: z.string().min(100, { message: 'Content must be at least 100 characters long.' }),
});

export default function NotesGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          form.setValue('content', e.target?.result as string);
          toast({
            title: "File Content Loaded",
            description: "The text from your file has been loaded into the text area.",
          })
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Unsupported File Type",
          description: "Please upload a plain text file (.txt). PDF and DOCX are not yet supported.",
          variant: "destructive",
        })
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRevisionNotes(null);
    try {
      const result = await generateRevisionNotes({ content: values.content, sourceType: 'document' });
      setRevisionNotes(result.revisionNotes);
    } catch (error) {
      console.error("Failed to generate notes:", error);
      toast({
        title: "Error",
        description: "Failed to generate notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownload = () => {
    if (!revisionNotes) return;
    const blob = new Blob([revisionNotes], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'revision-notes.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
          <Pencil className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notes Generator</h1>
            <p className="text-muted-foreground">Generate revision notes from pasted text or a text file.</p>
          </div>
        </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Generate Notes</CardTitle>
                <CardDescription>Upload a document or paste text to generate notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('file-upload')?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Upload Chapter (.txt file)
                    </Button>
                    <input type="file" id="file-upload" className="hidden" accept=".txt" onChange={handleFileChange}/>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                            Or
                            </span>
                        </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Chapter Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Paste chapter content here..." className="min-h-[250px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      Generate Notes
                    </Button>
                </form>
              </Form>
            </CardContent>
        </Card>

        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Your Revision Notes</CardTitle>
                <CardDescription>The generated notes will appear below.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow min-h-[300px]">
                {isLoading && (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {!isLoading && revisionNotes && (
                   <div className="prose prose-sm max-w-none dark:prose-invert rounded-md border bg-secondary/50 p-4 h-full overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm bg-transparent border-0 p-0 m-0">{revisionNotes}</pre>
                   </div>
                )}
                {!isLoading && !revisionNotes && (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Your generated notes will be displayed here.</p>
                  </div>
                )}
            </CardContent>
            {revisionNotes && !isLoading && (
              <CardFooter>
                  <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" />Download .txt</Button>
              </CardFooter>
            )}
        </Card>
      </div>

    </div>
  );
}
