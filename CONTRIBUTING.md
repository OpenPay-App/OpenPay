# Contributing to Core Financial Platform

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Finding Issues to Work On](#finding-issues-to-work-on)
- [Community Guidelines](#community-guidelines)
- [Testing](#testing)
- [Development Tips](#development-tips)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker & Docker Compose** (v2.0+)
- **Node.js** (v18+) — for the merchant dashboard
- **pnpm** (v8+) — package manager for the dashboard
- **Make** (optional) — for development shortcuts
- **Git** (v2.30+)

---

## Development Setup

### 1. Fork & Clone

```bash
# Fork the repository on GitHub, then clone
git clone https://github.com/YOUR_USERNAME/core-financial-platform.git
cd core-financial-platform
```

### 2. Set Up Environment

```bash
# Copy environment templates
cp .env.example .env
cp event-bus/.env.example event-bus/.env
cp payment-system/hyperswitch/.env.example payment-system/hyperswitch/.env
cp payment-system/killbill/.env.example payment-system/killbill/.env
cp payment-system/nats-kb-bridge/.env.example payment-system/nats-kb-bridge/.env
cp monitoring-and-rules/.env.example monitoring-and-rules/.env
cp monitoring-and-rules/tazama-auth/.env.example monitoring-and-rules/tazama-auth/.env
cp monitoring-and-rules/tazama-rule-exec/.env.example monitoring-and-rules/tazama-rule-exec/.env
cp monitoring-and-rules/tazama-rule-studio/.env.example monitoring-and-rules/tazama-rule-studio/.env
cp monitoring-and-rules/case-management/.env.example monitoring-and-rules/case-management/.env

# Edit .env files with your actual configuration values
```

### 3. Start Services

```bash
# Start all services
docker compose up -d

# Check service status
docker compose ps

# View logs
docker compose logs -f
```

### 4. Initialize NATS JetStream

After starting services, initialize the event streams:

```bash
# Run the initialization script
./event-bus/nats/scripts/init-streams.sh

# Or via Make
make init-streams
```

### 5. Set Up Merchant Dashboard

```bash
cd apps/merchant-dashboard

# Copy environment template
cp .env.local.example .env.local

# Install dependencies
pnpm install

# Start dev server (Turbopack enabled by default)
# Use --port 3002 to avoid conflict with Tazama Rule Studio on port 3000
pnpm dev --port 3002
```

The dashboard will be available at `http://localhost:3002`.

### Service Ports Reference

| Service | Port | Description |
|---------|------|-------------|
| Traefik Dashboard | 8080 | Reverse proxy & routing |
| NATS Monitoring | 8222 | Event bus monitoring |
| Hyperswitch API | 8081 | Payment orchestration API |
| Kill Bill API | 8082 | Subscription & billing API |
| Tazama Auth | 8083 | Fraud detection auth |
| Tazama Rule Exec | 8084 | Rule execution engine |
| Tazama Rule Studio | 3000 | Fraud rule authoring UI |
| Case Management | 3001 | Fraud case dashboard |
| Mock Superposition | 9999 | Local dev config mock |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache & sessions |
| NATS | 4222 | Event bus |
| **Merchant Dashboard** | **3002** | **Local dev only** (Next.js) |

> **Note**: The Merchant Dashboard is a local-only Next.js app (not containerized). Run it on port 3002 to avoid conflicting with Tazama Rule Studio (port 3000).

---

## Architecture Overview

This platform follows a **microservices architecture** with **event-driven communication** via NATS JetStream. Services are loosely coupled and communicate asynchronously through CloudEvents-formatted messages.

### Service Map

```
                         ┌─────────────────┐
                         │     Traefik      │  Edge proxy, SSL/TLS, routing
                         │    (port 8080)   │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
   │   Hyperswitch   │ │    Kill Bill    │ │  Merchant       │
   │  (port 8081)    │ │  (port 8082)    │ │  Dashboard      │
   │  Payment engine  │ │  Subscriptions  │ │  (port 3002)    │
   └────────┬────────┘ └────────┬────────┘ └─────────────────┘
            │                   │
            ▼                   ▼
   ┌─────────────────────────────────────┐
   │          NATS JetStream             │  Event bus
   │     (ports 4222, 8222)              │
   │  PAYMENT_EVENTS  ·  DLQ_EVENTS      │
   └───┬──────────┬──────────┬───────────┘
       │          │          │
       ▼          ▼          ▼
  ┌─────────┐ ┌─────────┐ ┌──────────────┐
  │ NATS-KB │ │ Tazama  │ │ Tazama Rule  │
  │ Bridge  │ │  Auth   │ │    Exec      │
  │ (Go)    │ │(8083)   │ │  (8084)      │
  └────┬────┘ └─────────┘ └──────┬───────┘
       │                         │
       ▼                         ▼
  ┌─────────┐           ┌────────────────┐
  │Kill Bill│           │ Tazama Rule    │
  │  sync   │           │   Studio (3000)│
  └─────────┘           │ Case Mgmt(3001)│
                        └────────────────┘
```

### How Services Communicate

All inter-service communication flows through **NATS JetStream** using the [CloudEvents v1.0](https://cloudevents.io/) specification. Services publish and subscribe to typed event subjects.

#### Event Types

| Event Type | Producer | Consumer(s) | Description |
|---|---|---|---|
| `payments.charge.pending` | Hyperswitch | Fraud Detection | Payment initiated, awaiting authorization |
| `payments.charge.completed` | Hyperswitch | NATS-KB Bridge, Fraud Detection | Payment succeeded |
| `payments.charge.failed` | Hyperswitch | Fraud Detection | Payment failed (exhausted retries → DLQ) |
| `payments.charge.refunded` | Hyperswitch | Fraud Detection | Full or partial refund |
| `payments.charge.disputed` | Hyperswitch | Fraud Detection | Customer disputed the charge |
| `payments.refund.completed` | Hyperswitch | NATS-KB Bridge | Refund processed |
| `dlq.event.failed` | NATS DLQ | Case Management | Event failed after max retries (auto-routed to DLQ stream) |

#### NATS Streams

| Stream | Subject Pattern | Purpose |
|---|---|---|
| `PAYMENT_EVENTS` | `payments.>` | All payment lifecycle events (72h retention) |
| `DLQ_EVENTS` | `dlq.>` | Dead-letter events for failed processing (168h retention) |

#### NATS Consumers

| Consumer | Filter | Purpose |
|---|---|---|---|
| `payment-processed` | `payments.charge.completed` | Triggers invoicing in Kill Bill via NATS-KB Bridge |
| `fraud-detection` | `payments.>` | Runs fraud rules via Tazama on every payment event |

### Payment Flow

Here's what happens when a customer makes a payment:

1. **Merchant Dashboard** sends a `POST /payments` request to **Hyperswitch**
2. **Hyperswitch** routes the payment through the configured connector (e.g., Paystack) and publishes a `payments.charge.pending` event to NATS
3. **Tazama Rule Exec** picks up the pending event, evaluates fraud rules, and flags or approves the transaction (this is a **pre-authorization** check — it happens *before* the connector processes the payment)
4. **Hyperswitch** receives the connector response and publishes `payments.charge.completed` (or `.failed`) to NATS
5. **NATS-KB Bridge** syncs the completed payment to **Kill Bill** for invoice generation and subscription billing
6. **Tazama** monitors all events for ongoing fraud signals
7. If any event fails processing after retries, it lands in the **DLQ** stream for investigation in **Case Management**

### CloudEvents Schema

All events follow the CloudEvents v1.0 spec. Example:

```json
{
  "specversion": "1.0",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "urn:core-financial:payment-system",
  "type": "payments.charge.completed",
  "time": "2024-01-01T00:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "paymentId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 500000,
    "currency": "NGN",
    "status": "completed",
    "reference": "paystack_ref_123"
  }
}
```

Event schemas are defined in `shared/schemas/` as JSON Schema files. When adding a new event type:

1. Add the type to the `enum` array in the appropriate schema file
2. Update the NATS stream/consumer configuration if needed
3. Document the event in this guide

---

## Project Structure

```
core-financial-platform/
├── apps/
│   └── merchant-dashboard/    # Next.js merchant UI
├── payment-system/
│   ├── hyperswitch/           # Payment orchestration (Rust)
│   ├── killbill/              # Subscription billing (Java)
│   └── nats-kb-bridge/        # Reconciliation bridge (Go)
├── monitoring-and-rules/
│   ├── tazama-auth/           # Authentication service
│   ├── tazama-rule-exec/      # Rule execution engine
│   ├── tazama-rule-studio/    # Rule authoring UI
│   └── case-management/       # Fraud case dashboard
├── event-bus/                 # NATS JetStream config
├── proxy/                     # Traefik reverse proxy
├── shared/schemas/            # CloudEvents JSON schemas
├── docker-compose.yml         # Service orchestration
├── Makefile                   # Dev shortcuts
└── README.md                  # Project documentation
```

---

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Purpose |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code refactoring |
| `test/` | Adding or updating tests |
| `chore/` | Maintenance tasks |

Example: `feat/add-stripe-connector`

### Making Changes

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes**:
   ```bash
   # For dashboard changes
   cd apps/merchant-dashboard
   pnpm lint
   pnpm build
   ```

4. **Commit with a clear message** (see Commit Messages below)

5. **Push and create a Pull Request**

---

## Code Style Guidelines

### General

- Use **TypeScript** for all new frontend code
- Use **functional components** with hooks in React
- Keep files under **300 lines** when possible
- Write self-documenting code; add comments for complex logic

### TypeScript/JavaScript

- Use **strict TypeScript** — avoid `any` types
- Use **named exports** over default exports
- Prefer `const` over `let`; never use `var`
- Use **optional chaining** (`?.`) and **nullish coalescing** (`??`)
- Format with Prettier (default config)

### React/Next.js

- Use `"use client"` directive only when needed (interactivity)
- Keep server components as the default
- Extract reusable components to `/components`
- Use Tailwind CSS classes; avoid inline styles

### CSS/Tailwind

- Use the project's design tokens (see `globals.css`)
- Follow the existing color palette:
  - `text-primary` / `text-secondary` / `text-muted`
  - `bg-bg-alt` / `bg-bg-dark`
  - `border-border`
  - `text-secondary` (accent color)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(hyperswitch): add Stripe connector support
fix(dashboard): resolve 404 on admin page
docs: update README port mappings
chore(deps): update Next.js to v15.3.3
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of your code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] No console errors or warnings
- [ ] Tested locally with `docker compose up`

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] My code follows the project style
- [ ] I have tested this locally
- [ ] I have updated documentation if needed
```

### Review Process

1. PRs require at least **1 approval** before merging
2. Address all review comments
3. Ensure CI checks pass
4. Squash and merge into `main`

---

## Reporting Issues

### Bug Reports

Use the GitHub Issue template and include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, Docker version, browser

### Feature Requests

- Describe the problem you're trying to solve
- Explain your proposed solution
- List any alternatives considered

---

## Finding Issues to Work On

### Issue Labels

We use labels to categorize and prioritize issues. Here's what they mean:

| Label | Description |
|---|---|
| `good first issue` | Great for newcomers — smaller scope, well-defined, no deep domain knowledge needed |
| `help wanted` | We'd love community help on this — may require some context but not a maintainer |
| `bug` | Something is broken or not working as expected |
| `enhancement` | A new feature or improvement to existing functionality |
| `documentation` | Improvements or additions to docs |
| `question` | Further information is requested |
| `wontfix` | This will not be worked on |
| `priority: high` | Critical issue that needs immediate attention |
| `priority: low` | Nice to have, no rush |

### Finding Your First Issue

1. **Filter by `good first issue`** — [Browse issues with this label](../../labels/good%20first%20issue) to find tasks scoped for newcomers
2. **Filter by `help wanted`** — [Browse issues with this label](../../labels/help%20wanted) for tasks where we explicitly need community contributions
3. **Filter by language/service** — Use the `dashboard`, `hyperswitch`, `killbill`, `tazama`, or `docs` labels to find issues in areas you're comfortable with

### How to Claim an Issue

1. **Comment on the issue** — Leave a brief comment like "I'd like to work on this" to let others know you're taking it
2. **Wait for assignment** — A maintainer will assign the issue to you (this prevents duplicate work)
3. **Start a discussion** — If the issue is complex or has multiple approaches, comment with your proposed approach before coding
4. **Time expectations** — Once assigned, we expect a PR within **2 weeks**. If you need more time, just let us know — we won't reassign unless there's no communication
5. **Stuck?** — Comment on the issue or ask in [GitHub Discussions](../../discussions). We'd rather help you finish than have you struggle silently

### What Makes a Good Contribution

- **Small, focused PRs** — One issue per PR. Avoid bundling unrelated changes
- **Tests when possible** — If the project has tests for the area you're changing, add or update them
- **Follow conventions** — Match the existing code style (see [Code Style Guidelines](#code-style-guidelines))
- **Update docs** — If your change affects user-facing behavior, update the relevant documentation
- **Screenshots for UI changes** — Include before/after screenshots for any visual changes

---

## Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Respect different viewpoints and experiences
- Accept constructive criticism gracefully

### Get Help

- Check existing documentation first
- Search existing issues before creating new ones
- Ask questions in GitHub Discussions

---

## Testing

The project uses **Vitest** for unit tests and **Playwright** for end-to-end tests. Tests are not yet set up across all services — contributions to add test coverage are welcome!

### Unit Tests (Vitest)

Unit tests live next to the source files they test:

```
src/
├── lib/
│   ├── format.ts
│   └── format.test.ts      # unit test for format.ts
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx  # component test
└── hooks/
    ├── useAuth.ts
    └── useAuth.spec.ts      # hook test
```

**Running unit tests:**

```bash
cd apps/merchant-dashboard
pnpm test          # run all tests
pnpm test:watch    # watch mode (re-runs on file changes)
pnpm test:coverage # run with coverage report
```

**Writing unit tests:**

- Test **behavior**, not implementation details
- One test file per source file
- Use `*.test.ts` or `*.test.tsx` suffix (e.g., `format.test.ts`, `Button.test.tsx`)
- Mock external dependencies (API calls, auth, NATS) — don't hit real services
- Aim for tests that are fast, isolated, and deterministic

**Example component test:**

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByText("Click"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### End-to-End Tests (Playwright)

E2E tests live in a dedicated `tests/` directory and test full user flows against a running instance of the app:

```
tests/
├── login.spec.ts         # authentication flow
├── dashboard.spec.ts     # dashboard loads with data
├── payments.spec.ts      # payment list and detail views
└── checkout.spec.ts      # checkout flow
```

**Running E2E tests:**

```bash
cd apps/merchant-dashboard
pnpm test:e2e          # run all E2E tests
pnpm test:e2e:ui       # run with Playwright UI (step through tests visually)
```

**Writing E2E tests:**

- Test **user-visible behavior** — clicks, navigation, form submissions, visible data
- Don't test implementation details (CSS classes, internal state)
- Use Playwright's built-in assertions (`expect(locator).toHaveText()`)
- Use `page.locator()` over deprecated `page.$()` APIs
- Each test should be independent — don't rely on state from previous tests
- Mock external APIs (Paystack, Hyperswitch) at the network level using `page.route()`

**Example E2E test:**

```ts
import { test, expect } from "@playwright/test";

test("dashboard shows payment summary", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Total Revenue")).toBeVisible();
  await expect(page.locator("[data-testid=payment-count]")).not.toHaveText("0");
});
```

### Integration Tests (Docker)

For testing interactions between services (e.g., NATS event flow, Hyperswitch → Kill Bill sync), use the full Docker stack:

```bash
# Start all services
make up

# Test payment flow end-to-end
make test-flow

# Verify NATS streams
nats stream ls --server nats://localhost:4222

# Check service health
curl http://localhost:8081/health    # Hyperswitch
curl http://localhost:8082/1.0/healthcheck  # Kill Bill
```

### What to Test

| Change Type | Test Type Required |
|---|---|
| New component or hook | Unit test (Vitest) |
| UI behavior change | Unit test + E2E test if user-facing |
| API endpoint change | Integration test with running services |
| Event schema change | Unit test + verify with `make test-flow` |
| Bug fix | Regression unit test |
| Documentation only | No test required |

### Test Conventions

- Use `describe()` blocks to group related tests
- Test names should read like sentences: `it("formats currency correctly")`
- Prefer `it()` over `test()` for consistency
- Use `vi.fn()` and `vi.mock()` for mocking (Vitest built-in)
- Keep test files under 200 lines — split into multiple files if needed

---

## Development Tips

### Useful Commands

```bash
# Make shortcuts (run `make help` to see all targets)
make up              # Start all services
make down            # Stop all services
make logs            # View all logs
make clean           # Remove containers, volumes, networks
make build           # Rebuild all services
make init-streams    # Initialize NATS JetStream streams
make test-flow       # Test payment flow end-to-end
make db-shell        # Connect to PostgreSQL shell
make redis-shell     # Connect to Redis shell

# Docker Compose directly
docker compose up -d hyperswitch redis postgres   # Start specific services
docker compose logs -f hyperswitch               # View specific service logs
docker compose restart hyperswitch               # Restart a service
docker compose down -v --remove-orphans           # Clean up everything
```

### Common Issues

**Hyperswitch won't start:**
- Ensure PostgreSQL and Redis are healthy first
- Hyperswitch requires the `mock-superposition` service to pass boot validation
- Check logs: `docker compose logs hyperswitch`
- See [Superposition Setup](#superposition-setup) below

**Dashboard won't connect:**
- Verify Hyperswitch is running: `curl http://localhost:8081/health`
- Check API key in `.env`
- See README.md for full port mappings

**Port conflicts:**
- Ensure no other services are using ports 3000, 8080-8084

### Superposition Setup

Hyperswitch requires a Superposition configuration service. For local development, we use a mock server:

```bash
# The mock-superposition service starts automatically with docker compose up
# It listens on port 9999 and returns valid config responses

# To verify it's running:
curl http://localhost:9999/
```

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing! 🎉
