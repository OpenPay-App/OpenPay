"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle } from "lucide-react";
import { getBusinessProfile, updateBusinessProfile } from "@/lib/hyperswitch";
import type { BusinessProfile } from "@/lib/types";

const timezones = [
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "UTC",
  "America/New_York",
  "Europe/London",
];

const currencies = ["NGN", "USD", "GHS", "ZAR", "KES"] as const;

export default function BusinessSettingsPage() {
  const [profile, setProfile] = useState<BusinessProfile>({
    business_name: "",
    default_currency: "NGN",
    timezone: "Africa/Lagos",
    support_email: "",
    website: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getBusinessProfile().then(setProfile);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBusinessProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // graceful — Hyperswitch may be down
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof BusinessProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl">
      <div className="space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Business Name
          </label>
          <input
            type="text"
            value={profile.business_name}
            onChange={(e) => update("business_name", e.target.value)}
            placeholder="Acme Corp"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>

        {/* Support Email */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Support Email
          </label>
          <input
            type="email"
            value={profile.support_email}
            onChange={(e) => update("support_email", e.target.value)}
            placeholder="support@example.com"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Website
          </label>
          <input
            type="url"
            value={profile.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Default Currency
          </label>
          <select
            value={profile.default_currency}
            onChange={(e) =>
              update("default_currency", e.target.value as BusinessProfile["default_currency"])
            }
            className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Timezone
          </label>
          <select
            value={profile.timezone}
            onChange={(e) => update("timezone", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Save */}
        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-secondary-hover transition-colors disabled:opacity-50"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
