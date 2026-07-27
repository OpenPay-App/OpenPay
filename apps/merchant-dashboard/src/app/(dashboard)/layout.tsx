import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { SandboxModeProvider } from "@/lib/sandbox-mode";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SandboxModeProvider>
      <div className="min-h-screen bg-bg-alt">
        <Sidebar />
        <div className="ml-64">
          <Topbar />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </SandboxModeProvider>
  );
}
