// src/components/app-layout.tsx
"use client";

import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/main-header";
import { SidebarNav } from "@/components/sidebar-nav";
import { LandingHeader } from "@/components/landing-header";

const mainLayoutPaths = [
  '/dashboard',
  '/paper-generator',
  '/question-bank',
  '/ncert-solutions',
  '/ai-quiz',
  '/worksheet-generator',
  '/doubt-solver',
  '/notes',
  '/how-it-works',
  '/premium',
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMainLayout = mainLayoutPaths.some(p => pathname.startsWith(p));

  if (isMainLayout) {
    return (
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarNav />
        </Sidebar>
        <SidebarInset>
          <MainHeader />
          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // This handles the landing page
  return <>{children}</>;
}
