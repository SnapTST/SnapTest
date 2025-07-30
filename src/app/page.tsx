import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/landing-header";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  "Generate Tests from Textbook Images",
  "AI-Powered Question Bank",
  "Instant Doubt Solver with Photo Upload",
  "Create Quizzes from any Topic",
  "NCERT Solution Summaries",
  "Printable Worksheet Generator",
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight">
            The Ultimate AI Learning Companion
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            From generating test papers by snapping a photo of your textbook to solving complex doubts, SnapTest Enhanced is your all-in-one tool for academic success.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">Get Started for Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground mt-2">All tools are powered by advanced AI to help you learn smarter, not harder.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{feature}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Snapshot */}
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-headline">Generate a Test in Seconds</h2>
                        <p className="mt-4 text-muted-foreground">
                            Simply upload an image of your textbook page, specify the marks, and let our AI generate a complete test paper for you. It's that easy.
                        </p>
                        <ul className="mt-6 space-y-4">
                            <li className="flex items-center gap-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-sm">1</span><span>Upload textbook page images.</span></li>
                            <li className="flex items-center gap-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-sm">2</span><span>Set total marks and customize.</span></li>
                            <li className="flex items-center gap-3"><span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-sm">3</span><span>Generate, preview, and print.</span></li>
                        </ul>
                        <Button asChild className="mt-8">
                            <Link href="/paper-generator">Try the Paper Generator</Link>
                        </Button>
                    </div>
                    <div>
                        <Card>
                          <CardContent className="p-4">
                            <Image
                                src="https://placehold.co/600x400.png"
                                alt="Screenshot of paper generator"
                                width={600}
                                height={400}
                                className="rounded-lg"
                                data-ai-hint="app screenshot"
                            />
                          </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <footer className="w-full border-t p-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Prashant Pandey. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
