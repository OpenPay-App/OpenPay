import Link from "next/link";
import {
  ArrowLeft,
  GitFork,
  Code2,
  GitPullRequest,
  MessageCircle,
  BookOpen,
  Users,
  ExternalLink,
  CheckCircle,
  Star,
} from "lucide-react";

export default function ContributingPage() {
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
          <div className="w-10 h-10 rounded-[3px] bg-[#635bff]/10 border border-[#635bff]/20 flex items-center justify-center">
            <GitFork className="w-5 h-5 text-[#635bff]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Contributing to OpenPay</h1>
        </div>
        <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
          OpenPay is built by the community, for the community. Whether you&apos;re
          fixing a bug, adding a feature, improving documentation, or just
          asking a question — every contribution matters.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {[
          {
            title: "View on GitHub",
            url: "https://github.com/OpenPay-App/openpay",
            description: "Star the repo, browse the code, fork your own copy",
            icon: Star,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
          },
          {
            title: "Read the Full CONTRIBUTING.md",
            url: "https://github.com/OpenPay-App/openpay/blob/main/CONTRIBUTING.md",
            description: "Complete guidelines including commit messages, PR process, and code style",
            icon: BookOpen,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
          },
          {
            title: "GitHub Discussions",
            url: "https://github.com/OpenPay-App/openpay/discussions",
            description: "Ask questions, share ideas, get help from the community",
            icon: MessageCircle,
            iconBg: "bg-green-50",
            iconColor: "text-green-500",
          },
          {
            title: "Browse Issues",
            url: "https://github.com/OpenPay-App/openpay/issues",
            description: "Find something to work on — look for 'good first issue' labels",
            icon: GitPullRequest,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-500",
          },
        ].map((link) => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-5 rounded-[8px] border border-gray-200 bg-white hover:border-[#3898EC]/30 hover:shadow-[0_2px_8px_rgba(56,152,236,0.1)] transition-all group shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className={`w-10 h-10 rounded-[3px] ${link.iconBg} flex items-center justify-center shrink-0`}>
              <link.icon className={`w-5 h-5 ${link.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#3898EC] transition-colors text-sm flex items-center gap-2">
                {link.title}
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#3898EC] transition-colors" />
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* How to Contribute */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Code2 className="w-6 h-6 text-[#3898EC]" />
          How to Contribute
        </h2>

        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Find or Create an Issue",
              description:
                "Start by browsing existing issues on GitHub. Look for labels like <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>good first issue</code> or <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>help wanted</code>. If you're adding something new, create an issue first to discuss the approach with maintainers.",
              action: "Browse 'good first issue' label",
              url: "https://github.com/OpenPay-App/openpay/labels/good%20first%20issue",
            },
            {
              step: 2,
              title: "Fork & Clone",
              description:
                "Fork the repository to your GitHub account, then clone it locally. Set up your development environment following the Quickstart guide.",
              action: "Quickstart Guide",
              url: "/docs/quickstart",
              internal: true,
            },
            {
              step: 3,
              title: "Create a Branch",
              description:
                "Create a feature branch with a descriptive name. Use the format <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>feat/your-feature-name</code>, <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>fix/your-bug-fix</code>, or <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>docs/your-doc-change</code>.",
            },
            {
              step: 4,
              title: "Make Changes",
              description:
                "Write your code following the project's conventions. Keep changes focused on a single issue — one PR per feature or fix. Add comments for complex logic and update documentation when relevant.",
            },
            {
              step: 5,
              title: "Test Your Changes",
              description:
                "Run the existing test suite. For dashboard changes: <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>cd apps/merchant-dashboard && pnpm lint && pnpm build</code>. For infrastructure changes, verify with <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>make up && make test-flow</code>.",
            },
            {
              step: 6,
              title: "Submit a Pull Request",
              description:
                "Push your branch and open a PR against the <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>main</code> branch. Fill out the PR template with a clear description of what you changed and why. Reference the issue number if applicable.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-5 rounded-[8px] border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#635bff] to-[#3898EC] text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
                {(item as any).action && (
                  <Link
                    href={(item as any).url}
                    target={(item as any).internal ? undefined : "_blank"}
                    rel={(item as any).internal ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3898EC] hover:underline mt-2 transition-colors"
                  >
                    {(item as any).action} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Style */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Style Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "TypeScript",
              items: [
                "Use strict TypeScript — avoid <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>any</code> types",
                "Use named exports over default exports",
                "Prefer <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>const</code> over <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>let</code>; never use <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>var</code>",
                "Use optional chaining (<code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>?.</code>) and nullish coalescing (<code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>??</code>)",
                "Format with Prettier (default config)",
              ],
            },
            {
              title: "React / Next.js",
              items: [
                "Use <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>'use client'</code> directive only when needed (interactivity)",
                "Keep server components as the default",
                "Extract reusable components to <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>/components</code>",
                "Use Tailwind CSS classes; avoid inline styles",
                "Use the project's design tokens from <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>globals.css</code>",
              ],
            },
            {
              title: "Commits",
              items: [
                "Follow <a href='https://www.conventionalcommits.org/' target='_blank' rel='noopener noreferrer' className='text-[#3898EC] hover:underline'>Conventional Commits</a> specification",
                "Format: <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>type(scope): description</code>",
                "Types: <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>feat</code>, <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>fix</code>, <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>docs</code>, <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>refactor</code>, <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>test</code>, <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>chore</code>",
                "Example: <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>feat(dashboard): add Stripe connector support</code>",
              ],
            },
            {
              title: "Pull Requests",
              items: [
                "One PR per issue — keep focused and small",
                "Fill out the PR template completely",
                "PRs require at least 1 approval before merging",
                "Address all review comments",
                "Squash and merge into <code className='font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200'>main</code>",
              ],
            },
          ].map((section) => (
            <div
              key={section.title}
              className="p-5 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#635bff] mt-1.5 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-[#3898EC]" />
          Community Guidelines
        </h2>
        <div className="p-6 rounded-[8px] border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Be Respectful",
                description:
                  "Use welcoming and inclusive language. Respect different viewpoints and experiences. Accept constructive criticism gracefully.",
              },
              {
                title: "Help Others",
                description:
                  "Answer questions in GitHub Discussions. Review PRs when you can. Share your knowledge and experience with the community.",
              },
              {
                title: "Give Credit",
                description:
                  "Acknowledge the work of others. Cite sources when sharing code or ideas. Contribute back improvements to the project.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-[3px] bg-[#635bff]/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-[#635bff]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* License */}
      <section className="p-6 rounded-[8px] border border-gray-200 bg-white text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">MIT License</h2>
        <p className="text-sm text-gray-500 mb-4 max-w-xl mx-auto">
          OpenPay is released under the MIT License. By contributing, you agree
          that your contributions will be licensed under the same license.
        </p>
        <a
          href="https://github.com/OpenPay-App/openpay/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3898EC] hover:underline transition-colors"
        >
          View the full license <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>
    </div>
  );
}
