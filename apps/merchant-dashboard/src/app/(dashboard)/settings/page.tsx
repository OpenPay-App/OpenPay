import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Manage your account and platform configuration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Business", description: "Company name, currency, timezone" },
          { title: "API Keys", description: "Manage your API credentials" },
          { title: "Webhooks", description: "Configure event endpoints" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl border border-border p-6 hover:border-secondary/30 transition-colors cursor-pointer"
          >
            <Settings className="w-8 h-8 text-secondary mb-3" />
            <h3 className="font-semibold text-text-primary">{item.title}</h3>
            <p className="text-sm text-text-secondary mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
