"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { solveDoubt } from '@/ai/flows/solve-doubt';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Upload, FileQuestion } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  question: z.string().min(10, { message: 'Question must be at least 10 characters long.' }),
  photoDataUri: z.string().optional(),
});

export default function DoubtSolverPage() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: '' },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('photoDataUri', result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnswer(null);
    try {
      const result = await solveDoubt(values);
      setAnswer(result.answer);
    } catch (error) {
      console.error('Failed to solve doubt:', error);
       toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Sparkles className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Doubt Solver</h1>
          <p className="text-muted-foreground">Stuck? Get instant help by typing your question or uploading a photo.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="question" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your question here..." {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormItem>
                  <FormLabel>Upload an Image (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center justify-center w-full">
                       <Label htmlFor="picture" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted">
                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
                               <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                               <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                           </div>
                           <Input id="picture" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                       </Label>
                    </div>
                  </FormControl>
                </FormItem>
                
                {imagePreview && (
                    <div className="w-full">
                        <p className="text-sm font-medium mb-2">Image Preview:</p>
                        <Image src={imagePreview} alt="Image preview" width={200} height={200} className="rounded-md border object-contain" />
                    </div>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Answer
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="min-h-[300px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileQuestion/> AI Generated Answer</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="flex justify-center items-center h-48"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}
              {answer && <div className="prose prose-sm max-w-none dark:prose-invert">{answer}</div>}
              {!isLoading && !answer && <p className="text-muted-foreground">Your answer will appear here...</p>}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Login for History</CardTitle>
                <CardDescription>
                    <a href="#" className="underline">Log in</a> or <a href="#" className="underline">create an account</a> to save your questions and answers.
                </CardDescription>
            </CardHeader>
           </Card>
        </div>
      </div>
    </div>
  );
}
