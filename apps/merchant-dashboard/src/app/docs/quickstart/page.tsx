import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function QuickstartPage() {
  return (
    <div>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      <h1 className="text-4xl font-bold text-text-primary mb-4">Quickstart</h1>
      <p className="text-lg text-text-secondary mb-10">
        Get OpenPay running on your machine in under 10 minutes. This guide
        walks you through cloning, configuring, and starting the entire
        platform.
      </p>

      {/* Prerequisites */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Prerequisites
        </h2>
        <div className="rounded-xl border border-border p-6 bg-bg-alt">
          <ul className="space-y-3">
            {[
              {
                text: "Docker & Docker Compose",
                detail: "Install from docker.com. We recommend Docker Desktop for Mac/Windows or Docker Engine for Linux.",
              },
              {
                text: "Git",
                detail: "To clone the repository.",
              },
              {
                text: "A Paystack account",
                detail: "Sign up at dashboard.paystack.co. You need a Secret Key and Public Key from the test environment.",
              },
              {
                text: "4GB+ RAM available",
                detail: "The platform runs 10+ containers. Docker Desktop default of 2GB may not be enough.",
              },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-text-primary">
                    {item.text}
                  </span>
                  <p className="text-sm text-text-secondary">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Step 1 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 1: Clone the Repository
        </h2>
        <p className="text-text-secondary mb-4">
          Open your terminal and clone the OpenPay repository:
        </p>
        <CodeBlock title="terminal">{`git clone https://github.com/OpenPay-App/openpay.git
cd OpenPay`}</CodeBlock>
      </section>

      {/* Step 2 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 2: Configure Environment Variables
        </h2>
        <p className="text-text-secondary mb-4">
          Each service has its own environment file. Copy the example files and
          fill in your values:
        </p>
        <CodeBlock title="copy .env files">{`# Copy the master environment file
cp .env.example .env

# Copy environment files for each service
cp event-bus/.env.example event-bus/.env
cp payment-system/hyperswitch/.env.example payment-system/hyperswitch/.env
cp payment-system/killbill/.env.example payment-system/killbill/.env
cp payment-system/nats-kb-bridge/.env.example payment-system/nats-kb-bridge/.env
cp monitoring-and-rules/.env.example monitoring-and-rules/.env`}</CodeBlock>
        <p className="text-text-secondary mb-4">
          Now edit the main <code className="bg-bg-alt px-1.5 py-0.5 rounded text-sm font-mono">.env</code> file and add your Paystack keys:
        </p>
        <CodeBlock title=".env">{`# .env (main file)
POSTGRES_PASSWORD=your-secure-password-here
REDIS_PASSWORD=your-secure-password-here

# Paystack keys from dashboard.paystack.co
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=your-webhook-secret`}</CodeBlock>
        <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm">
          <p className="text-amber-800 font-medium">Important</p>
          <p className="text-amber-700 mt-1">
            Never commit your <code className="font-mono">.env</code> files to
            version control. They are already included in{" "}
            <code className="font-mono">.gitignore</code>.
          </p>
        </div>
      </section>

      {/* Step 3 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 3: Start the Platform
        </h2>
        <p className="text-text-secondary mb-4">
          Start all services with Docker Compose:
        </p>
        <CodeBlock title="start services">{`# Using Make (recommended)
make up

# Or using Docker Compose directly
docker compose up -d`}</CodeBlock>
        <p className="text-text-secondary mb-4 mt-4">
          This starts all 10 services. It may take a few minutes on first run
          as Docker pulls the images. Watch the logs:
        </p>
        <CodeBlock title="view logs">{`# Watch all logs
make logs

# Or watch a specific service
docker compose logs -f hyperswitch`}</CodeBlock>
      </section>

      {/* Step 4 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 4: Initialize Event Streams
        </h2>
        <p className="text-text-secondary mb-4">
          NATS JetStream needs its streams initialized. Run the setup script:
        </p>
        <CodeBlock title="terminal">{`./event-bus/nats/scripts/init-streams.sh`}</CodeBlock>
      </section>

      {/* Step 5 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 5: Set Up the Dashboard
        </h2>
        <p className="text-text-secondary mb-4">
          The merchant dashboard is a Next.js app. Open a new terminal:
        </p>
        <CodeBlock title="dashboard setup">{`cd apps/merchant-dashboard

# Install dependencies
npm install

# Copy Kinde environment file
cp .env.local.example .env.local

# Edit .env.local with your Kinde credentials
# (See the Authentication guide for details)

# Start the dev server
npm run dev`}</CodeBlock>
      </section>

      {/* Step 6 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 6: Verify Everything Works
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Service
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  URL
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  What to Expect
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Merchant Dashboard", "http://localhost:3000", "Landing page with OpenPay branding"],
                ["Hyperswitch API", "http://localhost:8081/health", '{"status":"ok"}'],
                ["Kill Bill API", "http://localhost:8082/1.0/healthcheck", "Health check response"],
                ["NATS Monitoring", "http://localhost:8222", "NATS monitoring dashboard"],
                ["Traefik Dashboard", "http://localhost:8080", "Traefik router overview"],
              ].map(([service, url, expected]) => (
                <tr key={service} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {service}
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-secondary bg-secondary-light px-2 py-0.5 rounded">
                      {url}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{expected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Next */}
      <section className="p-6 rounded-xl border border-border bg-bg-alt">
        <h3 className="font-semibold text-text-primary mb-2">What&apos;s Next?</h3>
        <p className="text-sm text-text-secondary mb-4">
          Your OpenPay platform is running. Now let&apos;s process a payment.
        </p>
        <Link
          href="/docs/first-payment"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
        >
          Accept Your First Payment →
        </Link>
      </section>
    </div>
  );
}
