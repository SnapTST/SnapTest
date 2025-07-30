"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/icons";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="font-bold text-lg">SnapTest Enhanced</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/premium" className="text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
