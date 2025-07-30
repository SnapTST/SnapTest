import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/main-header";
import { SidebarNav } from "@/components/sidebar-nav";
import { AuthProvider } from "@/hooks/use-auth";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
