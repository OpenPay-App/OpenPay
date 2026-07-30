import Link from "next/link";
import { ArrowLeft, Shield, Key, Lock, Eye, Server, Wifi, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

const sections = [
  {
    id: "key-management",
    title: "API Key Management",
    icon: Key,
    items: [
      {
        title: "Sandbox vs Production Keys",
        description:
          "OpenPay supports full environment isolation through separate key prefixes. Sandbox keys start with <code className='font-mono text-xs'>sk_test_</code> (or <code className='font-mono text-xs'>op_test_</code>) and never process real payments. Production keys start with <code className='font-mono text-xs'>sk_live_</code> (or <code className='font-mono text-xs'>op_live_</code>) and handle live transactions.",
      },
      {
        title: "Key Rotation Policy",
        description:
          "Rotate API keys every 90 days as a security best practice. To rotate: generate a new key in the dashboard, update your application configurations, verify the new key works, then deactivate the old key. Never share keys across environments.",
      },
      {
        title: "Environment Variables",
        description:
          "All secrets must be stored in environment variables, never hardcoded. Each service has its own <code className='font-mono text-xs'>.env</code> file that is gitignored. Use <code className='font-mono text-xs'>.env.example</code> templates with placeholder values for documentation.",
      },
    ],
  },
  {
    id: "encryption",
    title: "Encryption at Rest & In Transit",
    icon: Lock,
    items: [
      {
        title: "TLS/SSL (In Transit)",
        description:
          "Traefik terminates TLS at the edge using automatic Let's Encrypt certificates. All external traffic is encrypted with TLS 1.3. Internal service-to-service communication runs over the Docker internal network (not exposed to the host), but can be configured with mTLS for additional security.",
      },
      {
        title: "Database Encryption (At Rest)",
        description:
          "PostgreSQL data is encrypted at rest using the host filesystem encryption (LUKS for Linux, BitLocker for Windows). Hyperswitch additionally encrypts sensitive fields (card BIN, last 4 digits) with AES-256 using the <code className='font-mono text-xs'>MASTER_ENC_KEY</code> configuration.",
      },
      {
        title: "Redis Encryption",
        description:
          "Redis supports optional TLS encryption for connections. Enable by setting <code className='font-mono text-xs'>REDIS_TLS_ENABLED=true</code> and providing the certificate path. Redis passwords are hashed using SHA-256 before storage.",
      },
    ],
  },
  {
    id: "authentication",
    title: "Authentication & Authorization",
    icon: Shield,
    items: [
      {
        title: "API Authentication",
        description:
          "All API requests to Hyperswitch require an <code className='font-mono text-xs'>api-key</code> header. Keys are generated using cryptographically secure random bytes. The dashboard uses Kinde for user authentication with support for OAuth2, OIDC, and social login providers.",
      },
      {
        title: "Role-Based Access Control (RBAC)",
        description:
          "The dashboard supports three roles: <strong>Admin</strong> (full access), <strong>Developer</strong> (API keys, payments, webhooks), and <strong>Analyst</strong> (read-only, fraud cases, reports). Roles are enforced server-side through Kinde permissions and middleware guards.",
      },
      {
        title: "Service-to-Service Authentication",
        description:
          "Internal services (NATS, Tazama, NATS-KB Bridge) authenticate using JWT tokens or username/password credentials. Each service has its own credentials stored in its <code className='font-mono text-xs'>.env</code> file. NATS supports token-based authentication for client connections.",
      },
    ],
  },
  {
    id: "webhook-security",
    title: "Webhook Security",
    icon: Eye,
    items: [
      {
        title: "Signature Verification",
        description:
          "All webhook events are signed using HMAC-SHA256. Your webhook endpoint must verify the signature before processing events to prevent forgery. The signing secret is configured per webhook endpoint.",
      },
      {
        title: "HTTPS Enforcement",
        description:
          "Webhook endpoints must use HTTPS. OpenPay will refuse to deliver events to HTTP URLs in production mode. For local testing, use a tool like <a href='https://ngrok.com' target='_blank' rel='noopener noreferrer' className='text-secondary hover:underline inline-flex items-center gap-1'>ngrok<ExternalLink className='w-3 h-3' /></a> to expose your local server with a HTTPS URL.",
      },
      {
        title: "IP Allowlisting",
        description:
          "Webhook events are sent from a predictable IP range. Configure your firewall to only accept webhook requests from these IPs. The current IP range is documented in the webhook settings page of your dashboard.",
      },
    ],
  },
  {
    id: "network-security",
    title: "Network Security",
    icon: Wifi,
    items: [
      {
        title: "Docker Network Isolation",
        description:
          "Services are organized into Docker networks with strict isolation. The <code className='font-mono text-xs'>core-net</code> bridge network connects all services, but sensitive services (PostgreSQL, Redis, NATS) only expose their ports within the Docker network — they are not accessible from the host.",
      },
      {
        title: "Firewall Rules",
        description:
          "Only expose ports 80 (HTTP → HTTPS redirect) and 443 (HTTPS) to the public internet. All other ports (3000, 8080, 8081, 8082, 5432, 6379, 4222) must be firewalled to internal access only.",
      },
      {
        title: "Rate Limiting",
        description:
          "Traefik applies rate limiting at the edge: 100 requests per second per IP by default. This prevents abuse and brute-force attacks. The rate limit can be adjusted per service in the Traefik configuration.",
      },
    ],
  },
  {
    id: "data-privacy",
    title: "Data Privacy & PCI Compliance",
    icon: Eye,
    items: [
      {
        title: "PCI Compliance Architecture",
        description:
          "OpenPay is designed for PCI DSS compliance when properly configured. Card data is tokenized by Hyperswitch and never stored in the merchant database. The merchant dashboard never collects raw card numbers — all card entry happens through Hyperswitch Elements (secure iframes).",
      },
      {
        title: "Data Retention",
        description:
          "Payment events are retained in NATS JetStream for 72 hours by default. Transaction records in PostgreSQL are kept indefinitely for accounting purposes, but sensitive card data (full PAN) is never stored — only the last 4 digits and BIN are retained for reference.",
      },
      {
        title: "Logging & Audit Trails",
        description:
          "All payment state transitions are logged with timestamps and actor information. Logs are emitted to stdout and can be aggregated using Docker logging drivers. In production, enable log aggregation (Loki, ELK, or CloudWatch) for centralized audit trails.",
      },
    ],
  },
];

export default function SecurityPage() {
  return (
    <div>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white">Security Practices</h1>
        </div>
        <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
          OpenPay is built with security as a foundational principle. This guide
          covers key management, encryption, authentication, network security,
          and compliance considerations for running your payment infrastructure
          securely.
        </p>
      </div>

      {/* Quick Security Checklist */}
      <section className="mb-12">
        <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
          <h2 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Minimum Security Checklist
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              "All default passwords replaced with strong, unique values",
              "HTTPS enabled with valid TLS certificate (Let's Encrypt)",
              "Webhook signature verification implemented",
              "Rate limiting configured on public endpoints",
              "Database backups scheduled and encrypted",
              "Firewall restricts internal ports",
              "API keys rotated every 90 days",
              "Log aggregation and monitoring active",
              "PostgreSQL and Redis not exposed to public internet",
              "NATS authentication enabled for client connections",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-emerald-300">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <section.icon className="w-4 h-4 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            </div>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-white/10 transition-colors"
                >
                  <h3 className="font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* External Links */}
      <section className="mt-16 p-6 rounded-xl border border-border bg-[#0a0a0a]">
        <h2 className="text-lg font-semibold text-white mb-4">
          External Security Resources
        </h2>
        <div className="space-y-3">
          {[
            {
              title: "PCI Security Standards Council",
              url: "https://www.pcisecuritystandards.org/",
              description: "Official PCI DSS requirements and self-assessment questionnaires",
            },
            {
              title: "Let's Encrypt Documentation",
              url: "https://letsencrypt.org/docs/",
              description: "Free, automated TLS certificates for your production deployment",
            },
            {
              title: "OWASP Top 10",
              url: "https://owasp.org/www-project-top-ten/",
              description: "Web application security risks and mitigation strategies",
            },
            {
              title: "NATS Security Documentation",
              url: "https://docs.nats.io/running-a-nats-service/nats_admin/security",
              description: "NATS authentication, authorization, and encryption options",
            },
            {
              title: "PostgreSQL Security Guide",
              url: "https://www.postgresql.org/docs/current/security.html",
              description: "Database hardening, encryption, and access control",
            },
          ].map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-secondary/30 hover:bg-white/5 transition-all group"
            >
              <div>
                <h3 className="font-medium text-white group-hover:text-secondary transition-colors text-sm flex items-center gap-2">
                  {resource.title}
                  <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-secondary transition-colors" />
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  {resource.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Next steps */}
      <section className="mt-8">
        <Link
          href="/docs/self-hosting/production"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
        >
          Production Deployment Guide →
        </Link>
      </section>
    </div>
  );
}
