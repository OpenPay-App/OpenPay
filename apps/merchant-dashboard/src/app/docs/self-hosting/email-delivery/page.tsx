import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

const providers = [
  {
    name: "Resend",
    host: "smtp.resend.com",
    port: "587",
    username: "your Resend API key",
    password: "your Resend API key",
    link: "https://resend.com/docs",
  },
  {
    name: "Amazon SES",
    host: "email-smtp.<region>.amazonaws.com",
    port: "587",
    username: "SES SMTP username",
    password: "SES SMTP password",
    link: "https://docs.aws.amazon.com/ses/latest/dg/",
  },
  {
    name: "Postmark",
    host: "smtp.postmarkapp.com",
    port: "587",
    username: "Postmark SMTP token",
    password: "any value",
    link: "https://postmarkapp.com/developer",
  },
  {
    name: "Brevo",
    host: "smtp-relay.brevo.com",
    port: "587",
    username: "Brevo SMTP login",
    password: "Brevo SMTP key",
    link: "https://developers.brevo.com/",
  },
  {
    name: "SendGrid",
    host: "smtp.sendgrid.net",
    port: "587",
    username: "apikey",
    password: "SendGrid API key",
    link: "https://docs.sendgrid.com/",
  },
  {
    name: "Mailchimp (Mandrill)",
    host: "smtp.mandrillapp.com",
    port: "587",
    username: "your Mandrill SMTP username",
    password: "your Mandrill API key",
    link: "https://mailchimp.com/developer/transactional/guides/send-with-smtp/",
  },
  {
    name: "Mailgun",
    host: "smtp.mailgun.org",
    port: "587",
    username: "postmaster@yourdomain.com",
    password: "Mailgun SMTP password",
    link: "https://documentation.mailgun.com/docs/mailgun/user-manual/sending-messages/send-smtp",
  },
];

export default function EmailDeliveryPage() {
  return (
    <div>
      <Link
        href="/docs/self-hosting"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Self-Hosting
      </Link>

      <h1 className="text-4xl font-bold text-text-primary mb-4">
        Email Delivery &amp; Team Invites
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        How Hyperswitch sends auth emails (team invites, signup verification,
        magic links, password reset), how to wire any SMTP provider, and how to
        invite teammates — from zero to working in production.
      </p>

      {/* Why you need email */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          What Email Enables
        </h2>
        <p className="text-text-secondary mb-4">
          Without an email provider, the Control Center still works — but team
          onboarding is manual: an admin invites a teammate and the router
          generates a password that gets <strong className="text-text-primary">downloaded
          as a file</strong> to share out of band. Configuring email switches the flow to
          fully self-service:
        </p>
        <ul className="space-y-2 text-text-secondary list-disc pl-5">
          <li><strong className="text-text-primary">Team invites</strong> — admin adds a teammate&apos;s email + role, the router emails an invite link they click to set their password.</li>
          <li><strong className="text-text-primary">Signup verification</strong> &amp; <strong className="text-text-primary">magic links</strong> — email-based login/verification.</li>
          <li><strong className="text-text-primary">Password reset</strong> — users reset their own passwords.</li>
        </ul>
      </section>

      {/* Provider matrix */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Pick Any SMTP Provider
        </h2>
        <p className="text-text-secondary mb-4">
          Hyperswitch only needs standard SMTP credentials — so{" "}
          <strong className="text-text-primary">any</strong> provider works. Same config shape, different values:
        </p>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Provider</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">SMTP host</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Port</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">username</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">password</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    <a href={p.link} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
                      {p.name} ↗
                    </a>
                  </td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{p.host}</code></td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{p.port}</code></td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{p.username}</td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{p.password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-text-muted mt-3">
          Every provider requires verifying a domain you own (DNS records: SPF, DKIM,
          optionally DMARC) before it will send. This is done in the provider&apos;s
          dashboard — the sender address you configure below must sit on that verified domain.
        </p>
      </section>

      {/* Config */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Configure It in One Place
        </h2>
        <p className="text-text-secondary mb-4">
          Edit the <strong className="text-text-primary">root <code className="font-mono text-xs">.env</code></strong> — the
          Docker Compose file already maps these into the Hyperswitch router. For local
          development, start the bundled MailHog (catches every email in a web UI at{" "}
          <code className="font-mono text-xs">http://localhost:8025</code>):
        </p>
        <CodeBlock title="root .env — email section">{`# Dev (MailHog): catches emails locally, no provider needed
EMAIL_ACTIVE_CLIENT=SMTP
EMAIL_SENDER_EMAIL=no-reply@yourdomain.com
EMAIL_SMTP_HOST=mailhog
EMAIL_SMTP_PORT=1025
EMAIL_SMTP_CONNECTION=plaintext
EMAIL_SMTP_TIMEOUT=10
# MailHog accepts ANY credentials, but they must NOT be empty
# (an empty username/password crashes the router at startup)
EMAIL_SMTP_USERNAME=mailhog
EMAIL_SMTP_PASSWORD=mailhog

# PRODUCTION (Resend example) — uncomment & fill:
# EMAIL_SMTP_HOST=smtp.resend.com
# EMAIL_SMTP_PORT=587
# EMAIL_SMTP_CONNECTION=start_tls
# EMAIL_SMTP_USERNAME=re_xxxxxxxxxxxxxxxxxx
# EMAIL_SMTP_PASSWORD=re_xxxxxxxxxxxxxxxxxx

# Public URLs (MUST be public in production, not localhost)
HYPERSWITCH_DASHBOARD_URL=https://dashboard.yourdomain.com
HYPERSWITCH_PUBLIC_API_URL=https://api.yourdomain.com

# Turn on email-based team invites in the Control Center UI
HYPER_EMAIL_ENABLED=true`}</CodeBlock>
        <p className="mt-3 text-sm text-text-muted">
          <strong className="text-text-primary">Case-sensitive:</strong>{" "}
          <code className="font-mono text-xs">EMAIL_SMTP_CONNECTION</code> must be the literal{" "}
          <code className="font-mono text-xs">plaintext</code> (dev/MailHog) or{" "}
          <code className="font-mono text-xs">start_tls</code> (production) — not "starttls".
        </p>
        <p className="mt-3 text-sm text-text-muted">
          <strong className="text-text-primary">Required:</strong>{" "}
          <code className="font-mono text-xs">EMAIL_SMTP_USERNAME</code> and{" "}
          <code className="font-mono text-xs">EMAIL_SMTP_PASSWORD</code> must be{" "}
          <strong className="text-text-primary">non-empty</strong>. Even MailHog (which ignores
          credentials) will crash the router if they are blank — use any placeholder
          value like <code className="font-mono text-xs">mailhog</code> / <code className="font-mono text-xs">mailhog</code>.
        </p>
        <div className="mt-4 p-4 rounded-xl border border-secondary/30 bg-secondary/5">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">⚠️ The &ldquo;Invalid Link or session expired&rdquo; gotchas:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm text-text-secondary list-disc pl-5">
            <li>
              <strong className="text-text-primary">Empty database.</strong> The email-enabled router image
              needs ~493 tables. If you never ran{" "}
              <code className="font-mono text-xs">make migrate-db</code>, the DB has zero tables and
              every login/signup fails with this exact error. Run the migration once and it stays fixed.
            </li>
            <li>
              <strong className="text-text-primary">Wrong image.</strong> The{" "}
              <code className="font-mono text-xs">juspaydotin/hyperswitch-router:standalone</code> image has the
              email feature compiled <em>out</em> (email routes 404; no email is ever sent). Use the full
              build, e.g. <code className="font-mono text-xs">juspaydotin/hyperswitch-router:v1.125.0</code>.
            </li>
            <li>
              <strong className="text-text-primary">Localhost link.</strong> If{" "}
              <code className="font-mono text-xs">HYPERSWITCH_DASHBOARD_URL</code> is left as
              <code className="font-mono text-xs"> localhost</code>, every email link points at
              <code className="font-mono text-xs"> localhost</code> — unreachable from any inbox. Set it to
              the public URL in production.
            </li>
          </ul>
        </div>
      </section>

      {/* Apply */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Apply the Change
        </h2>
        <CodeBlock title="terminal">{`# 1. Start the database first (the migration script needs core-postgres up):
docker compose up -d postgres

# 2. First run only: apply the Hyperswitch DB migrations.
# The email-enabled router image needs ~493 tables (users, merchant_account, ...).
# Without them every login fails with "Invalid Link or session expired".
./scripts/migrate-hyperswitch-db.sh   # or: make migrate-db (if make is installed)

# 3. Dev: start MailHog + the full stack
docker compose --profile core --profile dev up -d

# Production: no MailHog — just restart the router & control center
docker compose up -d --force-recreate hyperswitch hyperswitch-control-center

# See MailHog's caught emails at http://localhost:8025`}</CodeBlock>
      </section>

      {/* Invite flow */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          How to Invite a Teammate
        </h2>
        <ol className="space-y-3 text-text-secondary list-decimal pl-5">
          <li>
            Open the Control Center at{" "}
            <a href="http://localhost:9000" className="text-secondary hover:underline">http://localhost:9000</a>{" "}
            and sign in as the org admin (the first account created).
          </li>
          <li>
            Go to <strong className="text-text-primary">Settings → Team → Invite New Users</strong>.
          </li>
          <li>
            Enter the teammate&apos;s <strong className="text-text-primary">email</strong> and assign a{" "}
            <strong className="text-text-primary">role</strong> (Organization Admin, Merchant Developer,
            View-Only, or a custom role).
          </li>
          <li>
            Submit. With email configured, the teammate receives an invite email with a link.
            They click it, set a password, and are in.
          </li>
          <li>
            Without email configured, the router instead lets you{" "}
            <strong className="text-text-primary">download the credentials file</strong> (email + generated
            password) to share manually — same outcome, less self-service.
          </li>
        </ol>
      </section>

      {/* Auth methods */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Team Login Options
        </h2>
        <ul className="space-y-2 text-text-secondary list-disc pl-5">
          <li><strong className="text-text-primary">Password</strong> — email + password (set during invite acceptance).</li>
          <li><strong className="text-text-primary">Magic Link</strong> — email a one-time login link (requires email config).</li>
          <li><strong className="text-text-primary">SSO / OIDC</strong> — Google/GitHub/Okta via the router&apos;s <code className="font-mono text-xs">[oidc]</code> config.</li>
          <li><strong className="text-text-primary">2FA (TOTP)</strong> — authenticator-app codes, optional per deployment (<code className="font-mono text-xs">force_two_factor_auth</code>).</li>
        </ul>
      </section>

      {/* Env reference */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Full Email Env Reference
        </h2>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Env var</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Maps to</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["EMAIL_ACTIVE_CLIENT", "ROUTER__EMAIL__ACTIVE_EMAIL_CLIENT", "SMTP or SES"],
                ["EMAIL_SENDER_EMAIL", "ROUTER__EMAIL__SENDER_EMAIL", "From: address (must be on the verified domain)"],
                ["EMAIL_SMTP_HOST", "ROUTER__EMAIL__SMTP__HOST", "Provider SMTP host"],
                ["EMAIL_SMTP_PORT", "ROUTER__EMAIL__SMTP__PORT", "Usually 587 (start_tls) or 1025 (MailHog)"],
                ["EMAIL_SMTP_CONNECTION", "ROUTER__EMAIL__SMTP__CONNECTION", "plaintext (dev) or start_tls (production)"],
                ["EMAIL_SMTP_TIMEOUT", "ROUTER__EMAIL__SMTP__TIMEOUT", "Seconds before timeout (default 10)"],
                ["EMAIL_SMTP_USERNAME", "ROUTER__EMAIL__SMTP__USERNAME", "Provider SMTP username/API key"],
                ["EMAIL_SMTP_PASSWORD", "ROUTER__EMAIL__SMTP__PASSWORD", "Provider SMTP password/API key"],
                ["HYPERSWITCH_DASHBOARD_URL", "ROUTER__USER__BASE_URL", "Public dashboard URL baked into email links"],
                ["HYPERSWITCH_PUBLIC_API_URL", "default__config__api_url / sdk_url (Control Center)", "Public router URL the Control Center calls from the browser"],
                ["HYPER_EMAIL_ENABLED", "default__features__email (Control Center)", "true = email-based invites in the UI"],
              ].map(([env, mapped, purpose]) => (
                <tr key={env} className="border-b border-border last:border-0">
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{env}</code></td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-text-muted">{mapped}</code></td>
                  <td className="px-4 py-3 text-text-secondary">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Link
        href="/docs/self-hosting/tools"
        className="inline-flex items-center gap-2 text-sm text-secondary hover:underline"
      >
        Next: Third-Party Tools →
      </Link>
    </div>
  );
}
