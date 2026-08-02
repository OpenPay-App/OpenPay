import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export default function UpgradesPage() {
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
        Upgrades &amp; Rollbacks
      </h1>
      <p className="text-lg text-text-secondary mb-10">
        How releases are versioned, how to upgrade a self-hosted instance
        safely, and how to roll back if something goes wrong.
      </p>

      {/* Versioning */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          1. How Versions Work
        </h2>
        <p className="text-text-secondary mb-4">
          OpenPay follows semantic versioning. Every release is a git tag of
          the form <code className="font-mono text-xs">vMAJOR.MINOR.PATCH</code>:
        </p>
        <div className="rounded-xl border border-border overflow-x-auto mb-6">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Bump</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Example</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">When it happens</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Major", "v1.4.2 → v2.0.0", "Breaking changes: schema migrations, config/API incompatibility, different deployment layout"],
                ["Minor", "v1.4.2 → v1.5.0", "New features, additive changes (new endpoints, new services, optional config)"],
                ["Patch", "v1.4.2 → v1.4.3", "Bug fixes, security patches, no behavior/API change"],
              ].map(([bump, example, when]) => (
                <tr key={bump} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-text-primary">{bump}</td>
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{example}</code></td>
                  <td className="px-4 py-3 text-text-secondary">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-text-secondary mb-4">
          A <strong className="text-text-primary">patch</strong> is always a drop-in upgrade —
          pull and restart, no other action. A <strong className="text-text-primary">minor</strong>{" "}
          may add features behind optional config. A <strong className="text-text-primary">major</strong>{" "}
          can require migrations and manual steps, so the release notes always spell
          them out before the upgrade instructions.
        </p>
        <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
          <p className="text-sm text-text-secondary">
            <strong className="text-amber-400">Before every upgrade:</strong> check the
            release notes (see the <Link href="/changelog" className="text-secondary hover:underline">Changelog</Link>)
            for the version you&apos;re targeting. Major versions in particular may
            document manual steps the upgrade script cannot automate.
          </p>
        </div>
      </section>

      {/* What the upgrade script does */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          2. What an Upgrade Does
        </h2>
        <p className="text-text-secondary mb-6">
          The upgrade tooling is <strong className="text-text-primary">semi-automated</strong>:
          it never touches containers on its own and always keeps a way back. The flow is:
        </p>
        <ol className="space-y-3 text-text-secondary mb-6 list-none">
          {[
            ["Pre-flight", "Checks Docker, the git repo, and that the current stack is healthy."],
            ["Backup", "Snapshots PostgreSQL (logical dump) plus the postgres/redis/nats named volumes into .backups/."],
            ["Checkout", "Switches the repo to the target release tag and validates the new docker-compose.yml."],
            ["Migration guard", "Runs Hyperswitch DB migrations automatically — but only when the router image version changed."],
            ["Apply", "Pulls images and starts the stack."],
            ["Verify", "Waits for core services to report healthy."],
            ["Auto-rollback", "If anything fails after the backup point, restores the previous version and data automatically."],
          ].map(([step, desc], i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <strong className="text-text-primary">{step}</strong>
                <span className="text-text-secondary"> — {desc}</span>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-sm text-text-secondary">
          You are never left mid-upgrade: the previous version and its data snapshot
          are recorded in <code className="font-mono text-xs">.openpay-state/state</code>{" "}
          before the switch, so a rollback is always one command away.
        </p>
      </section>

      {/* Running an upgrade */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          3. Run an Upgrade
        </h2>
        <CodeBlock title="upgrade to the latest release">{`make upgrade
# or pin a specific version:
make upgrade TARGET=v1.5.0

# the scripts are also callable directly:
./scripts/upgrade.sh            # latest
./scripts/upgrade.sh v1.5.0     # pinned
./scripts/upgrade.sh --dry-run  # print the plan, change nothing`}</CodeBlock>
        <h3 className="text-lg font-semibold text-text-primary mb-3 mt-6">
          Flags
        </h3>
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-bg-alt border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Flag</th>
                <th className="text-left px-4 py-3 font-semibold text-text-primary">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["--skip-backup", "Skip the backup step. Not recommended for major/minor upgrades."],
                ["--skip-migrations", "Do not run the migration guard, even if the router image changed."],
                ["--skip-rollback", "Never auto-rollback; on failure the script stops and you roll back manually."],
                ["--dry-run", "Print the full plan (from/to, backup, migrations, rollback) and exit."],
              ].map(([flag, meaning]) => (
                <tr key={flag} className="border-b border-border last:border-0">
                  <td className="px-4 py-3"><code className="font-mono text-xs text-secondary">{flag}</code></td>
                  <td className="px-4 py-3 text-text-secondary">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Backups */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          4. Backups
        </h2>
        <p className="text-text-secondary mb-4">
          Backups live in <code className="font-mono text-xs">.backups/&lt;version&gt;-&lt;timestamp&gt;/</code>{" "}
          (override the root with <code className="font-mono text-xs">OPENPAY_BACKUP_DIR</code>).
          Each backup contains:
        </p>
        <ul className="space-y-2 text-text-secondary list-disc pl-5 mb-6">
          <li><code className="font-mono text-xs">postgres-dumpall.sql</code> — a portable logical dump of every database.</li>
          <li><code className="font-mono text-xs">postgres-data.tgz</code>, <code className="font-mono text-xs">redis-data.tgz</code>, <code className="font-mono text-xs">nats-data.tgz</code> — exact named-volume snapshots used for restore.</li>
          <li><code className="font-mono text-xs">MANIFEST.txt</code> — version, timestamp, and file listing.</li>
        </ul>
        <CodeBlock title="back up manually, anytime">{`make backup
./scripts/backup.sh --label before-v2.0.0`}</CodeBlock>
        <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 mt-4">
          <p className="text-sm text-text-secondary">
            <strong className="text-amber-400">Off-box copies:</strong> backups are plain files,
            so copy the directory somewhere outside the server before upgrading — the
            upgrade will not touch them, but a disk failure would.
          </p>
        </div>
      </section>

      {/* Rollback */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          5. Rollback
        </h2>
        <p className="text-text-secondary mb-4">
          Rollback stops the stack, checks out the previous release, restores the
          volume snapshots from the pre-upgrade backup, and starts again. Schedule
          a short maintenance window — the stack is down during the restore.
        </p>
        <CodeBlock title="restore the previous release + data">{`make rollback
./scripts/rollback.sh                     # uses the recorded state
./scripts/rollback.sh --to v1.4.2 --backup .backups/v1.4.2-20260726-140000 --yes
# flags: --to <version> --backup <dir> --yes (skip confirmation)`}</CodeBlock>
        <p className="text-sm text-text-secondary mt-4">
          If the stack is unhealthy right now (e.g. a failed upgrade left it broken),
          run the rollback first — it does not require a healthy stack, only the
          Postgres volume present.
        </p>
      </section>

      {/* Health checks */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          6. Health Checks
        </h2>
        <p className="text-text-secondary mb-4">
          The upgrade script gates on service health before and after the switch.
          Run the check standalone to diagnose a deployment:
        </p>
        <CodeBlock title="verify all core services">{`./scripts/health-check.sh          # immediate
./scripts/health-check.sh --wait   # wait up to 120s for health`}</CodeBlock>
        <p className="text-sm text-text-secondary mt-4">
          Core services (postgres, redis, nats, hyperswitch, killbill) must be healthy.
          Profile-gated services (proxy, control center, Tazama, monitoring) warn but
          never block an upgrade.
        </p>
      </section>

      {/* Next */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/docs/self-hosting/production"
          className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
        >
          <div>
            <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
              Production Deploy
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Hardening guide for live environments
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
        </Link>
        <Link
          href="/docs/self-hosting/monitoring"
          className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-md transition-all group"
        >
          <div>
            <h3 className="font-semibold text-text-primary group-hover:text-secondary transition-colors">
              Monitoring &amp; Grafana
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Dashboards, logs, and alerts
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-secondary transition-colors" />
        </Link>
      </section>
    </div>
  );
}
