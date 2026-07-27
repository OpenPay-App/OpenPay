import { Github } from "lucide-react";
import Link from "next/link";

export function OpenSource() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
          Built in the open, for everyone
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-12">
          OpenPay is fully open-source. Read the code, report issues,
          contribute features — the platform belongs to the community.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="https://github.com/OpenPay-App/OpenPay"
            target="_blank"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-bg-dark text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <Github className="w-5 h-5" />
            Star on GitHub
          </Link>
          <Link
            href="https://github.com/OpenPay-App/OpenPay/discussions"
            target="_blank"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-border text-text-primary font-semibold hover:bg-bg-alt transition-colors"
          >
            Join the community
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
          <div>
            <div className="text-3xl font-bold text-secondary">100%</div>
            <div className="text-sm text-text-muted mt-1">Open source</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary">$0</div>
            <div className="text-sm text-text-muted mt-1">Platform fees</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary">5 min</div>
            <div className="text-sm text-text-muted mt-1">Time to run</div>
          </div>
        </div>
      </div>
    </section>
  );
}
