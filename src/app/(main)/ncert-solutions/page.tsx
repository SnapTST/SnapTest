import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Search } from "lucide-react";

export default function NcertSolutionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
          <CheckSquare className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NCERT Solutions</h1>
            <p className="text-muted-foreground">Get AI-powered summaries and answers for NCERT questions.</p>
          </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Summarize a Solution</CardTitle>
          <CardDescription>Paste an NCERT solution below to get a quick summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea placeholder="Paste the full text of the NCERT solution here..." className="min-h-[200px]" />
          <Button><Search className="mr-2 h-4 w-4"/>Summarize</Button>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>Example Summary</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <h4>Original Question:</h4>
            <p>Why is diffusion insufficient to meet the oxygen requirements of multi-cellular organisms like humans?</p>
            <h4>AI Generated Summary:</h4>
            <p>In single-celled organisms, the entire surface is in contact with the environment, making diffusion a quick way to get oxygen. However, in complex multi-cellular organisms like humans, most cells are not in direct contact with the air. Because of this, diffusion is too slow to deliver oxygen to all the cells deep inside the body. That's why humans have a specialized respiratory system with lungs and a circulatory system with blood and hemoglobin to efficiently transport oxygen to every cell.</p>
          </CardContent>
      </Card>
    </div>
  );
}
