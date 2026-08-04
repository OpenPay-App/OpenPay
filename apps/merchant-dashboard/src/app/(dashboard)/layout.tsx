import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Sidebar } from "@/components/sidebar";
import { SandboxModeProvider } from "@/lib/sandbox-mode";
import { BusinessProfileProvider } from "@/lib/business-profile-context";
import { ProfileErrorBanner } from "@/components/profile-error-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is enforced here in the Node runtime (not in Edge middleware) —
  // the Kinde SDK is a Node-runtime library and its middleware graph crashes
  // Vercel's Edge sandbox with MIDDLEWARE_INVOCATION_FAILED.
  const kindeConfigured =
    process.env.KINDE_CLIENT_ID && process.env.KINDE_ISSUER_URL;
  if (kindeConfigured) {
    const { isAuthenticated } = getKindeServerSession();
    if (!(await isAuthenticated())) {
      redirect("/api/auth/login?post_login_redirect_url=/dashboard");
    }
  }

  return (
    <SandboxModeProvider>
      <BusinessProfileProvider>
        <div className="min-h-screen bg-white flex">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <ProfileErrorBanner />
            <main className="p-8">{children}</main>
          </div>
        </div>
      </BusinessProfileProvider>
    </SandboxModeProvider>
  );
}
