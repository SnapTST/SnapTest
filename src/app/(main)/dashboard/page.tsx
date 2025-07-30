"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user } = useAuth();
  const recentTests: any[] = [
    // { id: '1', name: 'Physics - Chapter 4 Test', date: '2023-10-26', score: '85%', subject: 'Physics' },
    // { id: '2', name: 'Algebra II Quiz', date: '2023-10-24', score: '92%', subject: 'Math' },
    // { id: '3', name: 'History of Modern India', date: '2023-10-22', score: '78%', subject: 'History' },
    // { id: '4', name: 'Biology: Cell Structure', date: '2023-10-21', score: 'In Progress', subject: 'Biology' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back{user ? `, ${user.name.split(' ')[0]}`: ''}! Here's your recent activity.</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
            <Link href="/question-bank"><PlusCircle className="mr-2 h-4 w-4" /> Create New Test</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
          <CardDescription>Your saved tests and quizzes will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
            {recentTests.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {recentTests.map((test) => (
                            <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.name}</TableCell>
                            <TableCell><Badge variant="outline">{test.subject}</Badge></TableCell>
                            <TableCell className="hidden md:table-cell">{test.date}</TableCell>
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
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                    <Info className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No Recent Tests</h3>
                    <p className="text-muted-foreground max-w-xs">You haven't created any tests yet. Get started by creating a new test.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
