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
        <h1 className="text-2xl font-semibold text-text-primary">Admin</h1>
        <p className="text-text-secondary mt-1">
          Manage system health, fraud detection, and review flagged activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group p-6 rounded-xl border border-border bg-[#0a0a0a] hover:border-secondary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${section.bg} flex items-center justify-center`}
              >
                <section.icon className={`w-6 h-6 ${section.color}`} />
              </div>
              <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-white group-hover:text-secondary transition-colors">
              {section.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Status */}
      <div className="rounded-xl border border-border bg-[#0a0a0a]">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-white">Quick Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-alt">
              <Activity className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-sm font-medium text-white">
                  Services
                </p>
                <p className="text-xs text-text-muted">
                  Check system health for status
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-alt">
              <Shield className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-sm font-medium text-white">Rules</p>
                <p className="text-xs text-text-muted">
                  Manage fraud detection rules
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-bg-alt">
              <AlertTriangle className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-sm font-medium text-white">Cases</p>
                <p className="text-xs text-text-muted">
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
