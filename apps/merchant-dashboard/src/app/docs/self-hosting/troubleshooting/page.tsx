import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  Server,
  Database,
  Network,
  Box,
  Container,
  Wrench,
  ExternalLink,
  Search,
} from "lucide-react";

const categories = [
  {
    id: "installation",
    title: "Installation & Startup",
    icon: Container,
    problems: [
      {
        symptom: "Docker containers crash on startup",
        causes: [
          "Port conflicts with existing services on your machine",
          "Insufficient Docker resources (RAM/CPU)",
          "Missing <code className='font-mono text-xs'>.env</code> files or misconfigured environment variables",
        ],
        solutions: [
          "Run <code className='font-mono text-xs'>docker compose ps</code> to check which containers are failing",
          "Check Docker Desktop resources: Settings → Resources → increase RAM to 6GB+",
          "Verify all <code className='font-mono text-xs'>.env</code> files exist: <code className='font-mono text-xs'>ls -la .env payment-system/hyperswitch/.env payment-system/killbill/.env</code>",
          "Check logs: <code className='font-mono text-xs'>docker compose logs &lt;service-name&gt;</code> for specific error messages",
          "Stop conflicting services: <code className='font-mono text-xs'>netstat -ano | findstr :PORT</code> (Windows) or <code className='font-mono text-xs'>lsof -i :PORT</code> (Mac/Linux)",
        ],
      },
      {
        symptom: "make up fails with 'command not found'",
        causes: ["Make is not installed on your system", "Windows users may not have Make available"],
        solutions: [
          "Install Make: <code className='font-mono text-xs'>winget install GnuWin32.Make</code> (Windows), <code className='font-mono text-xs'>brew install make</code> (Mac), <code className='font-mono text-xs'>sudo apt install make</code> (Linux)",
          "Or use Docker Compose directly: <code className='font-mono text-xs'>docker compose up -d</code>",
        ],
      },
      {
        symptom: "Docker Desktop out of space / 'no space left on device'",
        causes: ["Docker accumulates cached images and build cache over time", "Old containers and volumes not cleaned up"],
        solutions: [
          "Run <code className='font-mono text-xs'>docker system df</code> to see disk usage",
          "Clean up: <code className='font-mono text-xs'>docker system prune -a --volumes</code> (caution: removes all unused containers, images, and volumes)",
          "Or clean only OpenPay: <code className='font-mono text-xs'>make clean</code>",
          "Increase Docker disk image size in Docker Desktop → Settings → Resources → Advanced → Disk image size",
        ],
      },
    ],
  },
  {
    id: "hyperswitch",
    title: "Hyperswitch",
    icon: Server,
    problems: [
      {
        symptom: "Hyperswitch won't start / health check fails",
        causes: [
          "PostgreSQL or Redis not ready when Hyperswitch tries to connect",
          "Mock Superposition service is not healthy",
          "Database migrations haven't run (when running standalone)",
          "Incorrect database credentials in <code className='font-mono text-xs'>.env</code>",
        ],
        solutions: [
          "Ensure PostgreSQL and Redis are healthy first: <code className='font-mono text-xs'>docker compose ps postgres redis</code>",
          "Wait longer — Hyperswitch has a 40-second startup grace period",
          "Check mock-superposition: <code className='font-mono text-xs'>curl http://localhost:9999/</code>",
          "Verify database credentials match between root <code className='font-mono text-xs'>.env</code> and <code className='font-mono text-xs'>payment-system/hyperswitch/.env</code>",
          "Check logs: <code className='font-mono text-xs'>docker compose logs hyperswitch</code>",
        ],
      },
      {
        symptom: "API returns 401 Unauthorized",
        causes: [
          "Missing or incorrect <code className='font-mono text-xs'>api-key</code> header",
          "API key not set in Hyperswitch environment",
        ],
        solutions: [
          "Ensure <code className='font-mono text-xs'>HYPERSWITCH_API_KEY</code> is set in <code className='font-mono text-xs'>payment-system/hyperswitch/.env</code>",
          "Pass the key in requests: <code className='font-mono text-xs'>-H 'api-key: your_api_key_here'</code>",
          "Generate a new API key in the Hyperswitch Control Center at <code className='font-mono text-xs'>http://localhost:9000</code>",
        ],
      },
      {
        symptom: "Payments fail with 'connector error'",
        causes: [
          "Payment processor (connector) not configured or disabled",
          "Invalid API credentials for the connector",
          "Connector is in test mode but you're using live credentials (or vice versa)",
          "Network connectivity issues between Hyperswitch and the connector API",
        ],
        solutions: [
          "Verify connector is enabled in Hyperswitch dashboard at <code className='font-mono text-xs'>http://localhost:9000</code>",
          "Double-check connector API keys in the configuration",
          "Use test cards in test mode (see <Link href='/docs/first-payment' className='text-secondary hover:underline'>First Payment guide</Link>)",
          "Check Hyperswitch logs for the exact error from the connector: <code className='font-mono text-xs'>docker compose logs hyperswitch</code>",
          "Verify network: <code className='font-mono text-xs'>docker compose exec hyperswitch curl -I https://api.paystack.co</code>",
        ],
      },
    ],
  },
  {
    id: "database",
    title: "PostgreSQL & Database",
    icon: Database,
    problems: [
      {
        symptom: "PostgreSQL fails to start",
        causes: [
          "Data directory permissions issue",
          "Port 5432 already in use by another PostgreSQL instance",
          "Insufficient disk space",
          "Corrupted database files from improper shutdown",
        ],
        solutions: [
          "Check port conflict: <code className='font-mono text-xs'>netstat -ano | findstr :5432</code> (Windows) or <code className='font-mono text-xs'>lsof -i :5432</code> (Mac/Linux)",
          "Check disk space: <code className='font-mono text-xs'>docker system df</code>",
          "Remove volume and restart: <code className='font-mono text-xs'>docker compose down -v && docker compose up -d</code> (⚠️ deletes all data)",
          "Check logs: <code className='font-mono text-xs'>docker compose logs postgres</code>",
        ],
      },
      {
        symptom: "Services can't connect to PostgreSQL",
        causes: [
          "Wrong host — using <code className='font-mono text-xs'>localhost</code> instead of Docker service name <code className='font-mono text-xs'>postgres</code>",
          "Password mismatch between service env files",
          "PostgreSQL still starting up (not yet healthy)",
        ],
        solutions: [
          "Use Docker service name in internal configs: <code className='font-mono text-xs'>postgres</code> not <code className='font-mono text-xs'>localhost</code>",
          "Verify the password is the same in all env files that reference it",
          "Wait for PostgreSQL to be healthy: <code className='font-mono text-xs'>docker compose ps postgres</code> (look for 'healthy')",
        ],
      },
      {
        symptom: "Lost database data after restart",
        causes: ["Docker volumes were removed (docker compose down -v)", "Volume was pruned accidentally"],
        solutions: [
          "Always use <code className='font-mono text-xs'>docker compose down</code> without <code className='font-mono text-xs'>-v</code> to preserve volumes",
          "Set up periodic backups: <code className='font-mono text-xs'>docker exec core-postgres pg_dump -U coreplatform hyperswitch &gt; backup.sql</code>",
          "To restore: <code className='font-mono text-xs'>docker exec -i core-postgres psql -U coreplatform hyperswitch &lt; backup.sql</code>",
        ],
      },
    ],
  },
  {
    id: "nats",
    title: "NATS & Event Bus",
    icon: Network,
    problems: [
      {
        symptom: "NATS connection refused by consumers",
        causes: [
          "NATS server not started or unhealthy",
          "Wrong NATS URL used by consumer services",
          "Authentication credentials mismatch",
        ],
        solutions: [
          "Check NATS is running: <code className='font-mono text-xs'>docker compose ps nats</code>",
          "Verify NATS monitoring: <code className='font-mono text-xs'>curl http://localhost:8222/healthz</code>",
          "Check connection details: <code className='font-mono text-xs'>docker compose logs nats</code>",
          "Verify NATS URL in consumer env files — should be <code className='font-mono text-xs'>nats://nats:4222</code> (Docker internal)",
        ],
      },
      {
        symptom: "Event streams not initialized / missing subjects",
        causes: [
          "The <code className='font-mono text-xs'>init-streams.sh</code> script hasn't been run",
          "Streams were deleted or expired",
        ],
        solutions: [
          "Run the initialization script: <code className='font-mono text-xs'>./event-bus/nats/scripts/init-streams.sh</code>",
          "Or use Make: <code className='font-mono text-xs'>make init-streams</code>",
          "Verify streams exist: <code className='font-mono text-xs'>docker compose exec nats nats stream ls</code>",
          "Check stream details: <code className='font-mono text-xs'>docker compose exec nats nats stream info payments</code>",
        ],
      },
      {
        symptom: "Events going to Dead Letter Queue (DLQ)",
        causes: [
          "Consumer service is down or not processing events",
          "Event processing timeout exceeded (30s default)",
          "Invalid event payload format",
        ],
        solutions: [
          "Check DLQ: <code className='font-mono text-xs'>docker compose exec nats nats stream view DLQ_EVENTS</code>",
          "Investigate the original event and the error reason in the DLQ payload",
          "Check consumer logs: <code className='font-mono text-xs'>docker compose logs tazama-rule-exec</code>",
          "Restart the failing consumer: <code className='font-mono text-xs'>docker compose restart tazama-rule-exec</code>",
        ],
      },
    ],
  },
  {
    id: "dashboard",
    title: "Merchant Dashboard",
    icon: Box,
    problems: [
      {
        symptom: "Dashboard shows blank page or 404",
        causes: [
          "Next.js development server not running",
          "Wrong port — dashboard runs on <code className='font-mono text-xs'>3000</code> but Tazama uses <code className='font-mono text-xs'>3000</code>",
          "Missing dependencies — <code className='font-mono text-xs'>node_modules</code> not installed",
        ],
        solutions: [
          "Start the dashboard: <code className='font-mono text-xs'>cd apps/merchant-dashboard && npm run dev</code>",
          "Use port 3002 to avoid conflicts: <code className='font-mono text-xs'>npm run dev -- --port 3002</code>",
          "Install deps: <code className='font-mono text-xs'>cd apps/merchant-dashboard && npm install</code>",
          "Clear Next.js cache: <code className='font-mono text-xs'>rm -rf .next</code> and restart",
        ],
      },
      {
        symptom: "Auth login redirect loop",
        causes: [
          "Kinde not configured properly in <code className='font-mono text-xs'>.env.local</code>",
          "Redirect URLs don't match Kinde application settings",
          "Missing Kinde provider configuration",
        ],
        solutions: [
          "Verify Kinde env vars are set: <code className='font-mono text-xs'>cat apps/merchant-dashboard/.env.local | grep KINDE</code>",
          "Check Kinde dashboard → Application → Allowed Callback URLs includes <code className='font-mono text-xs'>http://localhost:3000/api/auth/callback</code>",
          "Ensure <code className='font-mono text-xs'>KINDE_POST_LOGIN_REDIRECT_URL</code> points to <code className='font-mono text-xs'>http://localhost:3000/dashboard</code>",
          "For local dev without Kinde, the auth provider auto-skips when env vars aren't set",
        ],
      },
      {
        symptom: "Dashboard API calls fail / CORS errors",
        causes: [
          "Hyperswitch API not running or unreachable",
          "API key not configured in dashboard env",
          "CORS not configured for dashboard origin",
        ],
        solutions: [
          "Verify Hyperswitch is running: <code className='font-mono text-xs'>curl http://localhost:8081/health</code>",
          "Check <code className='font-mono text-xs'>HYPERSWITCH_API_KEY</code> in <code className='font-mono text-xs'>apps/merchant-dashboard/.env.local</code>",
          "For CORS, ensure <code className='font-mono text-xs'>HYPERSWITCH_API_URL</code> in dashboard env points to <code className='font-mono text-xs'>http://localhost:8081</code>",
          "Check browser console for specific CORS error messages",
        ],
      },
    ],
  },
  {
    id: "network",
    title: "Network & Ports",
    icon: Wrench,
    problems: [
      {
        symptom: "Port already in use when starting services",
        causes: ["Another application is using the same port", "Previous Docker containers not fully stopped"],
        solutions: [
          "Find what's using the port: <code className='font-mono text-xs'>netstat -ano | findstr :PORT</code> (Windows) or <code className='font-mono text-xs'>lsof -i :PORT</code> (Mac/Linux)",
          "Stop the conflicting process or change the port in docker-compose.yml",
          "Ensure old containers are stopped: <code className='font-mono text-xs'>docker compose down</code>",
          "Common conflicts: port 3000 (Tazama vs Dashboard), port 8080 (Traefik), port 5432 (local PostgreSQL)",
        ],
      },
      {
        symptom: "Can't access services from browser (Windows/WSL2)",
        causes: ["Docker running in WSL2 but browser on Windows host", "Firewall blocking ports", "Docker bound to wrong interface"],
        solutions: [
          "Ensure Docker Desktop is configured to expose ports to localhost",
          "Check Docker Desktop → Settings → Resources → Network → 'Allow privileged port mapping'",
          "Try accessing via <code className='font-mono text-xs'>http://127.0.0.1:PORT</code> instead of <code className='font-mono text-xs'>localhost</code>",
          "Temporarily disable Windows Firewall to test if it's the cause",
          "Use <code className='font-mono text-xs'>docker compose logs</code> to verify services are bound to 0.0.0.0",
        ],
      },
    ],
  },
];

export default function TroubleshootingPage() {
  return (
    <div>
      <Link
        href="/docs/self-hosting"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Self-Hosting
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-[3px] bg-amber-50 border border-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Troubleshooting Guide</h1>
        </div>
        <p className="text-lg text-gray-500 max-w-3xl leading-relaxed">
          Common issues you might encounter when setting up or running OpenPay,
          with step-by-step solutions. If you don&apos;t find your issue here, check
          our{" "}
          <a
            href="https://github.com/OpenPay-App/openpay/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3898EC] hover:underline"
          >
            GitHub Discussions
          </a>{" "}
          or open an issue.
        </p>
      </div>

      {/* Category Navigation */}
      <div className="mb-12 p-4 rounded-[3px] border border-[#e2e2e2] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <Search className="w-4 h-4" />
          Jump to section:
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#fafafa] hover:bg-[#e8f0fe] hover:text-[#3898EC] text-sm text-gray-700 transition-colors border border-[#e2e2e2]"
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.title}
            </a>
          ))}
        </div>
      </div>

      {/* Problems by category */}
      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category.id} id={category.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-[3px] bg-[#e8f0fe] flex items-center justify-center">
                <category.icon className="w-4 h-4 text-[#3898EC]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
            </div>

            <div className="space-y-6">
              {category.problems.map((problem) => (
                <div
                  key={problem.symptom}
                  className="rounded-[3px] border border-[#e2e2e2] bg-white overflow-hidden shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.05)]"
                >
                  {/* Symptom header */}
                  <div className="px-5 py-4 bg-amber-50 border-b border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-amber-700 text-sm">
                          {problem.symptom}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Causes */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#AAADB0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea384c]" />
                        Possible Causes
                      </h4>
                      <ul className="space-y-1">
                        {problem.causes.map((cause, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-500 pl-4 border-l-2 border-[#ea384c]/20"
                            dangerouslySetInnerHTML={{ __html: cause }}
                          />
                        ))}
                      </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#AAADB0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#40d63b]" />
                        Solutions
                      </h4>
                      <ul className="space-y-1.5">
                        {problem.solutions.map((solution, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-500 pl-4 border-l-2 border-[#40d63b]/20"
                            dangerouslySetInnerHTML={{ __html: solution }}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Getting Help */}
      <section className="mt-16 p-6 rounded-[3px] border border-[#e2e2e2] bg-[#fafafa]">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-[#3898EC]" />
          Still Having Issues?
        </h2>
        <div className="space-y-3">
          {[
            {
              title: "GitHub Discussions",
              url: "https://github.com/OpenPay-App/openpay/discussions",
              description: "Ask the community — search existing threads or start a new discussion",
            },
            {
              title: "GitHub Issues",
              url: "https://github.com/OpenPay-App/openpay/issues",
              description: "Report bugs or request features with detailed reproduction steps",
            },
            {
              title: "Stack Overflow",
              url: "https://stackoverflow.com/questions/tagged/openpay",
              description: "Tag your questions with 'openpay' for broader developer reach",
            },
          ].map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between p-4 rounded-[3px] border border-[#e2e2e2] hover:border-[#3898EC]/30 hover:bg-white transition-all group bg-white"
            >
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-[#3898EC] transition-colors text-sm flex items-center gap-2">
                  {resource.title}
                  <ExternalLink className="w-3.5 h-3.5 text-[#AAADB0] group-hover:text-[#3898EC] transition-colors" />
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {resource.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
