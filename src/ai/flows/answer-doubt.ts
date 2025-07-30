// Implements the Genkit flow for the answerDoubt story.
// Users can upload a picture or type a question and get an explanation from AI.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDoubtInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo related to the question, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AnswerDoubtInput = z.infer<typeof AnswerDoubtInputSchema>;

const AnswerDoubtOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});

export type AnswerDoubtOutput = z.infer<typeof AnswerDoubtOutputSchema>;

export async function answerDoubt(input: AnswerDoubtInput): Promise<AnswerDoubtOutput> {
  return answerDoubtFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerDoubtPrompt',
  input: {schema: AnswerDoubtInputSchema},
  output: {schema: AnswerDoubtOutputSchema},
  prompt: `You are an expert tutor specializing in providing clear and concise explanations to student questions.

  Answer the following question, providing detailed explanations and examples where necessary.

  Question: {{{question}}}
  {{#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}`,
});

const answerDoubtFlow = ai.defineFlow(
  {
    name: 'answerDoubtFlow',
    inputSchema: AnswerDoubtInputSchema,
    outputSchema: AnswerDoubtOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
