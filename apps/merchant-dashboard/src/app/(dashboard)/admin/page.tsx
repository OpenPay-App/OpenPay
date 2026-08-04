"use client";

import Link from "next/link";
import {
  Shield,
  HeartPulse,
  FolderOpen,
  AlertTriangle,
  Activity,
  ChevronRight,
} from "lucide-react";

const adminSections = [
  {
    href: "/admin/health",
    title: "System Health",
    description: "Monitor all backend services and system status.",
    icon: HeartPulse,
    color: "text-emerald-400",
    bg: "bg-emerald-950",
  },
  {
    href: "/admin/rules",
    title: "Fraud Rule Studio",
    description: "Configure rules to detect and prevent fraudulent transactions.",
    icon: Shield,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    href: "/admin/cases",
    title: "Case Management",
    description: "Review and manage flagged transactions and suspicious activity.",
    icon: FolderOpen,
    color: "text-amber-400",
    bg: "bg-amber-950",
  },
];

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin</h1>
        <p className="text-gray-500 mt-1">
          Manage system health, fraud detection, and review flagged activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group p-6 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-[3px] ${section.bg} flex items-center justify-center`}
              >
                <section.icon className={`w-6 h-6 ${section.color}`} />
              </div>
              <ChevronRight className="w-5 h-5 text-[#AAADB0] group-hover:text-[#3898EC] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              {section.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Status */}
      <div className="rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-4 border-b border-[#e2e2e2]">
          <h2 className="font-semibold text-gray-900">Quick Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-[3px] bg-[#fafafa] border border-[#e2e2e2]">
              <Activity className="w-5 h-5 text-[#AAADB0]" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Services
                </p>
                <p className="text-xs text-[#AAADB0]">
                  Check system health for status
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-[3px] bg-[#fafafa] border border-[#e2e2e2]">
              <Shield className="w-5 h-5 text-[#AAADB0]" />
              <div>
                <p className="text-sm font-medium text-gray-900">Rules</p>
                <p className="text-xs text-[#AAADB0]">
                  Manage fraud detection rules
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-[3px] bg-[#fafafa] border border-[#e2e2e2]">
              <AlertTriangle className="w-5 h-5 text-[#AAADB0]" />
              <div>
                <p className="text-sm font-medium text-gray-900">Cases</p>
                <p className="text-xs text-[#AAADB0]">
                  Review flagged transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
