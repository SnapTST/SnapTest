"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateQuiz } from '@/ai/flows/generate-quiz-from-topic';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, BrainCircuit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  numberOfQuestions: z.coerce.number().min(1, { message: 'Must have at least 1 question.' }).max(10, { message: 'Cannot have more than 10 questions.' }),
});

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

type QuizData = {
  quiz: QuizQuestion[];
};

export default function AiQuizPage() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '', numberOfQuestions: 5 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(null);
    try {
      const result = await generateQuiz(values);
      const parsedQuiz: QuizData = JSON.parse(result.quiz);
      setQuiz(parsedQuiz);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
      if (currentQuestionIndex < (quiz?.quiz.length ?? 0) - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
          // Submit the quiz
          let correctAnswers = 0;
          quiz?.quiz.forEach((q, index) => {
              if (q.answer === userAnswers[index]) {
                  correctAnswers++;
              }
          });
          setScore((correctAnswers / (quiz?.quiz.length ?? 1)) * 100);
      }
  };

  const handleRestart = () => {
    setQuiz(null);
    setScore(null);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    form.reset();
  }

  const currentQuestion = quiz?.quiz[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.quiz.length) * 100 : 0;

  return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <BrainCircuit className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Quiz Generator</h1>
            <p className="text-muted-foreground">Test your knowledge on any topic.</p>
          </div>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
            {!quiz && score === null && (
            <>
                <CardHeader>
                <CardTitle>Create a New Quiz</CardTitle>
                <CardDescription>Enter a topic and the number of questions to start.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="topic" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl><Input placeholder="e.g., Photosynthesis, World War II" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="numberOfQuestions" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl><Input type="number" min="1" max="10" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Quiz
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </>
            )}

            {isLoading && <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}

            {currentQuestion && score === null && (
                <>
                    <CardHeader>
                        <Progress value={progress} className="mb-4" />
                        <CardTitle>Question {currentQuestionIndex + 1} of {quiz.quiz.length}</CardTitle>
                        <CardDescription className="text-lg pt-2">{currentQuestion.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup onValueChange={(value) => handleAnswerSelect(parseInt(value))} value={userAnswers[currentQuestionIndex]?.toString()}>
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-secondary">
                                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleNextQuestion} disabled={userAnswers[currentQuestionIndex] === undefined} className="w-full">
                            {currentQuestionIndex === quiz.quiz.length - 1 ? 'Submit Quiz' : 'Next Question'}
                        </Button>
                    </CardFooter>
                </>
            )}

            {score !== null && (
                <>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                        <CardDescription>You scored:</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-6xl font-bold text-primary">{Math.round(score)}%</p>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button onClick={handleRestart} className="w-full">Take Another Quiz</Button>
                    </CardFooter>
                </>
            )}
        </Card>
    </div>
  );
}
