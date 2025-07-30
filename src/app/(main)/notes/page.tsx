import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Pencil, Wand2, Upload } from "lucide-react";

export default function NotesGeneratorPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
          <Pencil className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notes Generator</h1>
            <p className="text-muted-foreground">Generate revision notes from OCR or uploaded chapter.</p>
          </div>
        </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Generate Notes</CardTitle>
                <CardDescription>Upload a document or paste text to generate notes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Upload Chapter (PDF, DOCX)
                </Button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        Or
                        </span>
                    </div>
                </div>
                <Textarea placeholder="Paste chapter content here..." className="min-h-[250px]" />
                <Button><Wand2 className="mr-2 h-4 w-4" /> Generate Notes</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Your Revision Notes</CardTitle>
                <CardDescription>The generated notes will appear below.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <h4>Chapter: The Rise of Nationalism in Europe</h4>
                <ul>
                    <li><strong>French Revolution (1789):</strong> First clear expression of nationalism. Transferred sovereignty from monarchy to French citizens.</li>
                    <li><strong>Napoleonic Code (1804):</strong> Spread to regions under French control. Did away with privileges based on birth, established equality before law.</li>
                    <li><strong>Key Concepts:</strong> Nation-state, Liberal Nationalism (individual freedom, government by consent), Conservatism (monarchy, church).</li>
                    <li><strong>Unification of Germany (1866-1871):</strong> Led by Otto von Bismarck with the help of Prussian army and bureaucracy.</li>
                    <li><strong>Unification of Italy (1859-1870):</strong> Key figures: Giuseppe Mazzini, Count Cavour, Giuseppe Garibaldi.</li>
                </ul>
                <div className="mt-6 flex gap-2">
                  <Button><Download className="mr-2 h-4 w-4" />Download PDF</Button>
                  <Button variant="secondary">Unlock Summary (Watch Ad)</Button>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
