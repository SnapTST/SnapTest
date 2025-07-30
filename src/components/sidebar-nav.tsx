"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, BrainCircuit, CheckSquare, FileText, LayoutDashboard, Pencil, Sparkles, HelpCircle, Crown, Layers } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { Separator } from "./ui/separator";

const mainNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/paper-generator", icon: Layers, label: "AI Paper Generator" },
    { href: "/question-bank", icon: Book, label: "Question Bank" },
    { href: "/ncert-solutions", icon: CheckSquare, label: "NCERT Solutions" },
    { href: "/ai-quiz", icon: BrainCircuit, label: "AI Quiz" },
    { href: "/worksheet-generator", icon: FileText, label: "Worksheet Generator" },
    { href: "/doubt-solver", icon: Sparkles, label: "Doubt Solver" },
    { href: "/notes", icon: Pencil, label: "Notes Generator" },
];

const secondaryNavItems = [
    { href: "/how-it-works", icon: HelpCircle, label: "How It Works" },
    { href: "/premium", icon: Crown, label: "Premium" },
]

export function SidebarNav() {
  const pathname = usePathname();

  return (
      <div className="flex h-full flex-col p-4">
        <div className="flex items-center gap-2 px-2 py-4">
            <Logo className="w-6 h-6"/>
            <span className="font-bold text-lg">SnapTest</span>
        </div>
        <div className="flex-1 overflow-y-auto">
            <SidebarMenu>
                {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                            <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>
        <Separator className="my-4"/>
        <SidebarMenu>
            {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </div>
  );
}
