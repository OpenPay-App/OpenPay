## Description

<!-- What does this change do and why? -->

## Type of change

- [ ] `major` — breaking change (schema / API / deployment contract). New tag will be `v<MAJOR+1>.0.0`.
- [ ] `minor` — new feature, additive only. New tag will be `vX.<MINOR+1>.0`.
- [ ] `patch` — bug / security fix. New tag will be `vX.Y.<PATCH+1>`.
- [ ] docs / CI / tooling (no version bump).

## Versioning check

- [ ] If this changes `docker-compose.yml` service names, ports, or env contracts: tick `major` above.
- [ ] If this adds a migration or changes the DB schema: tick `major` above (self-hosted upgrades must run `migrate-hyperswitch-db.sh`).

## How has this been tested?

- [ ] `bash -n scripts/*.sh`
- [ ] `docker compose config -q`
- [ ] `scripts/health-check.sh --wait`
- [ ] `pnpm exec tsc --noEmit` (dashboard)
- [ ] `scripts/ci-smoke.sh`
- [ ] Added/updated unit tests

## Checklist

- [ ] `.env.example` / `.env.production.example` updated for any new configuration.
- [ ] Docs updated under `apps/merchant-dashboard/src/app/docs/` if user-facing behavior changed.
- [ ] No secrets or placeholder credentials committed.
- [ ] `docs/CI-CD.md` release notes requirements satisfied if this is a release PR.

## Related issues

Closes #
