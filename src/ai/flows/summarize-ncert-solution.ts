'use server';

/**
 * @fileOverview Summarizes an NCERT solution to provide a quick understanding of key concepts and answers.
 *
 * - summarizeNcertSolution - A function that summarizes the NCERT solution.
 * - SummarizeNcertSolutionInput - The input type for the summarizeNcertSolution function.
 * - SummarizeNcertSolutionOutput - The return type for the summarizeNcertSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNcertSolutionInputSchema = z.object({
  solutionText: z
    .string()
    .describe('The full text of the NCERT solution to be summarized.'),
});
export type SummarizeNcertSolutionInput = z.infer<typeof SummarizeNcertSolutionInputSchema>;

const SummarizeNcertSolutionOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the NCERT solution.'),
});
export type SummarizeNcertSolutionOutput = z.infer<typeof SummarizeNcertSolutionOutputSchema>;

export async function summarizeNcertSolution(
  input: SummarizeNcertSolutionInput
): Promise<SummarizeNcertSolutionOutput> {
  return summarizeNcertSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNcertSolutionPrompt',
  input: {schema: SummarizeNcertSolutionInputSchema},
  output: {schema: SummarizeNcertSolutionOutputSchema},
  prompt: `You are an expert educator specializing in simplifying complex solutions for students.

  Please provide a concise and easy-to-understand summary of the following NCERT solution:
  
  NCERT Solution Text: {{{solutionText}}}
  
  Focus on the key concepts, methods, and the final answer. Aim for a summary that allows a student to quickly grasp the essence of the solution.
  `,
});

const summarizeNcertSolutionFlow = ai.defineFlow(
  {
    name: 'summarizeNcertSolutionFlow',
    inputSchema: SummarizeNcertSolutionInputSchema,
    outputSchema: SummarizeNcertSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
