import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AcceptingPaymentsPage() {
  return (
    <div>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      <h1 className="text-4xl font-bold text-text-primary mb-4">
        Accepting Payments
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        A step-by-step guide to accepting card payments with OpenPay — from
        connecting a processor to capturing funds.
      </p>

      {/* Step 1: Connect a Processor */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 1: Connect a Payment Processor
        </h2>
        <p className="text-text-secondary mb-4">
          Before accepting payments, connect at least one payment processor
          (connector) like Paystack.
        </p>
        <ol className="space-y-3 text-text-secondary">
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">1</span>
            <div>
              <p className="font-medium text-text-primary">Open the Hyperswitch Dashboard</p>
              <p className="text-sm mt-1">Navigate to <code className="bg-bg-alt px-1 rounded text-xs font-mono">localhost:8081</code> in your browser.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">2</span>
            <div>
              <p className="font-medium text-text-primary">Go to Settings → Connectors</p>
              <p className="text-sm mt-1">Click <strong>+ Add Connector</strong> and select your processor.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">3</span>
            <div>
              <p className="font-medium text-text-primary">Enter API credentials</p>
              <p className="text-sm mt-1">Paste your secret key from the processor dashboard.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">4</span>
            <div>
              <p className="font-medium text-text-primary">Enable the connector</p>
              <p className="text-sm mt-1">Toggle it on and save. Test the connection with the built-in test button.</p>
            </div>
          </li>
        </ol>
      </section>

      {/* Step 2: Choose Integration */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 2: Choose Your Integration Method
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Hosted Checkout",
              description: "Redirect or iframe a payment page hosted by Hyperswitch. Simplest integration — customers enter card details on a secure page.",
              recommended: true,
            },
            {
              title: "API Only",
              description: "Build your own checkout UI. Collect card details on your frontend and send them to Hyperswitch via API. Full control over the UI.",
              recommended: false,
            },
            {
              title: "Dashboard",
              description: "Create payments manually from the merchant dashboard. Best for phone orders, invoicing, or one-time payments.",
              recommended: false,
            },
          ].map((method) => (
            <div
              key={method.title}
              className={`p-5 rounded-xl border ${
                method.recommended
                  ? "border-secondary/40 bg-secondary/5"
                  : "border-border"
              }`}
            >
              {method.recommended && (
                <span className="inline-block px-2 py-0.5 rounded bg-secondary/10 text-secondary text-xs font-medium mb-2">
                  Recommended
                </span>
              )}
              <h3 className="font-semibold text-text-primary">{method.title}</h3>
              <p className="text-sm text-text-secondary mt-2">{method.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Step 3: API Integration */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 3: Create a Payment (API)
        </h2>
        <p className="text-text-secondary mb-4">
          Create a payment intent on your backend server:
        </p>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto mb-4">
          <pre>{`// Node.js / Express example
const response = await fetch("http://localhost:8081/payments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "api-key": "YOUR_HYPERSWITCH_API_KEY",
  },
  body: JSON.stringify({
    amount: 5000,       // Amount in smallest currency unit (kobo for NGN)
    currency: "NGN",
    confirm: true,      // Process immediately
    description: "Order #42",
    email: "customer@example.com",
  }),
});

const payment = await response.json();
console.log(payment.payment_id);  // pay_xyz789
console.log(payment.status);       // Succeeded`}</pre>
        </div>
        <p className="text-text-secondary text-sm">
          For a full code walkthrough, see the{" "}
          <Link href="/docs/first-payment" className="text-secondary hover:underline">
            First Payment
          </Link>{" "}
          guide.
        </p>
      </section>

      {/* Step 4: Handle Webhooks */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 4: Handle Webhooks
        </h2>
        <p className="text-text-secondary mb-4">
          Webhooks notify your application about payment status changes. Even
          if you use <code className="bg-bg-alt px-1 rounded text-xs font-mono">confirm: true</code>, always verify
          payment status via webhook to prevent race conditions.
        </p>
        <div className="rounded-xl bg-[#0d1117] p-6 font-mono text-sm text-white/80 overflow-x-auto mb-4">
          <pre>{`// Webhook endpoint example (Node.js / Express)
app.post("/webhooks/openpay", async (req, res) => {
  const event = req.body;

  switch (event.event_type) {
    case "payments.payment_intent.succeeded":
      // Fulfill the order
      await fulfillOrder(event.data);
      break;

    case "payments.payment_intent.failed":
      // Notify the customer, update order status
      await notifyCustomer(event.data);
      break;
  }

  res.status(200).json({ received: true });
});`}</pre>
        </div>
        <Link
          href="/docs/guides/webhooks"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline mt-4"
        >
          Full Webhook Guide →
        </Link>
      </section>

      {/* Step 5: Test in Sandbox */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 5: Test in Sandbox
        </h2>
        <p className="text-text-secondary mb-4">
          Use Paystack test cards to verify your integration end-to-end
          before going live:
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Card Number</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Result</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Use Case</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["4084 0840 8408 4081", "Success", "Happy path"],
                ["4084 0840 8408 4040", "Insufficient funds", "Failure handling"],
                ["5060 6666 6666 6666", "Success (Verve)", "Local card support"],
              ].map(([card, result, useCase]) => (
                <tr key={card} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-text-primary">{card}</td>
                  <td className="px-4 py-3 text-text-secondary">{result}</td>
                  <td className="px-4 py-3 text-text-secondary">{useCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Step 6: Go Live */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Step 6: Go Live
        </h2>
        <div className="p-6 rounded-xl border border-border bg-bg-alt">
          <h3 className="font-semibold text-text-primary mb-3">Production Checklist</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Switch connector credentials to live API keys
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Set up webhook endpoint with HTTPS in production
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Configure webhook signing secret for signature verification
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Enable rate limiting on public-facing endpoints
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Set up monitoring and alerting
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-emerald-500 mt-0.5">✓</span>
              Review fraud detection rules for your risk tolerance
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
