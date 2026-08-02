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
                ["EMAIL_ACTIVE_CLIENT", "No", "SMTP or SES (default: SMTP)"],
                ["EMAIL_SENDER_EMAIL", "No", "From: address for auth emails (must be on the verified domain)"],
                ["EMAIL_SMTP_HOST", "No", "Provider SMTP host (dev: mailhog / prod: smtp.resend.com, etc.)"],
                ["EMAIL_SMTP_PORT", "No", "SMTP port (1025 MailHog, 587 start_tls)"],
                ["EMAIL_SMTP_CONNECTION", "No", "plaintext (dev) or start_tls (prod)"],
                ["EMAIL_SMTP_TIMEOUT", "No", "Seconds before SMTP timeout (default 10)"],
                ["EMAIL_SMTP_USERNAME", "No", "Provider SMTP username/API key"],
                ["EMAIL_SMTP_PASSWORD", "No", "Provider SMTP password/API key"],
                ["HYPERSWITCH_DASHBOARD_URL", "No", "Public dashboard URL baked into email links"],
                ["HYPERSWITCH_PUBLIC_API_URL", "No", "Public router URL the Control Center calls"],
                ["HYPER_EMAIL_ENABLED", "No", "true = email-based team invites in Control Center"],
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

      {/* Monitoring */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Monitoring <code className="text-lg font-mono">.env</code>
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
                ["GRAFANA_ADMIN_USER", "No", "Grafana login (default: admin)"],
                ["GRAFANA_ADMIN_PASSWORD", "No", "Grafana password (default: admin — change for production)"],
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
        <p className="text-text-secondary mb-4">
          Phase 3: the dashboard is sandbox/production mode-aware. Credentials
          are resolved per mode from the <code className="font-mono text-xs">openpay_mode</code>{" "}
          cookie (see <code className="font-mono text-xs">src/lib/mode.ts</code>). Per-mode
          pairs win; the legacy single-mode vars remain as a fallback.
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
                ["KINDE_CLIENT_ID", "Yes", "Kinde application client ID"],
                ["KINDE_CLIENT_SECRET", "Yes", "Kinde application client secret"],
                ["KINDE_ISSUER_URL", "Yes", "Kinde domain URL (e.g., https://your.kinde.com)"],
                ["KINDE_POST_LOGIN_REDIRECT_URL", "Yes", "Redirect after login (default: http://localhost:3000/dashboard)"],
                ["KINDE_POST_LOGOUT_REDIRECT_URL", "Yes", "Redirect after logout (default: http://localhost:3000)"],
                ["HYPERSWITCH_URL_TEST", "Yes", "Sandbox router URL (default: http://localhost:8081)"],
                ["HYPERSWITCH_API_KEY_TEST", "Yes", "Sandbox secret API key (e.g. snd_<key_id>-<secret>)"],
                ["NEXT_PUBLIC_OPENPAY_PUBLISHABLE_KEY_TEST", "No", "Sandbox publishable key used by the checkout page"],
                ["HYPERSWITCH_URL_LIVE", "No", "Live router URL (required only for production mode)"],
                ["HYPERSWITCH_API_KEY_LIVE", "No", "Live secret API key (e.g. prd_<key_id>-<secret>)"],
                ["NEXT_PUBLIC_OPENPAY_PUBLISHABLE_KEY_LIVE", "No", "Live publishable key used by the checkout page"],
                ["HYPERSWITCH_MERCHANT_ID_TEST", "No", "Sandbox merchant account id (default: default)"],
                ["HYPERSWITCH_MERCHANT_ID_LIVE", "No", "Live merchant account id (default: default)"],
                ["HYPERSWITCH_ADMIN_API_KEY", "No", "Router admin key (used to issue/revoke merchant API keys)"],
                ["NEXT_PUBLIC_OPENPAY_MODE", "No", "Fallback mode when no cookie/query: sandbox or production"],
                ["HYPERSWITCH_URL", "No", "Legacy fallback router URL (single-mode installs)"],
                ["HYPERSWITCH_API_KEY", "No", "Legacy fallback secret API key"],
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
        <p className="text-text-secondary mt-4 text-sm">
          A production-mode request with no live credential configured fails
          fast (<code className="font-mono text-xs">HyperswitchError</code>, HTTP 503) rather
          than silently reusing the sandbox key. Deployed Vercel environments
          should map Production → <code className="font-mono text-xs">_LIVE</code> vars and
          Preview → <code className="font-mono text-xs">_TEST</code> vars.
        </p>
      </section>
    </div>
  );
}
