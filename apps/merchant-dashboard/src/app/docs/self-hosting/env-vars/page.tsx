import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EnvVarsPage() {
  return (
    <div>
      <Link
        href="/docs/self-hosting"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Self-Hosting
      </Link>

      <h1 className="text-4xl font-bold text-text-primary mb-4">
        Environment Variables
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Complete reference for all environment variables across every service
        in the OpenPay stack.
      </p>

      {/* Root .env */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Root <code className="text-lg font-mono">.env</code>
        </h2>
        <p className="text-text-secondary mb-4">
          The main environment file at the project root. Shared across all
          Docker containers.
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Variable</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Required</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["POSTGRES_PASSWORD", "Yes", "Password for the PostgreSQL database"],
                ["REDIS_PASSWORD", "Yes", "Password for the Redis cache"],
                ["HYPERSWITCH_API_KEY", "Yes", "API key for Hyperswitch (generate once)"],
                ["PAYSTACK_SECRET_KEY", "Yes", "Paystack secret key from dashboard.paystack.co"],
                ["PAYSTACK_PUBLIC_KEY", "Yes", "Paystack public key from dashboard.paystack.co"],
                ["PAYSTACK_WEBHOOK_SECRET", "Yes", "Webhook signing secret from Paystack dashboard"],
                ["KILLBILL_API_KEY", "No", "API key for Kill Bill admin (auto-generated if empty)"],
                ["KILLBILL_API_SECRET", "No", "API secret for Kill Bill admin"],
              ].map(([variable, required, desc]) => (
                <tr key={variable} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">{variable}</code>
                  </td>
                  <td className="px-4 py-3">
                    {required === "Yes" ? (
                      <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-medium">Required</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-bg-alt text-text-muted text-xs">Optional</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Hyperswitch */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Hyperswitch <code className="text-lg font-mono">.env</code>
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Variable</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Required</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["DATABASE_HOST", "Yes", "PostgreSQL host (default: postgres)"],
                ["DATABASE_PORT", "Yes", "PostgreSQL port (default: 5432)"],
                ["DATABASE_NAME", "Yes", "Database name (default: hyperswitch)"],
                ["DATABASE_USERNAME", "Yes", "Database username"],
                ["DATABASE_PASSWORD", "Yes", "Database password (must match root .env)"],
                ["REDIS_HOST", "Yes", "Redis host (default: redis)"],
                ["REDIS_PORT", "Yes", "Redis port (default: 6379)"],
                ["REDIS_PASSWORD", "Yes", "Redis password"],
                ["NATS_URL", "Yes", "NATS connection URL (default: nats://nats:4222)"],
                ["PAYSTACK_SECRET_KEY", "Yes", "Paystack secret key"],
                ["API_KEY", "Yes", "Hyperswitch API key for client auth"],
              ].map(([variable, required, desc]) => (
                <tr key={variable} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">{variable}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-medium">Required</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Kill Bill */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Kill Bill <code className="text-lg font-mono">.env</code>
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Variable</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Required</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["DATABASE_HOST", "Yes", "PostgreSQL host"],
                ["DATABASE_NAME", "Yes", "Database name (default: killbill)"],
                ["DATABASE_USERNAME", "Yes", "Database username"],
                ["DATABASE_PASSWORD", "Yes", "Database password"],
                ["KILLBILL_API_KEY", "Yes", "Kill Bill API key"],
                ["KILLBILL_API_SECRET", "Yes", "Kill Bill API secret"],
                ["KILLBILL_DEFAULT_USERNAME", "Yes", "Default admin username (default: admin)"],
                ["KILLBILL_DEFAULT_PASSWORD", "Yes", "Default admin password"],
                ["NATS_URL", "Yes", "NATS connection URL"],
              ].map(([variable, required, desc]) => (
                <tr key={variable} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">{variable}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-medium">Required</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Merchant Dashboard */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Merchant Dashboard <code className="text-lg font-mono">.env.local</code>
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Variable</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Required</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["KINDE_CLIENT_ID", "Yes", "Kinde application client ID"],
                ["KINDE_CLIENT_SECRET", "Yes", "Kinde application client secret"],
                ["KINDE_ISSUER_URL", "Yes", "Kinde domain URL (e.g., https://your.kinde.com)"],
                ["KINDE_POST_LOGIN_REDIRECT_URL", "Yes", "Redirect after login (default: http://localhost:3000/dashboard)"],
                ["KINDE_POST_LOGOUT_REDIRECT_URL", "Yes", "Redirect after logout (default: http://localhost:3000)"],
                ["HYPERSWITCH_API_URL", "Yes", "Hyperswitch API URL (default: http://localhost:8081)"],
                ["HYPERSWITCH_API_KEY", "Yes", "Hyperswitch API key"],
              ].map(([variable, required, desc]) => (
                <tr key={variable} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">{variable}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs font-medium">Required</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
