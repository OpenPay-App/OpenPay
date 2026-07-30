import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function ProductionPage() {
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
        Production Deployment
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        Hardening guide for running OpenPay in production. Follow these steps
        before accepting real payments.
      </p>

      {/* TLS / HTTPS */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          1. Enable HTTPS
        </h2>
        <p className="text-text-secondary mb-4">
          Traefik supports automatic TLS certificates via Let&apos;s Encrypt.
          Add the following to your <code className="bg-bg-alt px-1.5 py-0.5 rounded text-xs font-mono">docker-compose.yml</code> under the
          Traefik service:
        </p>
        <CodeBlock title="docker-compose.yml">{`# In docker-compose.yml → traefik service
command:
  - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
  - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=https"
  - "--certificatesresolvers.letsencrypt.acme.email=you@example.com"
  - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
labels:
  - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
  - "traefik.http.routers.dashboard.tls.domains[0].main=your-domain.com"
  - "traefik.http.routers.dashboard.tls.domains[0].sans=*.your-domain.com"`}</CodeBlock>
      </section>

      {/* Strong Passwords */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          2. Generate Strong Secrets
        </h2>
        <p className="text-text-secondary mb-4">
          Never use default or weak passwords in production. Generate secure
          values:
        </p>
        <CodeBlock title="generate secrets">{`# Generate a random 32-character password
openssl rand -base64 32

# Use these for:
POSTGRES_PASSWORD=<generated>
REDIS_PASSWORD=<generated>
HYPERSWITCH_API_KEY=<generated>
KILLBILL_API_KEY=<generated>
KILLBILL_API_SECRET=<generated>`}</CodeBlock>
      </section>

      {/* Rate Limiting */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          3. Configure Rate Limiting
        </h2>
        <p className="text-text-secondary mb-4">
          Traefik rate-limit middleware protects against abuse. The default is
          100 requests per second per IP. Adjust for your use case:
        </p>
        <CodeBlock title="traefik.yml">{`# In traefik.yml (static config)
entryPoints:
  https:
    address: ":443"
    transport:
      respondingTimeouts:
        readTimeout: "30s"
        writeTimeout: "30s"

# Or via Docker labels:
labels:
  - "traefik.http.middlewares.ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.ratelimit.ratelimit.burst=50"
  - "traefik.http.middlewares.ratelimit.ratelimit.period=1s"`}</CodeBlock>
      </section>

      {/* Webhook Signatures */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          4. Verify Webhook Signatures
        </h2>
        <p className="text-text-secondary mb-4">
          Always verify webhook signatures to ensure events come from
          OpenPay and haven&apos;t been tampered with:
        </p>
        <CodeBlock title="Node.js">{`// Node.js webhook signature verification
import crypto from "crypto";

function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// In your webhook handler:
app.post("/webhooks/openpay", (req, res) => {
  const signature = req.headers["x-openpay-signature"];
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SIGNING_SECRET
  );

  if (!isValid) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Process the event...
  res.status(200).json({ received: true });
});`}</CodeBlock>
      </section>

      {/* Monitoring */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          5. Set Up Monitoring
        </h2>
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Health Checks
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              Monitor these endpoints and alert on failures:
            </p>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>
                <code className="font-mono text-xs text-secondary">GET http://hyperswitch:8080/health</code> — Hyperswitch
              </li>
              <li>
                <code className="font-mono text-xs text-secondary">GET http://killbill:8082/1.0/healthcheck</code> — Kill Bill
              </li>
              <li>
                <code className="font-mono text-xs text-secondary">GET http://nats:8222/healthz</code> — NATS
              </li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Log Aggregation
            </h3>
            <p className="text-sm text-text-secondary">
              All services log to stdout. Use Docker&apos;s logging drivers or a
              log aggregator (Loki, ELK, CloudWatch) to centralize logs. Set
              log levels to <code className="font-mono text-xs">info</code> in production.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-2">
              Uptime Monitoring
            </h3>
            <p className="text-sm text-text-secondary">
              Set up an external uptime monitor (e.g., UptimeRobot, Checkly)
              to ping your public endpoints and alert via email/Slack if
              the platform goes down.
            </p>
          </div>
        </div>
      </section>

      {/* Database Backups */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          6. Enable Database Backups
        </h2>
        <p className="text-text-secondary mb-4">
          Schedule regular PostgreSQL backups:
        </p>
        <CodeBlock title="bash">{`# Backup script (add to cron: 0 2 * * *)
docker exec postgres pg_dump -U postgres hyperswitch > \\
  /backups/hyperswitch-$(date +%Y%m%d).sql

# Restore from backup
docker exec -i postgres psql -U postgres hyperswitch < \\
  /backups/hyperswitch-20260726.sql`}</CodeBlock>
      </section>

      {/* Firewall */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          7. Restrict Network Access
        </h2>
        <p className="text-text-secondary mb-4">
          Only expose ports that must be public. All internal services
          (PostgreSQL, Redis, NATS) should only be accessible via the Docker
          network:
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Port</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Exposure</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Reason</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["443", "Public", "HTTPS traffic (Traefik)"],
                ["80", "Public", "HTTP → HTTPS redirect"],
                ["3000", "Internal", "Dashboard (behind auth)"],
                ["8080", "Internal", "Traefik dashboard"],
                ["8081", "Internal", "Hyperswitch API"],
                ["5432", "Docker only", "PostgreSQL — never expose"],
                ["6379", "Docker only", "Redis — never expose"],
                ["4222", "Docker only", "NATS — never expose"],
              ].map(([port, exposure, reason]) => (
                <tr key={port} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs text-secondary">{port}</code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{exposure}</td>
                  <td className="px-4 py-3 text-text-secondary">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SSL for internal */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Production Checklist
        </h2>
        <div className="p-6 rounded-xl border border-border bg-bg-alt">
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              HTTPS enabled with valid TLS certificate
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              All default passwords replaced with strong, unique values
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              Webhook signature verification enabled
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              Rate limiting configured
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              Health check monitoring set up
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              Log aggregation configured
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              Database backups scheduled
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              Firewall rules restrict internal ports
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              Paystack live API keys configured
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">□</span>
              Uptime monitoring with external pinger
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
