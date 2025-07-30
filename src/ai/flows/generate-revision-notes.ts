'use server';

/**
 * @fileOverview A revision notes generator AI agent.
 * 
 * - generateRevisionNotes - A function that handles the generation of revision notes.
 * - GenerateRevisionNotesInput - The input type for the generateRevisionNotes function.
 * - GenerateRevisionNotesOutput - The return type for the generateRevisionNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRevisionNotesInputSchema = z.object({
  sourceType: z.enum(['document', 'ocr']).describe('The source type of the chapter content.'),
  content: z.string().describe('The chapter content as text, either from a document or OCR.'),
});
export type GenerateRevisionNotesInput = z.infer<typeof GenerateRevisionNotesInputSchema>;

const GenerateRevisionNotesOutputSchema = z.object({
  revisionNotes: z.string().describe('The generated revision notes.'),
});
export type GenerateRevisionNotesOutput = z.infer<typeof GenerateRevisionNotesOutputSchema>;

export async function generateRevisionNotes(input: GenerateRevisionNotesInput): Promise<GenerateRevisionNotesOutput> {
  return generateRevisionNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRevisionNotesPrompt',
  input: {schema: GenerateRevisionNotesInputSchema},
  output: {schema: GenerateRevisionNotesOutputSchema},
  prompt: `You are an expert educator specializing in creating concise and effective revision notes.

  Please generate revision notes from the following chapter content.

  Chapter Content: {{{content}}}`,
});

const generateRevisionNotesFlow = ai.defineFlow(
  {
    name: 'generateRevisionNotesFlow',
    inputSchema: GenerateRevisionNotesInputSchema,
    outputSchema: GenerateRevisionNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
