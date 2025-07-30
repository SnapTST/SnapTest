import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WorksheetGeneratorPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
          <FileText className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Worksheet Generator</h1>
            <p className="text-muted-foreground">Create printable worksheets for any topic and grade level.</p>
          </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create a Worksheet</CardTitle>
          <CardDescription>Fill in the details below to generate a new worksheet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input id="topic" placeholder="e.g., 'The Solar System'" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="grade">Grade Level</Label>
                    <Select>
                        <SelectTrigger id="grade">
                            <SelectValue placeholder="Select grade..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Grade 1-3</SelectItem>
                            <SelectItem value="4">Grade 4-6</SelectItem>
                            <SelectItem value="7">Grade 7-9</SelectItem>
                            <SelectItem value="10">Grade 10-12</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="questions">Number of Questions</Label>
                    <Input id="questions" type="number" defaultValue="10" />
                </div>
            </div>
            <Button size="lg"><Wand2 className="mr-2 h-4 w-4"/> Generate Worksheet</Button>
            <p className="text-sm text-muted-foreground">Note: Generating a worksheet may require watching a short ad on the free plan.</p>
        </CardContent>
      </Card>
    </div>
  );
}
