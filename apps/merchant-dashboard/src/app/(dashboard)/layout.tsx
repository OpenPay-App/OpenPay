import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { SandboxModeProvider } from "@/lib/sandbox-mode";
import { BusinessProfileProvider } from "@/lib/business-profile-context";
import { ProfileErrorBanner } from "@/components/profile-error-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SandboxModeProvider>
      <BusinessProfileProvider>
        <div className="min-h-screen bg-bg-alt">
          <Sidebar />
          <div className="ml-64">
            <Topbar />
            <ProfileErrorBanner />
            <main className="p-8">{children}</main>
          </div>
        </div>
      </BusinessProfileProvider>
    </SandboxModeProvider>
  );
}
