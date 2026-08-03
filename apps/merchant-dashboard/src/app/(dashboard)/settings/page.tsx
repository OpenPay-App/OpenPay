"use client";

import { useState, useEffect, useMemo } from "react";
import { Save, CheckCircle, AlertTriangle, Search } from "lucide-react";
import { getBusinessProfile, updateBusinessProfile } from "@/lib/hyperswitch";
import { useBusinessProfile } from "@/lib/business-profile-context";
import type { BusinessProfile, Currency } from "@/lib/types";

const currencies: Currency[] = [
  "EUR", "USD", "GBP", "NGN", "GHS", "ZAR", "KES",
  "JPY", "CAD", "AUD", "INR", "BRL", "MXN",
];

const currencyLabels: Record<Currency, string> = {
  EUR: "€ EUR — Euro",
  USD: "$ USD — US Dollar",
  GBP: "£ GBP — British Pound",
  NGN: "₦ NGN — Nigerian Naira",
  GHS: "GH₵ GHS — Ghanaian Cedi",
  ZAR: "R ZAR — South African Rand",
  KES: "KSh KES — Kenyan Shilling",
  JPY: "¥ JPY — Japanese Yen",
  CAD: "C$ CAD — Canadian Dollar",
  AUD: "A$ AUD — Australian Dollar",
  INR: "₹ INR — Indian Rupee",
  BRL: "R$ BRL — Brazilian Real",
  MXN: "MX$ MXN — Mexican Peso",
};

const timezones = [
  "UTC",
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Sao_Paulo", "America/Mexico_City", "America/Toronto",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Madrid", "Europe/Rome",
  "Europe/Amsterdam", "Europe/Stockholm", "Europe/Zurich", "Europe/Moscow",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Singapore",
  "Asia/Kolkata", "Asia/Dubai", "Asia/Seoul", "Asia/Taipei",
  "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland",
  "Africa/Lagos", "Africa/Accra", "Africa/Nairobi", "Africa/Johannesburg", "Africa/Cairo",
];

export default function BusinessSettingsPage() {
  const { refresh } = useBusinessProfile();
  const [profile, setProfile] = useState<BusinessProfile>({
    business_name: "",
    default_currency: "EUR",
    timezone: "UTC",
    support_email: "",
    website: "",
  });
  const [tzSearch, setTzSearch] = useState("");
  const [showTzDropdown, setShowTzDropdown] = useState(false);

  const filteredTimezones = useMemo(() => {
    if (!tzSearch) return timezones;
    return timezones.filter((tz) =>
      tz.toLowerCase().includes(tzSearch.toLowerCase())
    );
  }, [tzSearch]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBusinessProfile()
      .then(setProfile)
      .catch((err) => setError((err as Error).message));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateBusinessProfile(profile);
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.includes("Cannot reach Hyperswitch")
            ? "Cannot connect to Hyperswitch. Make sure the backend is running."
            : err.message
          : "Failed to save settings"
      );
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
              update("default_currency", e.target.value as Currency)
            }
            className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {currencyLabels[c]}
              </option>
            ))}
          </select>
        </div>

        {/* Timezone */}
        <div className="relative">
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Timezone
          </label>

          {/* Currently selected timezone chip */}
          {profile.timezone && !tzSearch && (
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-light border border-secondary/20 text-xs font-medium text-secondary">
                {profile.timezone}
                <button
                  onClick={() => {
                    update("timezone", "");
                    setTzSearch("");
                  }}
                  className="ml-0.5 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              </span>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={tzSearch}
              onChange={(e) => {
                setTzSearch(e.target.value);
                setShowTzDropdown(true);
              }}
              onFocus={() => setShowTzDropdown(true)}
              onBlur={() => setTimeout(() => setShowTzDropdown(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tzSearch.trim()) {
                  e.preventDefault();
                  update("timezone", tzSearch.trim());
                  setTzSearch("");
                  setShowTzDropdown(false);
                }
              }}
              placeholder="Search or type a timezone (e.g. Europe/Paris)"
              className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
          {showTzDropdown && tzSearch && filteredTimezones.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-[#0a0a0a] border border-border rounded-lg shadow-lg">
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  update("timezone", tzSearch.trim());
                  setTzSearch("");
                  setShowTzDropdown(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-bg-alt transition-colors text-text-primary"
              >
                Use &quot;{tzSearch}&quot; as custom timezone
              </button>
            </div>
          )}
          {showTzDropdown && filteredTimezones.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredTimezones.map((tz) => (
                <button
                  key={tz}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    update("timezone", tz);
                    setTzSearch("");
                    setShowTzDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-bg-alt transition-colors ${
                    profile.timezone === tz ? "bg-secondary-light text-secondary font-medium" : "text-text-primary"
                  }`}
                >
                  {tz.replace("_", " ")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Save Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-950/50 border border-red-500/30">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="flex-1 text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}

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
