import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-alt">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
