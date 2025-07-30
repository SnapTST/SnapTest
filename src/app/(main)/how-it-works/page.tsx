import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BrainCircuit, CheckSquare, FileText, Sparkles, Pencil } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = [
  {
    icon: <Book className="h-8 w-8 text-primary" />,
    title: "Question Bank",
    content: "Navigate to the Question Bank, select your book (like NCERT or CBSE), choose a chapter, specify the number of questions, and set the difficulty. Our AI will instantly generate a tailored test for you. You can also browse our library of pre-made question papers."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Doubt Solver",
    content: "Go to the Doubt Solver. Type your academic question into the text box. If your question involves a diagram or specific text, you can upload an image. The AI will provide a step-by-step explanation to clear your confusion."
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI Quiz",
    content: "Visit the AI Quiz section. Enter any topic you want to study, from 'Cell Biology' to 'The Industrial Revolution'. Choose how many questions you want. The AI will create a multiple-choice quiz to test your knowledge. Your scores are tracked on the leaderboard!"
  },
  {
    icon: <Pencil className="h-8 w-8 text-primary" />,
    title: "Notes Generator",
    content: "In the Notes Generator, you can either upload a document of your chapter or paste the text directly. The AI will read the content and generate concise, easy-to-revise notes, highlighting key points and concepts."
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">How SnapTest Enhanced Works</h1>
        <p className="text-lg text-muted-foreground mt-4">A simple guide to using our powerful AI learning tools.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {steps.map((step, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-4">
                    {step.icon}
                    <span>Step {index + 1}: {step.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pl-12">
                  {step.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
