import { SidebarProvider, Sidebar, SidebarInset, SidebarContent } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/main-header";
import { SidebarNav } from "@/components/sidebar-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
