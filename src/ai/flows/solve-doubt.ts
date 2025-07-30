// Implements the Genkit flow for the solveDoubt story.
// Users can upload a picture or type a question and get an explanation from AI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveDoubtInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo related to the question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type SolveDoubtInput = z.infer<typeof SolveDoubtInputSchema>;

const SolveDoubtOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});

export type SolveDoubtOutput = z.infer<typeof SolveDoubtOutputSchema>;

export async function solveDoubt(input: SolveDoubtInput): Promise<SolveDoubtOutput> {
  return solveDoubtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveDoubtPrompt',
  input: {schema: SolveDoubtInputSchema},
  output: {schema: SolveDoubtOutputSchema},
  prompt: `You are an expert tutor specializing in providing clear and concise explanations to student questions.

  Answer the following question, providing detailed explanations and examples where necessary.

  Question: {{{question}}}
  {{#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}`,
});

const solveDoubtFlow = ai.defineFlow(
  {
    name: 'solveDoubtFlow',
    inputSchema: SolveDoubtInputSchema,
    outputSchema: SolveDoubtOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
