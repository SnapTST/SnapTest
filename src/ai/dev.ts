import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-from-topic.ts';
import '@/ai/flows/generate-revision-notes.ts';
import '@/ai/flows/generate-test-from-book.ts';
import '@/ai/flows/generate-worksheet.ts';
import '@/ai/flows/solve-doubt.ts';
import '@/ai/flows/summarize-ncert-solution.ts';
import '@/ai/flows/answer-doubt.ts';
import '@/ai/flows/summarize-ncert-question.ts';