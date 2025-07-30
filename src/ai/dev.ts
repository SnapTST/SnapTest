import { config } from 'dotenv';
config();

import '@/ai/flows/ocr-image.ts';
import '@/ai/flows/generate-test-paper.ts';
import '@/ai/flows/generate-test-from-book';
import '@/ai/flows/summarize-ncert-solution';
import '@/ai/flows/answer-doubt';
import '@/ai/flows/generate-quiz-from-topic';
import '@/ai/flows/generate-worksheet';
import '@/ai/flows/generate-revision-notes';
