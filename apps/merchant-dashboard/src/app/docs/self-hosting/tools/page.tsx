import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const tools = [
  {
    name: "Grafana",
    url: "http://localhost:3000",
    purpose: "Metrics dashboards (Prometheus data + log explorer via Loki)",
    credentials: "admin / GRAFANA_ADMIN_PASSWORD (root .env, default: admin)",
    inApp: true,
    docs: "https://grafana.com/docs/",
    guide: "/docs/self-hosting/monitoring",
  },
  {
    name: "Prometheus",
    url: "http://localhost:9090",
    purpose: "Metrics scraper & time-series store (feeds Grafana)",
    credentials: "No login (browser UI)",
    inApp: true,
    docs: "https://prometheus.io/docs/introduction/overview/",
    guide: "/docs/self-hosting/monitoring",
  },
  {
    name: "Loki",
    url: "http://localhost:3100",
    purpose: "Log aggregation store (feeds Grafana log explorer)",
    credentials: "No login (API only)",
    inApp: true,
    docs: "https://grafana.com/docs/loki/latest/",
    guide: "/docs/self-hosting/monitoring",
  },
  {
    name: "Hyperswitch Control Center",
    url: "http://localhost:9000",
    purpose: "Payment orchestration dashboard (merchants, API keys, connectors)",
    credentials: "First user to sign up becomes the org admin. API key: HYPERSWITCH_ADMIN_API_KEY",
    inApp: true,
    docs: "https://docs.hyperswitch.io/",
    guide: "/docs/self-hosting/email-delivery",
  },
  {
    name: "Hyperswitch Router",
    url: "http://localhost:8081",
    purpose: "Payment processing API (backend of the dashboard)",
    credentials: "API key: HYPERSWITCH_ADMIN_API_KEY (header: api-key)",
    inApp: true,
    docs: "https://api-reference.hyperswitch.io/",
    guide: null,
  },
  {
    name: "Kill Bill",
    url: "http://localhost:8082",
    purpose: "Subscription billing & invoicing",
    credentials: "admin / password (change in Kill Bill .env)",
    inApp: true,
    docs: "https://docs.killbill.io/",
    guide: null,
  },
  {
    name: "Tazama Rule Studio",
    url: "http://localhost:3002",
    purpose: "Fraud detection rule editor (visual)",
    credentials: "Tazama Auth .env (default dev credentials)",
    inApp: true,
    docs: "https://github.com/tazama-lf/tazama",
    guide: null,
  },
  {
    name: "Case Management",
    url: "http://localhost:3001",
    purpose: "Fraud case review dashboard",
    credentials: "Tazama Auth .env (default dev credentials)",
    inApp: true,
    docs: "https://github.com/tazama-lf/case-management",
    guide: null,
  },
  {
    name: "NATS Monitoring",
    url: "http://localhost:8222",
    purpose: "JetStream event bus monitoring (subjects, streams, consumers)",
    credentials: "No login (browser UI)",
    inApp: true,
    docs: "https://docs.nats.io/",
    guide: null,
  },
  {
    name: "Traefik",
    url: "http://localhost:8080",
    purpose: "Reverse proxy & TLS (dashboard API when enabled)",
    credentials: "TRAEFIK_DASHBOARD=true (root .env)",
    inApp: true,
    docs: "https://doc.traefik.io/traefik/",
    guide: null,
  },
];

export default function ThirdPartyToolsPage() {
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
        Third-Party Tools
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Every external tool shipped with the OpenPay stack — how to access it,
        the credentials to use, and where the official docs live. Tools that
        involve the app itself link to an in-depth guide below.
      </p>

      {/* Tool matrix */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          The Tool Matrix
        </h2>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Tool</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Access</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Purpose</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Guide</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((t) => (
                <tr key={t.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-secondary hover:underline"
                    >
                      {t.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">{t.url}</code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{t.purpose}</td>
                  <td className="px-4 py-3">
                    {t.guide ? (
                      <Link
                        href={t.guide}
                        className="text-secondary hover:underline text-xs"
                      >
                        In-app guide →
                      </Link>
                    ) : (
                      <a
                        href={t.docs}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-muted hover:text-secondary text-xs"
                      >
                        Official docs ↗
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Credentials */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Credentials You Need to Edit
        </h2>
        <p className="text-text-secondary mb-4">
          Most tools ship with development defaults. Change these before
          exposing anything publicly:
        </p>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Tool</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Default credentials</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Where to change</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((t) => (
                <tr key={t.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{t.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{t.credentials}</td>
                  <td className="px-4 py-3 text-text-muted text-xs">Root <code className="font-mono">.env</code> / service <code className="font-mono">.env</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-text-muted mt-3">
          Hyperswitch Control Center has no preset password: the first person to
          sign up at{" "}
          <code className="font-mono text-xs">http://localhost:9000</code>{" "}
          becomes the organization admin. For team invites and email-based
          onboarding, see the{" "}
          <Link href="/docs/self-hosting/email-delivery" className="text-secondary hover:underline">
            Email Delivery &amp; Team Invites
          </Link>{" "}
          guide.
        </p>
      </section>

      {/* General rule */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          The General Rule
        </h2>
        <ul className="space-y-2 text-text-secondary list-disc pl-5">
          <li>
            If the tool <strong className="text-text-primary">involves this app</strong> (Grafana
            dashboards over our metrics, email delivery for Hyperswitch auth),
            we provide a step-by-step guide in the left sidebar.
          </li>
          <li>
            If it{" "}
            <strong className="text-text-primary">doesn&apos;t</strong> (generic features of
            Traefik, NATS internals, Kill Bill plugin development), use the
            official docs — each tool links them above.
          </li>
        </ul>
        <CodeBlock title="start the monitoring stack">{`# Grafana, Prometheus, Loki & Promtail
docker compose --profile monitoring up -d

# URLs after startup
# Grafana:     http://localhost:3000   (admin / admin, or GRAFANA_ADMIN_PASSWORD)
# Prometheus:  http://localhost:9090
# Loki API:    http://localhost:3100`}</CodeBlock>
      </section>
    </div>
  );
}
