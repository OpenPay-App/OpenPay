"use client";

import { useState, useEffect } from "react";
import { Shield, Eye, ExternalLink } from "lucide-react";
import type { TeamMember } from "@/lib/types";

const mockMembers: TeamMember[] = [
  {
    member_id: "usr_1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    joined: "2026-01-15T00:00:00Z",
    last_active: "2026-07-26T10:00:00Z",
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Team is managed via Kinde — load from Kinde or use placeholder
    setTimeout(() => {
      setMembers(mockMembers);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-text-secondary">
          Team members and roles are managed through Kinde. Invite new members
          and change roles in the Kinde dashboard.
        </p>
        <a
          href="https://app.kinde.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-secondary/30 transition-colors"
        >
          Manage in Kinde
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Roles Legend */}
      <div className="mb-6 p-4 rounded-xl border border-border bg-[#0a0a0a]">
        <h3 className="text-sm font-medium text-text-primary mb-3">
          Role Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Admin</p>
              <p className="text-xs text-text-secondary">
                Full access to all settings, payments, customers, and admin
                pages. Can manage API keys and team members.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-bg-alt flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Viewer</p>
              <p className="text-xs text-text-secondary">
                Read-only access to payments, customers, and analytics. Cannot
                modify settings, create API keys, or manage webhooks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-[#0a0a0a] border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.member_id}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-[#0a0a0a]"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-sm">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-text-primary text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-text-muted">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                    member.role === "admin"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-bg-alt text-text-secondary"
                  }`}
                >
                  {member.role === "admin" ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  {member.role === "admin" ? "Admin" : "Viewer"}
                </span>
                {member.last_active && (
                  <span className="text-xs text-text-muted">
                    Active{" "}
                    {new Date(member.last_active).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
