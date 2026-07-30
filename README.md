<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/OpenPay-App/openpay/refs/heads/main/apps/merchant-dashboard/public/brand/logo-dark.svg">
    <img alt="OpenPay — Open-Source Payment Infrastructure" src="https://raw.githubusercontent.com/OpenPay-App/openpay/refs/heads/main/apps/merchant-dashboard/public/brand/logo.svg" width="400" height="auto">
  </picture>
</p>

<p align="center">
  <strong>Self-hosted, open-source payment infrastructure.</strong>
  <br />
  Process payments, manage subscriptions, detect fraud — on your own servers, with zero vendor lock-in.
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://github.com/OpenPay-App/openpay/releases"><img src="https://img.shields.io/github/v/tag/OpenPay-App/openpay?include_prereleases&color=orange&label=version" alt="Version"></a>
  <a href="https://github.com/OpenPay-App/openpay/stargazers"><img src="https://img.shields.io/github/stars/OpenPay-App/openpay?style=flat&color=yellow" alt="Stars"></a>
  <a href="https://github.com/OpenPay-App/openpay/pulse"><img src="https://img.shields.io/github/commit-activity/m/OpenPay-App/openpay?color=green" alt="Commit Activity"></a>
  <a href="https://github.com/OpenPay-App/openpay/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/contributions-welcome-brightgreen" alt="Contributions Welcome"></a>
</p>

<br />

---

<br />

## Files

| File | Description |
|------|-------------|
| **[README.md](./README.md)** | Project overview, quick start, architecture |
| **[LICENSE](./LICENSE)** | MIT License — free to use, modify, and distribute |
| **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** | Community guidelines for contributors |
| **[SECURITY.md](./SECURITY.md)** | Security policy and vulnerability reporting |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Contribution workflow, code style, PR process |
| **[Makefile](./Makefile)** | Development shortcuts (`make up`, `make logs`, etc.) |
| **[docker-compose.yml](./docker-compose.yml)** | Service orchestration for all 10+ microservices |
| **[docs/](./apps/merchant-dashboard/src/app/docs)** | Full documentation site (Next.js app) |

<br />

---

<br />

## What is OpenPay?

OpenPay is a **self-hosted, open-source payment platform** that gives you everything Stripe offers — payments, subscriptions, invoicing, fraud detection, webhooks — on **your own infrastructure**, at **zero platform fees**.

| Instead of paying Stripe... | You pay with OpenPay |
|---|---|
| 2.9% + $0.30 per transaction | $0 — only your processor's fee |
| $0.40 per invoice | $0 — unlimited invoicing |
| $0.05 per transaction (Radar) | $0 — built-in fraud detection |
| 1% currency conversion | $0 — real exchange rate |
| Vendor lock-in | $0 — swap processors anytime |

<br />

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/OpenPay-App/openpay.git
cd OpenPay

# 2. Copy environment files
cp .env.example .env
cp payment-system/hyperswitch/.env.example payment-system/hyperswitch/.env
cp payment-system/killbill/.env.example payment-system/killbill/.env

# 3. Start everything (10+ services)
make up

# 4. Initialize event streams
./event-bus/nats/scripts/init-streams.sh

# 5. Open the dashboard
open http://localhost:3000
```

> **Prerequisites:** Docker & Docker Compose (v2.0+), Git, 4GB+ RAM

<br />

## Architecture

OpenPay is built on battle-tested open-source components connected via NATS JetStream:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Payment Engine** | [Hyperswitch](https://hyperswitch.io) (Rust) | Routes payments to 100+ processors |
| **Subscription Billing** | [Kill Bill](https://docs.killbill.io) (Java) | Plans, invoicing, dunning |
| **Event Bus** | NATS JetStream (Go) | Async service communication |
| **Fraud Detection** | [Tazama](https://github.com/tazama-lf/tazama) (Go/TS) | Rule evaluation, case management |
| **Reverse Proxy** | Traefik v2.10 | TLS, rate limiting, routing |
| **Database** | PostgreSQL 15 | Persistent storage |
| **Cache** | Redis 7 | Sessions, rate limiting |
| **Dashboard** | Next.js 15 + TypeScript | Merchant UI, docs, landing page |

<br />

## Services

| Service | Port | Description |
|---------|------|-------------|
| Merchant Dashboard | `3000` (dev) / `3002` (avoid conflict) | Merchant UI (Next.js) |
| Hyperswitch API | `8081` | Payment processing |
| Kill Bill API | `8082` | Subscription billing |
| Tazama Rule Exec | `8084` | Fraud rules engine |
| NATS Monitoring | `8222` | Event bus dashboard |
| Traefik Dashboard | `8080` | Reverse proxy UI |
| Tazama Rule Studio | `3000` | Rule authoring |
| Case Management | `3001` | Alert review |

Internal services (PostgreSQL `5432`, Redis `6379`, NATS `4222`) **must never be exposed to the internet**.

<br />

## Use Cases

- **SaaS companies** tired of platform fees eating margins
- **Developers** wanting full control over their payment stack
- **Businesses** needing multi-provider payment routing
- **Fintech teams** building on open-source infrastructure
- **Enterprise** requiring data sovereignty and self-hosting

<br />

## Documentation

Full documentation is available at **[/docs](apps/merchant-dashboard/src/app/docs)** or at [https://openpay.dev/docs](https://openpay.dev/docs):

| Section | Description |
|---------|-------------|
| [Quickstart](apps/merchant-dashboard/src/app/docs/quickstart/page.tsx) | Get running in 10 minutes |
| [First Payment](apps/merchant-dashboard/src/app/docs/first-payment/page.tsx) | Process your first test transaction |
| [Architecture](apps/merchant-dashboard/src/app/docs/architecture/page.tsx) | System design, event flow, service matrix |
| [API Reference](apps/merchant-dashboard/src/app/docs/api/page.tsx) | REST endpoints, request/response formats |
| [Self-Hosting](apps/merchant-dashboard/src/app/docs/self-hosting/page.tsx) | Docker setup, env vars, production deploy |
| [Security](apps/merchant-dashboard/src/app/docs/security/page.tsx) | Key management, encryption, PCI compliance |
| [Troubleshooting](apps/merchant-dashboard/src/app/docs/self-hosting/troubleshooting/page.tsx) | Common issues and solutions |
| [Webhooks](apps/merchant-dashboard/src/app/docs/guides/webhooks/page.tsx) | Event types, retry policy, signature verification |
| [Contributing](apps/merchant-dashboard/src/app/docs/contributing/page.tsx) | How to contribute code, docs, or ideas |

<br />

## Community

- **[GitHub Discussions](https://github.com/OpenPay-App/openpay/discussions)** — Ask questions, share ideas, get help
- **[GitHub Issues](https://github.com/OpenPay-App/openpay/issues)** — Report bugs, request features
- **[Contributing Guide](./CONTRIBUTING.md)** — Learn how to contribute
- **[Code of Conduct](./CODE_OF_CONDUCT.md)** — Our community standards

<br />

## License

[MIT](./LICENSE) — Free to use, modify, and distribute. OpenPay is built for the community, by the community.

<br />
<br />

---

<p align="center">
  <sub>Built with ❤️ for the open-source community · MIT Licensed · 100% Free</sub>
  <br />
  <sub>OpenPay is not affiliated with Stripe, Paystack, Hyperswitch, or Kill Bill.</sub>
</p>