export interface SearchDocItem {
  id: string;
  title: string;
  heading?: string;
  content: string;
  href: string;
  section: string;
}

export const docsSearchData: SearchDocItem[] = [
  // Getting Started
  {
    id: "about-openpay",
    title: "About OpenPay",
    heading: "Overview",
    content: "OpenPay is a self-hosted, open-source payment infrastructure that gives you full control over your payments stack without vendor lock-in, hidden fees, or platform taxes.",
    href: "/docs",
    section: "Getting Started",
  },
  {
    id: "about-mission",
    title: "About OpenPay",
    heading: "Our Mission",
    content: "Empower businesses with independent payment routing, complete transaction ownership, multi-processor redundancy, and zero platform take-rate fees.",
    href: "/docs#mission",
    section: "Getting Started",
  },
  {
    id: "quickstart-prereqs",
    title: "Quickstart",
    heading: "Prerequisites",
    content: "Docker & Docker Compose, Git, Paystack account secret and public keys, 4GB+ RAM available for 10+ container services.",
    href: "/docs/quickstart#prerequisites",
    section: "Getting Started",
  },
  {
    id: "quickstart-clone",
    title: "Quickstart",
    heading: "Step 1: Clone the Repository",
    content: "git clone https://github.com/OpenPay-App/openpay.git. Navigate into directory and inspect project layout.",
    href: "/docs/quickstart#step-1",
    section: "Getting Started",
  },
  {
    id: "quickstart-env",
    title: "Quickstart",
    heading: "Step 2: Configure Environment Variables",
    content: "Copy .env.example files across services. Set PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY, POSTGRES_PASSWORD, REDIS_PASSWORD.",
    href: "/docs/quickstart#step-2",
    section: "Getting Started",
  },
  {
    id: "quickstart-start",
    title: "Quickstart",
    heading: "Step 3: Start the Platform",
    content: "Run make up or docker compose up -d to start all 10 microservices including Hyperswitch, Kill Bill, NATS, Traefik, PostgreSQL, Redis.",
    href: "/docs/quickstart#step-3",
    section: "Getting Started",
  },
  {
    id: "quickstart-dev-not-starting",
    title: "Quickstart",
    heading: "Dev Not Starting & Container Troubleshooting",
    content: "If dev server or containers fail to start, verify memory allocation (minimum 4GB), inspect docker compose logs -f, check port collisions on 3000, 8081, 8082.",
    href: "/docs/quickstart#troubleshooting",
    section: "Getting Started",
  },
  {
    id: "quickstart-streams",
    title: "Quickstart",
    heading: "Step 4: Initialize Event Streams",
    content: "Execute ./event-bus/nats/scripts/init-streams.sh to provision NATS JetStream event subjects.",
    href: "/docs/quickstart#step-4",
    section: "Getting Started",
  },
  {
    id: "first-payment-overview",
    title: "First Payment",
    heading: "Accepting Your First Payment",
    content: "Create payment intents, test card numbers, process transactions via Hyperswitch engine, and handle payment status webhooks.",
    href: "/docs/first-payment",
    section: "Getting Started",
  },
  {
    id: "first-payment-test-cards",
    title: "First Payment",
    heading: "Test Card Numbers",
    content: "Use test credit card numbers for successful charges, authentication failures, insufficient funds, and declined transactions.",
    href: "/docs/first-payment#test-cards",
    section: "Getting Started",
  },

  // Architecture
  {
    id: "arch-overview",
    title: "Architecture Overview",
    heading: "System Architecture",
    content: "High-level overview of OpenPay microservices architecture, NATS JetStream event bus, payment routing engine, and storage layers.",
    href: "/docs/architecture",
    section: "Architecture",
  },
  {
    id: "arch-services",
    title: "Architecture Services",
    heading: "Core Microservices",
    content: "Hyperswitch core router, Kill Bill subscription billing engine, NATS event bus bridge, Traefik API gateway, PostgreSQL primary database, Redis cache.",
    href: "/docs/architecture/services",
    section: "Architecture",
  },
  {
    id: "arch-events",
    title: "Event Flow",
    heading: "NATS JetStream Event Pipeline",
    content: "Event-driven architecture publishing payment.created, payment.succeeded, payment.failed, and subscription.renewed events asynchronously.",
    href: "/docs/architecture/events",
    section: "Architecture",
  },

  // Security
  {
    id: "security-overview",
    title: "Security Overview",
    heading: "PCI-DSS & Encryption",
    content: "Tokenization, AES-256 vault encryption, secret isolation, TLS enforcement, and secure payment processing compliance guidelines.",
    href: "/docs/security",
    section: "Security",
  },

  // Self-Hosting
  {
    id: "self-hosting-docker",
    title: "Self-Hosting",
    heading: "Docker Setup",
    content: "Deploying OpenPay with Docker Compose, volume persistent storage, health checks, and container orchestration configuration.",
    href: "/docs/self-hosting",
    section: "Self-Hosting",
  },
  {
    id: "self-hosting-env",
    title: "Self-Hosting",
    heading: "Environment Variables Reference",
    content: "Comprehensive list of environment variables for database credentials, gateway API keys, JWT secrets, NATS URL, and CORS settings.",
    href: "/docs/self-hosting/env-vars",
    section: "Self-Hosting",
  },
  {
    id: "self-hosting-tools",
    title: "Self-Hosting",
    heading: "Third-Party Integrations & Tools",
    content: "Connecting third-party analytics, logging aggregation, notification webhooks, and custom payment processors.",
    href: "/docs/self-hosting/tools",
    section: "Self-Hosting",
  },
  {
    id: "self-hosting-monitoring",
    title: "Self-Hosting",
    heading: "Monitoring & Grafana Dashboards",
    content: "Prometheus metrics export, Grafana dashboards for transaction throughput, error rates, and system latency monitoring.",
    href: "/docs/self-hosting/monitoring",
    section: "Self-Hosting",
  },
  {
    id: "self-hosting-status",
    title: "Self-Hosting",
    heading: "Status Page",
    content: "Setting up public and internal status pages for real-time uptime monitoring and incident management reporting.",
    href: "/docs/self-hosting/status-page",
    section: "Self-Hosting",
  },
  {
    id: "self-hosting-troubleshooting",
    title: "Self-Hosting",
    heading: "Troubleshooting & Common Issues",
    content: "Resolving database connection timeouts, container startup failures, NATS stream errors, and dev server not starting issues.",
    href: "/docs/self-hosting/troubleshooting",
    section: "Self-Hosting",
  },

  // API Reference
  {
    id: "api-overview",
    title: "API Reference",
    heading: "REST API Overview",
    content: "Authentication with Bearer API tokens, error codes, rate limits, JSON response formats, and SDK integration methods.",
    href: "/docs/api",
    section: "API Reference",
  },
  {
    id: "api-payments",
    title: "API Reference",
    heading: "Payments API",
    content: "Endpoints for creating payment intents, confirming payments, capturing authorized charges, and fetching transaction history.",
    href: "/docs/api/payments",
    section: "API Reference",
  },
  {
    id: "api-customers",
    title: "API Reference",
    heading: "Customers API",
    content: "Manage customer profiles, saved payment methods, billing addresses, and default payment tokens.",
    href: "/docs/api/customers",
    section: "API Reference",
  },
  {
    id: "api-refunds",
    title: "API Reference",
    heading: "Refunds API",
    content: "Issue full or partial refunds against completed payment transactions, track refund statuses and dispute records.",
    href: "/docs/api/refunds",
    section: "API Reference",
  },

  // Guides
  {
    id: "guide-accepting-payments",
    title: "Guides",
    heading: "Accepting Payments Guide",
    content: "Step-by-step tutorial for integrating checkout UI, handling client-side tokens, and processing live payments securely.",
    href: "/docs/guides/accepting-payments",
    section: "Guides",
  },
  {
    id: "guide-webhooks",
    title: "Guides",
    heading: "Webhooks & Event Handlers",
    content: "Listen to real-time webhook events, verify HMAC signature headers, handle retries and event idempotency.",
    href: "/docs/guides/webhooks",
    section: "Guides",
  },

  // SDKs & Contributing
  {
    id: "sdk-overview",
    title: "SDKs & Libraries",
    heading: "Client & Server SDKs",
    content: "Official SDK libraries for Node.js, Python, Go, React, and REST API wrappers for custom app development.",
    href: "/docs/sdk",
    section: "SDKs & Libraries",
  },
  {
    id: "contributing-overview",
    title: "Contributing",
    heading: "Contribution Guidelines",
    content: "How to contribute code, submit pull requests, run automated unit tests, and follow code style conventions.",
    href: "/docs/contributing",
    section: "Contributing",
  },
  {
    id: "changelog-overview",
    title: "Changelog",
    heading: "Release History & Updates",
    content: "Track latest feature additions, security releases, bug fixes, and breaking API changes.",
    href: "/changelog",
    section: "Changelog",
  },
];
