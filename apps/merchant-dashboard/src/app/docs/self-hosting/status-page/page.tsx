import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function StatusPageDocsPage() {
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
        Status Page
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Real-time health monitoring of all OpenPay services with automatic
        updates every 30 seconds.
      </p>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Overview
        </h2>
        <p className="text-text-secondary mb-4">
          The status page provides a public-facing view of your OpenPay
          deployment&apos;s health. It monitors all core services and displays
          their current status, response latency, and last check time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Real-Time Monitoring
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Automatically checks all services every 30 seconds. No manual
              refresh needed.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Server-Side Checks
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Health checks run server-side to avoid CORS issues. Works
              reliably in all browsers.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Configurable URLs
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Service URLs are configurable via environment variables for
              different deployment environments.
            </p>
          </div>
        </div>
      </section>

      {/* Accessing the Status Page */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Accessing the Status Page
        </h2>
        <CodeBlock title="terminal">{`# Local development
open http://localhost:3000/status

# Production (via Docker)
open http://your-domain.com/status

# Via API (JSON response)
curl http://localhost:3000/api/health`}</CodeBlock>
      </section>

      {/* Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          How It Works
        </h2>
        <p className="text-text-secondary mb-4">
          The status page uses a server-side API route to check each service.
          This architecture avoids CORS issues that would occur with direct
          browser-to-service requests.
        </p>
        <CodeBlock title="Architecture diagram">{`Browser (localhost:3000)
    ↓ fetch /api/health
Next.js Server (no CORS restrictions)
    ↓ fetch http://localhost:8081/health
    ↓ fetch http://localhost:8082/1.0/healthcheck
    ↓ fetch http://localhost:8222/healthz
    ↓ fetch http://localhost:8084/health
JSON Response → Browser
    ↓
Display status + latency for each service`}</CodeBlock>

        <h3 className="text-lg font-semibold text-text-primary mb-3 mt-6">
          Request Flow
        </h3>
        <ol className="space-y-2 text-text-secondary list-decimal pl-5 mb-4">
          <li>
            Browser loads <code className="font-mono text-xs">/status</code> page
          </li>
          <li>
            Page calls <code className="font-mono text-xs">/api/health</code>{" "}
            endpoint
          </li>
          <li>Server-side route fetches each service&apos;s health endpoint</li>
          <li>
            Server returns JSON with status (
            <code className="font-mono text-xs">up</code>/
            <code className="font-mono text-xs">down</code>) and latency for each
            service
          </li>
          <li>Browser displays the results with color-coded indicators</li>
          <li>Process repeats every 30 seconds via polling</li>
        </ol>
      </section>

      {/* Monitored Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Monitored Services
        </h2>
        <p className="text-text-secondary mb-4">
          The status page monitors the following core services:
        </p>
        <div className="rounded-xl border border-border overflow-x-auto mb-6">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Service
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Health Endpoint
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Default Port
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Hyperswitch",
                  "/health",
                  "8081",
                  "Payment orchestration engine",
                ],
                [
                  "Kill Bill",
                  "/1.0/healthcheck",
                  "8082",
                  "Subscription billing management",
                ],
                ["NATS JetStream", "/healthz", "8222", "Message queue and streaming"],
                [
                  "Tazama",
                  "/health",
                  "8084",
                  "Fraud detection and prevention",
                ],
              ].map(([name, endpoint, port, description]) => (
                <tr
                  key={name}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {name}
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">
                      {endpoint}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">
                      {port}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Status Indicators
        </h3>
        <div className="space-y-2 text-text-secondary">
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-[#40d63b]" />
            <span>
              <strong className="text-text-primary">Operational</strong> — Service
              is responding normally
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-[#ea384c]" />
            <span>
              <strong className="text-text-primary">Down</strong> — Service is
              unreachable or returning errors
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-300" />
            <span>
              <strong className="text-text-primary">Checking...</strong> — Health
              check is in progress
            </span>
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Configuration
        </h2>
        <p className="text-text-secondary mb-4">
          Health check URLs are configurable via environment variables. This
          allows you to point the status page to services running in different
          locations.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Environment Variables
        </h3>
        <div className="rounded-xl border border-border overflow-x-auto mb-6">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Variable
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Default
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "HEALTH_CHECK_HYPERSWITCH_URL",
                  "http://localhost:8081/health",
                  "Hyperswitch health endpoint",
                ],
                [
                  "HEALTH_CHECK_KILLBILL_URL",
                  "http://localhost:8082/1.0/healthcheck",
                  "Kill Bill health endpoint",
                ],
                [
                  "HEALTH_CHECK_NATS_URL",
                  "http://localhost:8222/healthz",
                  "NATS health endpoint",
                ],
                [
                  "HEALTH_CHECK_TAZAMA_URL",
                  "http://localhost:8084/health",
                  "Tazama health endpoint",
                ],
              ].map(([variable, defaultValue, description]) => (
                <tr
                  key={variable}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">
                      {variable}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">
                      {defaultValue}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Local Development
        </h3>
        <p className="text-text-secondary mb-4">
          The default values work for local Docker development. No changes
          needed.
        </p>
        <CodeBlock title=".env">{`# No changes needed for local development
# Defaults are set in the API route`}</CodeBlock>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Production (Docker)
        </h3>
        <p className="text-text-secondary mb-4">
          For production deployments, update the URLs to use Docker service
          names or external addresses:
        </p>
        <CodeBlock title=".env">{`# Production configuration
HEALTH_CHECK_HYPERSWITCH_URL=http://hyperswitch:8080/health
HEALTH_CHECK_KILLBILL_URL=http://killbill:8080/1.0/healthcheck
HEALTH_CHECK_NATS_URL=http://nats:8222/healthz
HEALTH_CHECK_TAZAMA_URL=http://tazama-rule-exec:8080/health`}</CodeBlock>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Production (External Services)
        </h3>
        <p className="text-text-secondary mb-4">
          If services run on separate servers, use their external addresses:
        </p>
        <CodeBlock title=".env">{`# External services configuration
HEALTH_CHECK_HYPERSWITCH_URL=https://payments.yourdomain.com/health
HEALTH_CHECK_KILLBILL_URL=https://billing.yourdomain.com/1.0/healthcheck
HEALTH_CHECK_NATS_URL=https://messaging.yourdomain.com/healthz
HEALTH_CHECK_TAZAMA_URL=https://fraud.yourdomain.com/health`}</CodeBlock>
      </section>

      {/* API Response */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          API Response Format
        </h2>
        <p className="text-text-secondary mb-4">
          The <code className="font-mono text-xs">/api/health</code> endpoint
          returns a JSON response with the status of all services:
        </p>
        <CodeBlock title="GET /api/health">{`{
  "services": [
    {
      "name": "Hyperswitch (Payments API)",
      "status": "up",
      "latency": 286
    },
    {
      "name": "Kill Bill (Subscriptions)",
      "status": "up",
      "latency": 330
    },
    {
      "name": "NATS JetStream",
      "status": "up",
      "latency": 272
    },
    {
      "name": "Tazama (Fraud Detection)",
      "status": "up",
      "latency": 272
    }
  ],
  "lastChecked": "2026-08-05T21:07:21.904Z"
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Response Fields
        </h3>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Field
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["services", "Array", "List of service health checks"],
                ["services[].name", "String", "Service display name"],
                [
                  "services[].status",
                  "String",
                  'Service status ("up" or "down")',
                ],
                [
                  "services[].latency",
                  "Number",
                  "Response time in milliseconds",
                ],
                ["lastChecked", "String", "ISO 8601 timestamp of last check"],
              ].map(([field, type, description]) => (
                <tr key={field} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">
                      {field}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{type}</td>
                  <td className="px-4 py-3 text-text-secondary">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Source Code */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Source Code
        </h2>
        <p className="text-text-secondary mb-4">
          The status page implementation consists of two main files:
        </p>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  File
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "app/status/page.tsx",
                  "Frontend UI component that displays service status",
                ],
                [
                  "app/api/health/route.ts",
                  "Server-side API that checks all service health endpoints",
                ],
              ].map(([file, purpose]) => (
                <tr key={file} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">
                      {file}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Troubleshooting
        </h2>
        <ul className="space-y-4 text-text-secondary">
          <li>
            <strong className="text-text-primary block mb-1">
              Service shows &quot;Down&quot; but is actually running
            </strong>
            <span className="text-sm">
              Check if the health endpoint URL is correct. Verify the service is
              accessible from the Next.js server by running{" "}
              <code className="font-mono text-xs">
                curl http://localhost:8081/health
              </code>
              .
            </span>
          </li>
          <li>
            <strong className="text-text-primary block mb-1">
              Health checks time out
            </strong>
            <span className="text-sm">
              The default timeout is 5 seconds per service. If services are slow
              to respond, they may be marked as down. Check service logs for
              performance issues.
            </span>
          </li>
          <li>
            <strong className="text-text-primary block mb-1">
              All services show &quot;Checking...&quot; indefinitely
            </strong>
            <span className="text-sm">
              The API route may be hanging. Check the Next.js server logs. Try
              restarting the dev server with{" "}
              <code className="font-mono text-xs">npx next dev</code>.
            </span>
          </li>
          <li>
            <strong className="text-text-primary block mb-1">
              Latency shows 0ms
            </strong>
            <span className="text-sm">
              This typically means the service is unreachable and the request
              failed immediately. Check network connectivity and service status.
            </span>
          </li>
        </ul>
      </section>

      {/* Related Documentation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Related Documentation
        </h2>
        <ul className="space-y-2 text-text-secondary list-disc pl-5">
          <li>
            <Link
              href="/docs/self-hosting/monitoring"
              className="text-secondary hover:underline"
            >
              Monitoring &amp; Grafana Dashboards
            </Link>{" "}
            — Advanced monitoring with Prometheus and Grafana
          </li>
          <li>
            <Link
              href="/docs/self-hosting/env-vars"
              className="text-secondary hover:underline"
            >
              Environment Variables
            </Link>{" "}
            — Complete list of configuration options
          </li>
          <li>
            <Link
              href="/docs/self-hosting/troubleshooting"
              className="text-secondary hover:underline"
            >
              Troubleshooting
            </Link>{" "}
            — Common issues and solutions
          </li>
        </ul>
      </section>
    </div>
  );
}
