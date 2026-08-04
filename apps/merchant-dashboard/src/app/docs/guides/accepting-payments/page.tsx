import Link from "next/link";
import { ArrowLeft, CreditCard, Code2, Webhook, TestTube, Rocket } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function AcceptingPaymentsPage() {
  return (
    <div>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[3px] bg-[#3898EC]/10 border border-[#3898EC]/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#3898EC]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Accepting Payments
          </h1>
        </div>
        <p className="text-lg text-gray-500 mb-10">
          A step-by-step guide to accepting card payments with OpenPay — from
          connecting a processor to capturing funds.
        </p>
      </div>

      {/* Step 1: Connect a Processor */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[3px] bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">1</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Connect a Payment Processor
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Before accepting payments, connect at least one payment processor
          (connector) like Paystack.
        </p>
        <div className="p-5 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <ol className="space-y-4">
            {[
              {
                step: 1,
                title: "Open the Hyperswitch Dashboard",
                description: (
                  <>
                    Navigate to <code className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs font-mono">localhost:8081</code> in your browser.
                  </>
                ),
              },
              {
                step: 2,
                title: "Go to Settings → Connectors",
                description: (
                  <>
                    Click <strong className="font-semibold text-gray-900">+ Add Connector</strong> and select your processor.
                  </>
                ),
              },
              {
                step: 3,
                title: "Enter API credentials",
                description: "Paste your secret key from the processor dashboard.",
              },
              {
                step: 4,
                title: "Enable the connector",
                description: "Toggle it on and save. Test the connection with the built-in test button.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#635bff] to-[#3898EC] text-white text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Step 2: Choose Integration */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[3px] bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">2</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Choose Your Integration Method
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Hosted Checkout",
              description: "Redirect or iframe a payment page hosted by Hyperswitch. Simplest integration — customers enter card details on a secure page.",
              recommended: true,
              icon: "🌐",
            },
            {
              title: "API Only",
              description: "Build your own checkout UI. Collect card details on your frontend and send them to Hyperswitch via API. Full control over the UI.",
              recommended: false,
              icon: "⚡",
            },
            {
              title: "Dashboard",
              description: "Create payments manually from the merchant dashboard. Best for phone orders, invoicing, or one-time payments.",
              recommended: false,
              icon: "📊",
            },
          ].map((method) => (
            <div
              key={method.title}
              className={`p-5 rounded-[8px] border ${
                method.recommended
                  ? "border-[#3898EC]/30 bg-[#3898EC]/5"
                  : "border-gray-200 bg-white"
              } shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}
            >
              {method.recommended && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#3898EC]/10 text-[#3898EC] text-xs font-medium mb-2">
                  Recommended
                </span>
              )}
              <div className="text-2xl mb-2">{method.icon}</div>
              <h3 className="font-semibold text-gray-900">{method.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{method.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Step 3: API Integration */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[3px] bg-gray-100 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Create a Payment (API)
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Create a payment intent on your backend server:
        </p>
        <CodeBlock title="Node.js / Express">{`// Node.js / Express example
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
console.log(payment.status);       // Succeeded`}</CodeBlock>
        <p className="text-gray-600 text-sm mt-4">
          For a full code walkthrough, see the{" "}
          <Link href="/docs/first-payment" className="text-[#3898EC] hover:underline">
            First Payment
          </Link>{" "}
          guide.
        </p>
      </section>

      {/* Step 4: Handle Webhooks */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[3px] bg-gray-100 flex items-center justify-center">
            <Webhook className="w-4 h-4 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Handle Webhooks
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Webhooks notify your application about payment status changes. Even
          if you use <code className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-xs font-mono">confirm: true</code>, always verify
          payment status via webhook to prevent race conditions.
        </p>
        <CodeBlock title="Webhook Endpoint">{`// Webhook endpoint example (Node.js / Express)
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
});`}</CodeBlock>
        <Link
          href="/docs/guides/webhooks"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#3898EC] hover:underline mt-4"
        >
          Full Webhook Guide →
        </Link>
      </section>

      {/* Step 5: Test in Sandbox */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[3px] bg-gray-100 flex items-center justify-center">
            <TestTube className="w-4 h-4 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Test in Sandbox
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Use Paystack test cards to verify your integration end-to-end
          before going live:
        </p>
        <div className="rounded-[8px] border border-gray-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Card Number</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Result</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Use Case</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[
                ["4084 0840 8408 4081", "Success", "Happy path"],
                ["4084 0840 8408 4040", "Insufficient funds", "Failure handling"],
                ["5060 6666 6666 6666", "Success (Verve)", "Local card support"],
              ].map(([card, result, useCase]) => (
                <tr key={card} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-900">{card}</td>
                  <td className="px-4 py-3 text-gray-600">{result}</td>
                  <td className="px-4 py-3 text-gray-600">{useCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Step 6: Go Live */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[3px] bg-gray-100 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Go Live
          </h2>
        </div>
        <div className="p-6 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="font-semibold text-gray-900 mb-3">Production Checklist</h3>
          <ul className="space-y-2 text-sm">
            {[
              "Switch connector credentials to live API keys",
              "Set up webhook endpoint with HTTPS in production",
              "Configure webhook signing secret for signature verification",
              "Enable rate limiting on public-facing endpoints",
              "Set up monitoring and alerting",
              "Review fraud detection rules for your risk tolerance",
            ].map((item) => (
              <li key={item} className="flex gap-2 items-start text-gray-600">
                <span className="text-[#40d63b] mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
