// Summarizes an NCERT question to provide a quick understanding of key concepts and answers.

'use server';

/**
 * @fileOverview Summarizes an NCERT question to provide a quick understanding of key concepts and answers.
 *
 * - summarizeNcertQuestion - A function that summarizes the NCERT question.
 * - SummarizeNcertQuestionInput - The input type for the summarizeNcertQuestion function.
 * - SummarizeNcertQuestionOutput - The return type for the summarizeNcertQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNcertQuestionInputSchema = z.object({
  questionText: z
    .string()
    .describe('The full text of the NCERT question to be summarized.'),
  solutionText: z
    .string()
    .describe('The full text of the NCERT solution to be summarized.')
});
export type SummarizeNcertQuestionInput = z.infer<typeof SummarizeNcertQuestionInputSchema>;

const SummarizeNcertQuestionOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the NCERT question and its solution.'),
});
export type SummarizeNcertQuestionOutput = z.infer<typeof SummarizeNcertQuestionOutputSchema>;

export async function summarizeNcertQuestion(
  input: SummarizeNcertQuestionInput
): Promise<SummarizeNcertQuestionOutput> {
  return summarizeNcertQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNcertQuestionPrompt',
  input: {schema: SummarizeNcertQuestionInputSchema},
  output: {schema: SummarizeNcertQuestionOutputSchema},
  prompt: `You are an expert educator specializing in simplifying complex questions and solutions for students.

Please provide a concise and easy-to-understand summary of the following NCERT question and its solution:

NCERT Question Text: {{{questionText}}}
NCERT Solution Text: {{{solutionText}}}

Focus on the key concepts, methods, and the final answer. Aim for a summary that allows a student to quickly grasp the essence of the question and its solution.
  `,
});

const summarizeNcertQuestionFlow = ai.defineFlow(
  {
    name: 'summarizeNcertQuestionFlow',
    inputSchema: SummarizeNcertQuestionInputSchema,
    outputSchema: SummarizeNcertQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
