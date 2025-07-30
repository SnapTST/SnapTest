'use server';

/**
 * @fileOverview A worksheet generator AI agent.
 *
 * - generateWorksheet - A function that handles the worksheet generation process.
 * - GenerateWorksheetInput - The input type for the generateWorksheet function.
 * - GenerateWorksheetOutput - The return type for the generateWorksheet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorksheetInputSchema = z.object({
  topic: z.string().describe('The topic of the worksheet.'),
  gradeLevel: z.string().describe('The grade level of the worksheet.'),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateWorksheetInput = z.infer<typeof GenerateWorksheetInputSchema>;

const GenerateWorksheetOutputSchema = z.object({
  worksheetContent: z.string().describe('The content of the generated worksheet.'),
});
export type GenerateWorksheetOutput = z.infer<typeof GenerateWorksheetOutputSchema>;

export async function generateWorksheet(input: GenerateWorksheetInput): Promise<GenerateWorksheetOutput> {
  return generateWorksheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorksheetPrompt',
  input: {schema: GenerateWorksheetInputSchema},
  output: {schema: GenerateWorksheetOutputSchema},
  prompt: `You are an expert teacher specializing in creating worksheets.

You will use this information to generate a worksheet for the given topic and grade level.
The worksheet should include the specified number of questions and should be formatted for printing.

Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}
Number of Questions: {{{numberOfQuestions}}}

Worksheet Content:`,
});

const generateWorksheetFlow = ai.defineFlow(
  {
    name: 'generateWorksheetFlow',
    inputSchema: GenerateWorksheetInputSchema,
    outputSchema: GenerateWorksheetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
