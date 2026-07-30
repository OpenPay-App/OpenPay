import Link from "next/link";
import {
  ArrowLeft,
  GitFork,
  Code2,
  TestTube,
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
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to docs
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 flex items-center justify-center">
            <GitFork className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white">Contributing to OpenPay</h1>
        </div>
        <p className="text-lg text-text-secondary max-w-3xl leading-relaxed">
          OpenPay is built by the community, for the community. Whether you're
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
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-400",
          },
          {
            title: "Read the Full CONTRIBUTING.md",
            url: "https://github.com/OpenPay-App/openpay/blob/main/CONTRIBUTING.md",
            description: "Complete guidelines including commit messages, PR process, and code style",
            icon: BookOpen,
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-400",
          },
          {
            title: "GitHub Discussions",
            url: "https://github.com/OpenPay-App/openpay/discussions",
            description: "Ask questions, share ideas, get help from the community",
            icon: MessageCircle,
            iconBg: "bg-green-500/10",
            iconColor: "text-green-400",
          },
          {
            title: "Browse Issues",
            url: "https://github.com/OpenPay-App/openpay/issues",
            description: "Find something to work on — look for 'good first issue' labels",
            icon: GitPullRequest,
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-400",
          },
        ].map((link) => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-purple-500/20 hover:shadow-lg transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg ${link.iconBg} flex items-center justify-center shrink-0`}>
              <link.icon className={`w-5 h-5 ${link.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors text-sm flex items-center gap-2">
                {link.title}
                <ExternalLink className="w-3 h-3 text-text-muted group-hover:text-purple-300 transition-colors" />
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">{link.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* How to Contribute */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Code2 className="w-6 h-6 text-secondary" />
          How to Contribute
        </h2>

        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Find or Create an Issue",
              description:
                "Start by browsing existing issues on GitHub. Look for labels like <code className='font-mono text-xs'>good first issue</code> or <code className='font-mono text-xs'>help wanted</code>. If you're adding something new, create an issue first to discuss the approach with maintainers.",
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
                "Create a feature branch with a descriptive name. Use the format <code className='font-mono text-xs'>feat/your-feature-name</code>, <code className='font-mono text-xs'>fix/your-bug-fix</code>, or <code className='font-mono text-xs'>docs/your-doc-change</code>.",
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
                "Run the existing test suite. For dashboard changes: <code className='font-mono text-xs'>cd apps/merchant-dashboard && pnpm lint && pnpm build</code>. For infrastructure changes, verify with <code className='font-mono text-xs'>make up && make test-flow</code>.",
            },
            {
              step: 6,
              title: "Submit a Pull Request",
              description:
                "Push your branch and open a PR against the <code className='font-mono text-xs'>main</code> branch. Fill out the PR template with a clear description of what you changed and why. Reference the issue number if applicable.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-5 rounded-xl border border-border bg-[#0a0a0a] hover:border-white/10 transition-colors"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-secondary text-white text-sm font-bold flex items-center justify-center">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p
                  className="text-sm text-text-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
                {(item as any).action && (
                  <Link
                    href={(item as any).url}
                    target={(item as any).internal ? undefined : "_blank"}
                    rel={(item as any).internal ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 mt-2 transition-colors"
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
        <h2 className="text-2xl font-bold text-white mb-6">Code Style Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "TypeScript",
              items: [
                "Use strict TypeScript — avoid <code className='font-mono text-xs'>any</code> types",
                "Use named exports over default exports",
                "Prefer <code className='font-mono text-xs'>const</code> over <code className='font-mono text-xs'>let</code>; never use <code className='font-mono text-xs'>var</code>",
                "Use optional chaining (<code className='font-mono text-xs'>?.</code>) and nullish coalescing (<code className='font-mono text-xs'>??</code>)",
                "Format with Prettier (default config)",
              ],
            },
            {
              title: "React / Next.js",
              items: [
                "Use <code className='font-mono text-xs'>'use client'</code> directive only when needed (interactivity)",
                "Keep server components as the default",
                "Extract reusable components to <code className='font-mono text-xs'>/components</code>",
                "Use Tailwind CSS classes; avoid inline styles",
                "Use the project's design tokens from <code className='font-mono text-xs'>globals.css</code>",
              ],
            },
            {
              title: "Commits",
              items: [
                "Follow <a href='https://www.conventionalcommits.org/' target='_blank' rel='noopener noreferrer' className='text-secondary hover:underline'>Conventional Commits</a> specification",
                "Format: <code className='font-mono text-xs'>type(scope): description</code>",
                "Types: <code className='font-mono text-xs'>feat</code>, <code className='font-mono text-xs'>fix</code>, <code className='font-mono text-xs'>docs</code>, <code className='font-mono text-xs'>refactor</code>, <code className='font-mono text-xs'>test</code>, <code className='font-mono text-xs'>chore</code>",
                "Example: <code className='font-mono text-xs'>feat(dashboard): add Stripe connector support</code>",
              ],
            },
            {
              title: "Pull Requests",
              items: [
                "One PR per issue — keep focused and small",
                "Fill out the PR template completely",
                "PRs require at least 1 approval before merging",
                "Address all review comments",
                "Squash and merge into <code className='font-mono text-xs'>main</code>",
              ],
            },
          ].map((section) => (
            <div
              key={section.title}
              className="p-5 rounded-xl border border-border bg-[#0a0a0a]"
            >
              <h3 className="font-semibold text-white mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-text-secondary flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 mt-1.5 shrink-0" />
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
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-secondary" />
          Community Guidelines
        </h2>
        <div className="p-6 rounded-xl border border-border bg-[#0a0a0a]">
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
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* License */}
      <section className="p-6 rounded-xl border border-border bg-[#0a0a0a] text-center">
        <h2 className="text-lg font-semibold text-white mb-2">MIT License</h2>
        <p className="text-sm text-text-secondary mb-4 max-w-xl mx-auto">
          OpenPay is released under the MIT License. By contributing, you agree
          that your contributions will be licensed under the same license.
        </p>
        <a
          href="https://github.com/OpenPay-App/openpay/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          View the full license <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>
    </div>
  );
}
