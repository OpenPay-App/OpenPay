import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function MonitoringPage() {
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
        Monitoring &amp; Grafana Dashboards
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        How to start the monitoring stack, what dashboards ship with the app,
        the file formats involved, and how to create or import your own.
      </p>

      {/* Status Page */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Status Page
        </h2>
        <p className="text-text-secondary mb-4">
          OpenPay includes a built-in status page at <code className="font-mono text-xs">/status</code> that provides real-time health monitoring of all core services. The page auto-refreshes every 30 seconds.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mb-3">How It Works</h3>
        <p className="text-text-secondary mb-4">
          The status page uses a server-side API route (<code className="font-mono text-xs">/api/health</code>) to check each service. This avoids CORS issues that would occur with direct browser-to-service requests.
        </p>
        <CodeBlock title="Health check flow">{`Browser → /api/health → Server → Service endpoints
                          ↓
                   Returns JSON with status + latency
                          ↓
                   Browser displays Operational/Down`}</CodeBlock>

        <h3 className="text-lg font-semibold text-text-primary mb-3">Monitored Services</h3>
        <div className="rounded-xl border border-border overflow-x-auto mb-6">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Health Endpoint</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Default Port</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Hyperswitch (Payments API)", "/health", "8081"],
                ["Kill Bill (Subscriptions)", "/1.0/healthcheck", "8082"],
                ["NATS JetStream", "/healthz", "8222"],
                ["Tazama (Fraud Detection)", "/health", "8084"],
              ].map(([name, endpoint, port]) => (
                <tr key={name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{name}</td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{endpoint}</code></td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{port}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">Accessing the Status Page</h3>
        <CodeBlock title="terminal">{`# Local development
open http://localhost:3000/status

# Production (via Docker)
open http://your-domain.com/status`}</CodeBlock>

        <h3 className="text-lg font-semibold text-text-primary mb-3">Customizing Health Check URLs</h3>
        <p className="text-text-secondary mb-4">
          Health check URLs are configurable via environment variables. Set these in your <code className="font-mono text-xs">.env</code> file to point to your actual service addresses:
        </p>
        <CodeBlock title=".env (health check configuration)">{`# Status Page Health Check URLs
# Defaults work for local Docker development
HEALTH_CHECK_HYPERSWITCH_URL=http://localhost:8081/health
HEALTH_CHECK_KILLBILL_URL=http://localhost:8082/1.0/healthcheck
HEALTH_CHECK_NATS_URL=http://localhost:8222/healthz
HEALTH_CHECK_TAZAMA_URL=http://localhost:8084/health

# Production example (Docker internal network):
HEALTH_CHECK_HYPERSWITCH_URL=http://hyperswitch:8080/health
HEALTH_CHECK_KILLBILL_URL=http://killbill:8080/1.0/healthcheck
HEALTH_CHECK_NATS_URL=http://nats:8222/healthz
HEALTH_CHECK_TAZAMA_URL=http://tazama-rule-exec:8080/health`}</CodeBlock>
      </section>

      {/* Stack overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          What&apos;s In the Stack
        </h2>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Service</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Port</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Job</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Prometheus", "9090", "Scrapes metrics from services (hyperswitch, killbill, itself)"],
                ["Grafana", "3000", "Dashboards + alerts, reads from Prometheus & Loki"],
                ["Loki", "3100", "Stores aggregated logs"],
                ["Promtail", "9080", "Ships Docker container logs to Loki via the Docker socket"],
              ].map(([name, port, job]) => (
                <tr key={name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{name}</td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{port}</code></td>
                  <td className="px-4 py-3 text-text-secondary">{job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 1 — Start the Monitoring Stack
        </h2>
        <CodeBlock title="terminal">{`docker compose --profile monitoring up -d

# Verify all four are healthy
docker compose ps prometheus grafana loki promtail`}</CodeBlock>
        <p className="text-text-secondary mt-4">
          Log in to Grafana at{" "}
          <a href="http://localhost:3000" className="text-secondary hover:underline">http://localhost:3000</a>{" "}
          with <code className="font-mono text-xs">admin</code> /{" "}
          <code className="font-mono text-xs">admin</code> (or the{" "}
          <code className="font-mono text-xs">GRAFANA_ADMIN_PASSWORD</code> from your root{" "}
          <code className="font-mono text-xs">.env</code>). You&apos;ll be asked to set a new
          password on first login.
        </p>
      </section>

      {/* Bundled dashboards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 2 — Dashboards That Ship With the App
        </h2>
        <p className="text-text-secondary mb-4">
          The repo provisions dashboards automatically from{" "}
          <code className="font-mono text-xs">monitoring/grafana/dashboards/dashboards/</code>.
          The Prometheus data source and the{" "}
          <code className="font-mono text-xs">OpenPay Overview</code> dashboard are loaded at
          container start (no manual import needed):
        </p>
        <ul className="space-y-2 text-text-secondary list-disc pl-5 mb-6">
          <li><strong className="text-text-primary">OpenPay Overview</strong> — service up/down status for Hyperswitch, Kill Bill, and the total up count.</li>
        </ul>
        <div className="rounded-xl border border-border overflow-x-auto mb-6">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Config file</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["monitoring/prometheus/prometheus.yml", "What Prometheus scrapes and how often (15s)"],
                ["monitoring/grafana/datasources/prometheus.yml", "Registers Prometheus as Grafana's data source"],
                ["monitoring/grafana/dashboards/dashboards.yml", "Tells Grafana to auto-load dashboards from a folder"],
                ["monitoring/grafana/dashboards/dashboards/*.json", "The actual dashboards (one JSON file per dashboard)"],
                ["monitoring/loki/loki.yml", "Loki storage/retention config"],
                ["monitoring/promtail/config.yml", "Log shipper config (Docker socket → Loki)"],
              ].map(([file, purpose]) => (
                <tr key={file} className="border-b border-border last:border-0">
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{file}</code></td>
                  <td className="px-4 py-3 text-text-secondary">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Dashboard file format */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 3 — The File Format (What a Dashboard Actually Is)
        </h2>
        <p className="text-text-secondary mb-4">
          A Grafana dashboard is a single <strong className="text-text-primary">JSON file</strong> —
          nothing more. The main blocks are:
        </p>
        <ul className="space-y-2 text-text-secondary list-disc pl-5 mb-4">
          <li><code className="font-mono text-xs">title</code> &amp; <code className="font-mono text-xs">uid</code> — dashboard name and unique ID</li>
          <li><code className="font-mono text-xs">panels[]</code> — each panel is one visualization (stat, time series, bar gauge…)</li>
          <li><code className="font-mono text-xs">panels[].targets[]</code> — the PromQL queries powering each panel</li>
          <li><code className="font-mono text-xs">templating</code> — optional dropdown variables (e.g. pick a service)</li>
          <li><code className="font-mono text-xs">time</code> — the default time range</li>
        </ul>
        <CodeBlock title="minimal dashboard JSON (shape)">{`{
  "title": "My Dashboard",
  "uid": "my-dashboard",
  "panels": [
    {
      "type": "stat",
      "title": "Hyperswitch Up?",
      "targets": [
        { "expr": "up{job=\"hyperswitch\"}", "legendFormat": "Hyperswitch" }
      ]
    }
  ],
  "time": { "from": "now-6h", "to": "now" }
}`}</CodeBlock>
      </section>

      {/* Create dashboard */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 4 — Create a Dashboard (Three Ways)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">A. In the UI (easiest)</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              In Grafana: <strong>Dashboards → New → New dashboard → Add visualization</strong>.
              Pick the Prometheus data source, write a PromQL query, save. Then export via
              <strong> Share → Export → Save JSON to file</strong> if you want it in the repo.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">B. Import a template</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Grafana hosts community templates at{" "}
              <a href="https://grafana.com/grafana/dashboards" className="text-secondary hover:underline">
                grafana.com/grafana/dashboards
              </a>{" "}
              (filter by data source = Prometheus). Copy the ID, then in Grafana:
              <strong> Dashboards → New → Import → paste ID → Load</strong>. This is the
              fastest way to get battle-tested dashboards.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">C. Add to the repo</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Drop the JSON into{" "}
              <code className="font-mono text-xs">monitoring/grafana/dashboards/dashboards/</code>{" "}
              and restart Grafana — the provider auto-loads it. This is how the bundled{" "}
              <em>OpenPay Overview</em> dashboard is shipped.
            </p>
          </div>
        </div>
        <CodeBlock title="add a dashboard to the repo">{`# 1. Place your exported JSON here:
#    monitoring/grafana/dashboards/dashboards/my-dashboard.json

# 2. Reload (picks up within 30s, or force it):
docker compose restart grafana`}</CodeBlock>
      </section>

      {/* Logs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 5 — Explore Logs
        </h2>
        <p className="text-text-secondary mb-4">
          Promtail ships every Docker container&apos;s logs to Loki. In Grafana open{" "}
          <strong>Explore</strong>, switch the data source to{" "}
          <strong>Loki</strong>, and query e.g.{" "}
          <code className="font-mono text-xs">{`{service="hyperswitch"}`}</code>{" "}
          or use the <strong>Log labels</strong> dropdown to pick a container.
        </p>
        <CodeBlock title="example Loki queries">{`{service="hyperswitch"}          # all Hyperswitch logs
{service="killbill"} |~ "error"  # Kill Bill errors only
{container="core-hyperswitch"}`}</CodeBlock>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Troubleshooting
        </h2>
        <ul className="space-y-3 text-text-secondary list-disc pl-5">
          <li>
            <strong className="text-text-primary">Dashboards don&apos;t appear:</strong> ensure the
            four monitoring containers are healthy (<code className="font-mono text-xs">docker compose ps</code>),
            then restart Grafana.
          </li>
          <li>
            <strong className="text-text-primary">Panels show &ldquo;No data&rdquo;:</strong> the target
            service may not expose Prometheus metrics, or the scrape target is unreachable. Check{" "}
            <code className="font-mono text-xs">http://localhost:9090/targets</code> for scrape errors.
          </li>
          <li>
            <strong className="text-text-primary">No logs in Loki:</strong> confirm the Docker socket is
            mounted to promtail (already in docker-compose.yml) and check{" "}
            <code className="font-mono text-xs">docker compose logs promtail</code>.
          </li>
        </ul>
      </section>
    </div>
  );
}
