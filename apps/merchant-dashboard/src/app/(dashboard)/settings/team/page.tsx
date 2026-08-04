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
    setTimeout(() => {
      setMembers(mockMembers);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          Team members and roles are managed through Kinde. Invite new members
          and change roles in the Kinde dashboard.
        </p>
        <a
          href="https://app.kinde.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-[3px] text-sm text-gray-600 hover:text-gray-900 hover:border-[#3898EC]/30 transition-colors"
        >
          Manage in Kinde
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Roles Legend */}
      <div className="mb-6 p-4 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Role Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[3px] bg-[#3898EC]/10 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-[#3898EC]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-600">
                Full access to all settings, payments, customers, and admin
                pages. Can manage API keys and team members.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[3px] bg-gray-100 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Viewer</p>
              <p className="text-xs text-gray-600">
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
            <div key={i} className="h-16 rounded-[8px] bg-gray-100 border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.member_id}
              className="flex items-center justify-between p-4 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3898EC]/10 flex items-center justify-center text-[#3898EC] font-semibold text-sm">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-medium ${
                    member.role === "admin"
                      ? "bg-[#3898EC]/10 text-[#3898EC]"
                      : "bg-gray-100 text-gray-600"
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
                  <span className="text-xs text-gray-500">
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
