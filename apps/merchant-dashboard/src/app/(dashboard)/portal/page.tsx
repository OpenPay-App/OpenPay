"use client";

import { useState } from "react";
import {
  CreditCard,
  FileText,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function CustomerPortalPage() {
  const [activeTab, setActiveTab] = useState<"subscriptions" | "payment-methods" | "invoices">(
    "subscriptions"
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Customer Portal
          </h1>
          <p className="text-text-secondary mt-1">
            Self-serve portal for your customers to manage subscriptions,
            payment methods, and invoices. Embed this in your app via iframe.
          </p>
        </div>
        <a
          href="#"
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-secondary/30 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Preview Portal
        </a>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex gap-1 -mb-px">
          {[
            { key: "subscriptions" as const, label: "Subscriptions", icon: RefreshCw },
            { key: "payment-methods" as const, label: "Payment Methods", icon: CreditCard },
            { key: "invoices" as const, label: "Invoices", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-secondary text-secondary"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "subscriptions" && (
        <div className="text-center py-16 rounded-xl border border-border bg-white">
          <RefreshCw className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">
            Customer Subscriptions
          </p>
          <p className="text-sm text-text-muted mt-1 max-w-md mx-auto">
            When customers log into the portal, they&apos;ll see their active
            subscriptions with options to view billing history, update payment
            methods, or cancel. This requires the customer portal app to be
            deployed.
          </p>
        </div>
      )}

      {activeTab === "payment-methods" && (
        <div className="text-center py-16 rounded-xl border border-border bg-white">
          <CreditCard className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">
            Saved Payment Methods
          </p>
          <p className="text-sm text-text-muted mt-1 max-w-md mx-auto">
            Customers can view, add, or remove saved payment methods. Card
            details are tokenized by the payment processor and never stored
            in OpenPay.
          </p>
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="text-center py-16 rounded-xl border border-border bg-white">
          <FileText className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary font-medium">
            Invoice History
          </p>
          <p className="text-sm text-text-muted mt-1 max-w-md mx-auto">
            Customers can view and download all past invoices. Invoices are
            generated automatically from subscriptions and available as PDFs.
          </p>
        </div>
      )}

      {/* Integration Info */}
      <div className="mt-8 p-5 rounded-xl border border-border bg-bg-alt">
        <h3 className="font-semibold text-text-primary mb-2 text-sm">
          Integration
        </h3>
        <p className="text-sm text-text-secondary mb-3">
          Embed the customer portal in your app using an iframe:
        </p>
        <div className="rounded-lg bg-[#0d1117] p-4 font-mono text-sm text-white/80 overflow-x-auto">
          <pre>{`<iframe
  src="https://your-domain.com/portal?customer_id=cus_xxx"
  width="100%"
  height="600"
  frameBorder="0"
/>`}</pre>
        </div>
      </div>
    </div>
  );
}
