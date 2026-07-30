import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function FirstPaymentPage() {
  return (
    <div>
      <Link
        href="/docs/quickstart"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Quickstart
      </Link>

      <h1 className="text-4xl font-bold text-text-primary mb-4">
        Your First Payment
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        This guide walks you through processing a test card payment from start
        to finish using the OpenPay dashboard and Hyperswitch API.
      </p>

      {/* Step 1: Configure Paystack */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 1: Configure Your Payment Connector
        </h2>
        <p className="text-text-secondary mb-4">
          Log into the Hyperswitch dashboard at{" "}
          <code className="bg-bg-alt px-1.5 py-0.5 rounded text-sm font-mono">
            localhost:8081
          </code>{" "}
          and add a payment connector.
        </p>
        <ol className="space-y-4 text-text-secondary">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <div>
              <p className="font-medium text-text-primary">
                Navigate to Connectors
              </p>
              <p className="text-sm mt-1">
                Go to <strong>Settings → Connectors</strong> and click{" "}
                <strong>+ Add Connector</strong>.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <div>
              <p className="font-medium text-text-primary">
                Select Paystack
              </p>
              <p className="text-sm mt-1">
                Choose <strong>Paystack</strong> from the list of available
                connectors.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <div>
              <p className="font-medium text-text-primary">
                Enter API Credentials
              </p>
              <p className="text-sm mt-1">
                Paste your Paystack <strong>Secret Key</strong> (from{" "}
                <code className="bg-bg-alt px-1 rounded text-xs">
                  dashboard.paystack.co → Settings → API Keys
                </code>
                ).
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <div>
              <p className="font-medium text-text-primary">
                Enable the Connector
              </p>
              <p className="text-sm mt-1">
                Toggle the connector to <strong>Enabled</strong> and click{" "}
                <strong>Save</strong>.
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* Step 2: Create a Payment */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 2: Create a Test Payment
        </h2>
        <p className="text-text-secondary mb-4">
          You can create a payment via the dashboard or the API.
        </p>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Option A: Via the Dashboard
        </h3>
        <ol className="space-y-3 text-text-secondary mb-8">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <p>
              Go to <strong>Payments → Create Payment</strong> in the sidebar.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <p>
              Enter an amount (e.g., <strong>1000 NGN</strong>) and select the
              currency.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <p>
              Click <strong>Generate Payment Link</strong> or click{" "}
              <strong>Confirm Payment</strong> to process immediately.
            </p>
          </li>
        </ol>

        <h3 className="text-lg font-semibold text-text-primary mb-3">
          Option B: Via the API
        </h3>
        <p className="text-text-secondary mb-4">
          Send a POST request to create a payment intent:
        </p>
        <CodeBlock title="curl">{`curl -X POST http://localhost:8081/payments \\
  -H "Content-Type: application/json" \\
  -H "api-key: test_api_key_xxxx" \\
  -d '{
    "amount": 1000,
    "currency": "NGN",
    "confirm": true,
    "capture_method": "automatic",
    "description": "Test payment from docs",
    "email": "test@example.com"
  }'`}</CodeBlock>
        <p className="text-text-secondary text-sm">
          The response includes a <code className="bg-bg-alt px-1 rounded font-mono">payment_id</code> and the current status.
        </p>
      </section>

      {/* Step 3: Test Card Numbers */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 3: Test Card Numbers
        </h2>
        <p className="text-text-secondary mb-4">
          Use these test card numbers in the Paystack test environment. No real
          money is charged.
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Card Number
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  Result
                </th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">
                  When to Use
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["4084 0840 8408 4081", "Successful payment", "Standard happy path testing"],
                ["4084 0840 8408 4040", "Insufficient funds", "Test failure handling"],
                ["5060 6666 6666 6666", "Successful (Verve)", "Test Nigerian local cards"],
              ].map(([card, result, use]) => (
                <tr key={card} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-text-primary">
                    {card}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{result}</td>
                  <td className="px-4 py-3 text-text-secondary">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary text-sm mt-4">
          Use any future expiry date, any 3-digit CVC, and any name.
        </p>
      </section>

      {/* Step 4: Check the Status */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 4: Check the Payment Status
        </h2>
        <p className="text-text-secondary mb-4">
          After creating the payment, monitor it in the dashboard:
        </p>
        <ol className="space-y-3 text-text-secondary">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <p>
              Go to <strong>Payments</strong> in the sidebar. Your new payment
              appears at the top of the list.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <p>
              Click on the payment to see the full detail view — amount,
              connector response, timeline, and refund options.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <p>
              The payment status should be{" "}
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-medium">
                Succeeded
              </span>{" "}
              if the test card was successful.
            </p>
          </li>
        </ol>
      </section>

      {/* Next */}
      <section className="p-6 rounded-xl border border-border bg-bg-alt">
        <h3 className="font-semibold text-text-primary mb-2">
          Production Checklist
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Before going live with real payments, make sure you:
        </p>
        <ul className="text-sm text-text-secondary space-y-2 mb-4">
          <li>✓ Switch to Paystack live API keys</li>
          <li>✓ Set up webhook endpoints in Paystack dashboard</li>
          <li>✓ Configure webhook signing secrets</li>
          <li>✓ Set up monitoring and alerts</li>
          <li>✓ Enable rate limiting</li>
        </ul>
        <Link
          href="/docs/guides/accepting-payments"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
        >
          Full Accepting Payments Guide →
        </Link>
      </section>
    </div>
  );
}
