import { CreditCard, Repeat, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Payment Processing",
    description:
      "Accept card payments, bank transfers, USSD, and mobile money across African markets via Paystack.",
  },
  {
    icon: Repeat,
    title: "Subscription Billing",
    description:
      "Recurring payments, plan management, invoicing, and dunning — powered by Kill Bill.",
  },
  {
    icon: Shield,
    title: "Fraud Detection",
    description:
      "Real-time rule evaluation, risk scoring, and case management to catch suspicious transactions.",
  },
  {
    icon: Zap,
    title: "Event-Driven",
    description:
      "Every payment event flows through NATS JetStream. Build reactive workflows without polling.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Everything you need to move money
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A complete financial stack. Payments, subscriptions, fraud
            detection, and event processing — all in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 rounded-xl border border-border bg-white hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary-light flex items-center justify-center mb-5 group-hover:bg-secondary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
