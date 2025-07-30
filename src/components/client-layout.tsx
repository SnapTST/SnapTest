// src/components/client-layout.tsx
"use client";

import { AuthProvider } from "@/hooks/use-auth";
import dynamic from 'next/dynamic';

// Dynamically import AppLayout and disable SSR, as it relies on client-side hooks.
const AppLayout = dynamic(() => import('@/components/app-layout').then(mod => mod.AppLayout), { ssr: false });

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </AuthProvider>
  );
}
