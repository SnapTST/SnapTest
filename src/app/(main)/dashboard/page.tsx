import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  const recentTests = [
    { id: '1', name: 'Physics - Chapter 4 Test', date: '2023-10-26', score: '85%', subject: 'Physics' },
    { id: '2', name: 'Algebra II Quiz', date: '2023-10-24', score: '92%', subject: 'Math' },
    { id: '3', name: 'History of Modern India', date: '2023-10-22', score: '78%', subject: 'History' },
    { id: '4', name: 'Biology: Cell Structure', date: '2023-10-21', score: 'In Progress', subject: 'Biology' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your recent activity.</p>
        </div>
        <Button asChild>
            <Link href="/question-bank"><PlusCircle className="mr-2 h-4 w-4" /> Create New Test</Link>
        </Button>
      </div>

       <div className="w-full flex justify-center">
          <Image src="https://placehold.co/728x90.png" width={728} height={90} alt="advertisement" data-ai-hint="advertisement banner" />
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
          <CardDescription>Your saved tests and quizzes will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell><Badge variant="outline">{test.subject}</Badge></TableCell>
                  <TableCell>{test.date}</TableCell>
                  <TableCell>
                    <Badge variant={test.score === 'In Progress' ? 'secondary' : 'default'}>{test.score}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="w-full flex justify-center">
          <Image src="https://placehold.co/728x90.png" width={728} height={90} alt="advertisement" data-ai-hint="advertisement banner" />
        </div>
    </div>
  );
}
