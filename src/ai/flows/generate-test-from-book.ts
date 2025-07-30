'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating practice tests from a given textbook chapter.
 *
 * It includes:
 * - generateTestFromBook: The main function to generate a test.
 * - GenerateTestFromBookInput: The input type for the function.
 * - GenerateTestFromBookOutput: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestFromBookInputSchema = z.object({
  bookName: z.string().describe('The name of the textbook (e.g., NCERT, CBSE).'),
  chapterName: z.string().describe('The specific chapter name from which to generate the test.'),
  numberOfQuestions: z
    .number()
    .min(1)
    .max(50)
    .default(10) // Set a default number of questions
    .describe('The desired number of questions in the test.'),
  difficultyLevel: z
    .enum(['easy', 'medium', 'hard'])
    .default('medium')
    .describe('The difficulty level of the test questions.'),
});
export type GenerateTestFromBookInput = z.infer<typeof GenerateTestFromBookInputSchema>;

const GenerateTestFromBookOutputSchema = z.object({
  testQuestions: z.array(
    z.object({
      question: z.string().describe('The text of the question.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('An array of test questions and their corresponding answers.'),
});
export type GenerateTestFromBookOutput = z.infer<typeof GenerateTestFromBookOutputSchema>;

export async function generateTestFromBook(input: GenerateTestFromBookInput): Promise<GenerateTestFromBookOutput> {
  return generateTestFromBookFlow(input);
}

const generateTestPrompt = ai.definePrompt({
  name: 'generateTestPrompt',
  input: {schema: GenerateTestFromBookInputSchema},
  output: {schema: GenerateTestFromBookOutputSchema},
  prompt: `You are a helpful assistant for students. Your task is to generate a practice test based on the provided textbook and chapter.

  Book Name: {{{bookName}}}
  Chapter Name: {{{chapterName}}}
  Number of Questions: {{{numberOfQuestions}}}
  Difficulty Level: {{{difficultyLevel}}}

  Generate a test with the specified number of questions, difficulty level, and include both the question and its corresponding answer. Ensure the questions are relevant to the chapter and suitable for exam preparation.
  Return the data in JSON format.
  `,
});

const generateTestFromBookFlow = ai.defineFlow(
  {
    name: 'generateTestFromBookFlow',
    inputSchema: GenerateTestFromBookInputSchema,
    outputSchema: GenerateTestFromBookOutputSchema,
  },
  async input => {
    const {output} = await generateTestPrompt(input);
    return output!;
  }
);
