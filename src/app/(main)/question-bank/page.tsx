import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BookOpen } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function QuestionBankPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-4">
          <BookOpen className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
            <p className="text-muted-foreground">Generate tests from popular books or browse pre-made papers.</p>
          </div>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate a New Test</CardTitle>
          <CardDescription>Select a book and chapter to create a custom test.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="book">Book</Label>
                <Select>
                    <SelectTrigger id="book">
                        <SelectValue placeholder="Select a book..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ncert">NCERT</SelectItem>
                        <SelectItem value="cbse">CBSE</SelectItem>
                        <SelectItem value="icse">ICSE</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="chapter">Chapter</Label>
                <Input id="chapter" placeholder="e.g., 'Chapter 5: The Fundamental Unit of Life'" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="questions">Number of Questions</Label>
                <Input id="questions" type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select>
                    <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="md:col-span-2">
                <Button className="w-full md:w-auto">Generate Test</Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pre-made Question Papers</CardTitle>
          <CardDescription>Download ready-to-use question papers for various subjects.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">CBSE Class 10 Science - Sample Paper 2024</h3>
                <p className="text-sm text-muted-foreground">Subject: Science | Grade: 10</p>
              </div>
              <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            </li>
            <li className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">NCERT Class 12 Maths - Chapter 3 Matrices</h3>
                <p className="text-sm text-muted-foreground">Subject: Mathematics | Grade: 12</p>
              </div>
              <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
