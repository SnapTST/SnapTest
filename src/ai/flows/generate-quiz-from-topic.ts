// src/ai/flows/generate-quiz-from-topic.ts
'use server';
/**
 * @fileOverview Generates a quiz on a given topic.
 *
 * - generateQuiz - A function that generates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic to generate the quiz on.'),
  numberOfQuestions: z.number().describe('The number of questions in the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz in JSON format.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz on the following topic: {{{topic}}}. The quiz should have {{{numberOfQuestions}}} questions. Return the quiz in JSON format with the keys \"question\", \"options\", and \"answer\". The answer key must be an integer indicating the index of the correct answer in the options array.

Example:
{
  \"quiz\": [
    {
      \"question\": \"What is the capital of France?\",
      \"options\": [\"Berlin\", \"Paris\", \"Rome\", \"Madrid\"],
      \"answer\": 1
    },
    {
      \"question\": \"What is the highest mountain in the world?\",
      \"options\": [\"K2\", \"Kangchenjunga\", \"Makalu\", \"Mount Everest\"],
      \"answer\": 3
    }
  ]
}`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
