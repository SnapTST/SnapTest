import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/landing-header";
import { ArrowRight, Book, BrainCircuit, CheckSquare, FileText, Sparkles, Pencil } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

const features = [
  {
    icon: <Book className="h-8 w-8 text-primary" />,
    title: "Question Bank",
    description: "Generate tests from popular books like CBSE, NCERT, and ICSE. Access pre-made papers instantly.",
    link: "/question-bank",
    dataAiHint: "books library"
  },
  {
    icon: <CheckSquare className="h-8 w-8 text-primary" />,
    title: "NCERT Solutions",
    description: "Get AI-powered summaries and detailed answers for all your NCERT questions.",
    link: "/ncert-solutions",
    dataAiHint: "notebook solution"
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI Quiz",
    description: "Challenge yourself with quizzes on any topic, track your scores, and climb the leaderboard.",
    link: "/ai-quiz",
    dataAiHint: "quiz brain"
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Worksheet Generator",
    description: "Teachers can create custom, printable worksheets for any subject and grade in seconds.",
    link: "/worksheet-generator",
    dataAiHint: "worksheet paper"
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Doubt Solver",
    description: "Stuck on a problem? Type your question or upload an image to get instant AI-powered explanations.",
    link: "/doubt-solver",
    dataAiHint: "question mark"
  },
  {
    icon: <Pencil className="h-8 w-8 text-primary" />,
    title: "Notes Generator",
    description: "Automatically create concise revision notes from your chapter uploads or text.",
    link: "/notes",
    dataAiHint: "notebook writing"
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />
      <main className="flex-grow">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Smarter Studying Starts Here
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              SnapTest Enhanced uses AI to create personalized quizzes, solve doubts, and generate notes, helping you ace your exams with confidence.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Get Started Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">All-in-One Learning Platform</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="outline" asChild>
                      <Link href={feature.link}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
             <div className="relative max-w-5xl mx-auto">
              <Image src="https://placehold.co/1200x600.png" alt="Dashboard preview" width={1200} height={600} className="rounded-lg shadow-2xl" data-ai-hint="dashboard screen" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mt-12 mb-4">Ready to Elevate Your Learning?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of students and educators using AI to study smarter, not harder.</p>
            <Button size="lg" asChild>
              <Link href="/premium">View Premium Plans</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SnapTest Enhanced. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
