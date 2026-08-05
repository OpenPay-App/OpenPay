import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Shield, FileText, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

const processorKYC = [
  { processor: "Stripe", required: true, process: "Business verification", timeline: "1-3 days" },
  { processor: "Adyen", required: true, process: "Full underwriting", timeline: "1-2 weeks" },
  { processor: "Paystack", required: true, process: "Business verification", timeline: "1-2 days" },
  { processor: "Checkout.com", required: true, process: "Business verification", timeline: "3-5 days" },
];

const openpayDoesNot = [
  "Collect personal identification documents",
  "Store government-issued IDs",
  "Verify your identity",
  "Report to financial authorities",
];

const processorDoes = [
  "Verify business identity",
  "Check for sanctions/PEP lists",
  "Monitor transaction patterns",
  "Report suspicious activity (SARs)",
];

const merchantChecklist = [
  "Register your business legally",
  "Obtain necessary licenses",
  "Open a business bank account",
  "Complete processor KYC verification",
  "Maintain accurate records",
  "Monitor chargeback ratios",
  "Implement AML policies",
];

const developerChecklist = [
  "Implement proper authentication",
  "Log all transactions",
  "Enable webhook verification",
  "Use PCI-compliant checkout",
  "Encrypt sensitive data",
];

const industryCompliance = [
  {
    industry: "Healthcare (HIPAA)",
    requirements: [
      "Use HIPAA-compliant processors",
      "Encrypt PHI in transit and at rest",
      "Sign BAA with processor",
    ],
  },
  {
    industry: "Finance (PCI DSS)",
    requirements: [
      "Use tokenized checkout (Hyperswitch Elements)",
      "Never store card data",
      "Implement access controls",
    ],
  },
  {
    industry: "EU (GDPR)",
    requirements: [
      "Data minimization",
      "Right to erasure",
      "Consent management",
    ],
  },
];

export default function CompliancePage() {
  return (
    <div>
      <Link
        href="/docs"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[3px] bg-[#e8f0fe] border border-[#3898EC]/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#3898EC]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">KYC & Compliance Guide</h1>
        </div>
        <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
          Learn about KYC requirements and compliance considerations for OpenPay users.
          OpenPay itself does not require KYC, but your payment processor may.
        </p>
      </div>

      {/* Key Point */}
      <section className="mb-12">
        <div className="p-6 rounded-[3px] border-2 border-[#3898EC]/30 bg-[#e8f0fe]/50">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-[#3898EC] shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Important Distinction</h3>
              <p className="text-gray-600">
                <strong>OpenPay</strong> is self-hosted software that does <strong>NOT</strong> require KYC verification.
                However, your <strong>payment processor</strong> (Stripe, Paystack, Adyen, etc.) will require
                KYC depending on your business type, location, and transaction volume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Requires KYC */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Requires KYC?</h2>
        <div className="rounded-[3px] border border-[#e2e2e2] overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e2e2e2]">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Processor</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">KYC Required</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Process</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {processorKYC.map((item) => (
                <tr key={item.processor} className="border-b border-[#e2e2e2] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.processor}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-500/30">
                      Yes
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{item.process}</td>
                  <td className="px-4 py-3 text-gray-500">{item.timeline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* OpenPay vs Processor */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OpenPay Does NOT */}
          <div className="p-6 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[#ea384c]" />
              What OpenPay Does NOT Do
            </h3>
            <ul className="space-y-3">
              {openpayDoesNot.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <XCircle className="w-4 h-4 text-[#ea384c] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Processor DOES */}
          <div className="p-6 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#40d63b]" />
              What Your Processor DOES
            </h3>
            <ul className="space-y-3">
              {processorDoes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-[#40d63b] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Compliance Checklists */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance Checklists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Merchant Checklist */}
          <div className="p-6 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3898EC]" />
              For Merchants
            </h3>
            <ul className="space-y-3">
              {merchantChecklist.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Checklist */}
          <div className="p-6 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#3898EC]" />
              For Developers
            </h3>
            <ul className="space-y-3">
              {developerChecklist.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Industry-Specific Compliance */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry-Specific Compliance</h2>
        <div className="space-y-4">
          {industryCompliance.map((item) => (
            <div key={item.industry} className="p-5 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="font-semibold text-gray-900 mb-3">{item.industry}</h3>
              <ul className="space-y-2">
                {item.requirements.map((req) => (
                  <li key={req} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-[#40d63b] shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">External Resources</h2>
        <div className="space-y-3">
          {[
            { title: "PCI DSS Requirements", url: "https://www.pcisecuritystandards.org/", description: "Official PCI DSS requirements and self-assessment questionnaires" },
            { title: "GDPR Guidelines", url: "https://gdpr-info.eu/", description: "EU General Data Protection Regulation compliance guide" },
            { title: "AML Best Practices", url: "https://www.fatf-gafi.org/", description: "Financial Action Task Force anti-money laundering guidelines" },
          ].map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between p-4 rounded-[3px] border border-[#e2e2e2] hover:border-[#3898EC]/30 hover:bg-[#fafafa] transition-all group bg-white"
            >
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-[#3898EC] transition-colors text-sm">
                  {resource.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{resource.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors shrink-0 mt-1" />
            </a>
          ))}
        </div>
      </section>

      {/* Next Steps */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/docs/guides/high-risk"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              High-Risk Merchant Guide
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Support for high-risk industries
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors" />
        </Link>
        <Link
          href="/docs/guides/international"
          className="flex items-center justify-between p-5 rounded-[3px] border border-[#e2e2e2] bg-white hover:border-[#3898EC]/30 hover:shadow-md transition-all group shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors">
              International Payments Guide
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Global payment support and regional considerations
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3898EC] transition-colors" />
        </Link>
      </section>
    </div>
  );
}
