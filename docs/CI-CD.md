# CI/CD Pipeline & Release Process

OpenPay ships as a self-hosted stack and as OCI images. This document describes
the continuous integration, security scanning, and release automation that
backs the semi-automated upgrade system (`scripts/upgrade.sh`).

---

## Pipeline architecture

```
 PR / push to main                    tag v1.2.0
        │                                 │
        ▼                                 ▼
  .github/workflows/ci.yml          .github/workflows/release.yml
  • lint + tsc (dashboard)          • SemVer validation
  • unit tests (if present)         • bump-type detection (major/minor/patch)
  • compose config + env config     • environment gate (staging smoke)
  • docker build validation         • publish-images.yml (reusable)
  • full compose smoke (ci-smoke)   • signed release artifacts
  • docs check                      • GitHub Release + SBOM + provenance
        │                                 │
        ▼                                 ▼
  .github/workflows/security.yml   .github/workflows/publish-images.yml
  • gitleaks / CodeQL / OSV        • multi-arch build (amd64+arm64)
  • Trivy image + IaC scan         • GHCR + Docker Hub, semver tags
  • license compliance             • cosign keyless signing
                                    • SBOM + build attestation
```

Workflows:

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | PR, push `main` | Required status checks: lint, typecheck, tests, config validation, Docker build, full compose smoke |
| `docs.yml` | PR/push touching docs | Docs-specific required check: markdown link check + docs app build & typecheck |
| `security.yml` | PR, main, weekly, manual | Secret scan (gitleaks), SAST (CodeQL), dependency scan (pnpm audit + OSV), container scan (Trivy), license check |
| `docker-build.yml` | push `main`, manual | Publishes `edge` / `sha-<short>` images via the reusable publisher |
| `release.yml` | tag `v*` | The only path that produces a release: gate → publish → signed artifacts → GitHub Release |
| `staging.yml` | manual (`ref` + optional `--require-processor`) | Ad-hoc full-environment validation against a staging environment |
| `dependency-update.yml` | weekly, manual | Staleness report + dependabot alert summary |

The image publishing logic lives once in `publish-images.yml` (reusable) and is
invoked by `docker-build.yml` and `release.yml` — a tag push therefore never
double-publishes.

---

## Versioning (SemVer)

Version scheme is enforced end-to-end by `scripts/version.sh`:

| Bump | Meaning | Example | Migration required? |
|---|---|---|---|
| `major` | breaking: schema, API contract, service topology | `v1.4.2 → v2.0.0` | always |
| `minor` | additive new feature | `v1.1.0 → v1.2.0` | only if it adds migrations |
| `patch` | bug / security fix | `v1.1.0 → v1.1.1` | only if it fixes a migration |

The release workflow refuses any tag that is not exactly `vMAJOR.MINOR.PATCH`
and computes the bump type by diffing against the previous release tag.

---

## Releasing (operator / maintainer)

1. Merge the release-candidate PR (`main` must be green — all `ci.yml` checks
   are required on `main`).
2. Classify the bump against the previous tag (see table above) and pick it in
   the PR checklist.
3. Create and push the tag:

   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

4. `release.yml` runs: SemVer validation → staging environment gate (full
   `scripts/ci-smoke.sh`) → image publishing → artifact signing → GitHub
   Release with generated notes.
5. `latest` and floating tags (`v1.2`, `v1`) are re-pointed **only** on
   release, never on `main`.

### Release artifacts

Every release uploads:

- `release.tar.gz` — clean `git archive` snapshot of the tag (cosign-signed)
- `release.tar.gz.sig` / `release.tar.gz.pem` — signature + certificate
- `release.sha256` — checksums of all artifacts
- `release.sbom.json` — CycloneDX SBOM of the dashboard image
- `release.attestation.json` — SLSA-style build provenance

### Publishing images

`publish-images.yml` builds every image for `linux/amd64` and `linux/arm64` and
pushes to **GHCR always** and **Docker Hub when credentials exist**:

```
ghcr.io/OpenPay-App/openpay/dashboard:v1.2.0
ghcr.io/OpenPay-App/openpay/dashboard:v1.2
ghcr.io/OpenPay-App/openpay/dashboard:v1
ghcr.io/OpenPay-App/openpay/dashboard:latest   (release only)
ghcr.io/OpenPay-App/openpay/dashboard:sha-a81f92 (main only)
```

The published image set is: `openpay/dashboard`, `openpay/nats-kb-bridge`,
`openpay/tazama-rule-exec`, `openpay/tazama-auth`. Dev/stub containers
(`tazama-rule-studio`, `case-management`, `mock-superposition`, `hyperswitch`)
are built and smoke-tested in CI but intentionally not published — they are
templates for fork/custom deployments.

Verify an image:

```bash
cosign verify ghcr.io/OpenPay-App/openpay/dashboard:v1.2.0 \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```

---

## Required secrets & environments

### Repository secrets (`Settings → Secrets and variables → Actions`)

| Secret | Required | Used by | Notes |
|---|---|---|---|
| `GHCR_TOKEN` | optional | — | A `GITHUB_TOKEN` with `packages: write` is used by default; set this only for external publishers. |
| `DOCKERHUB_USERNAME` | optional | `publish-images.yml` | Docker Hub push is skipped when unset. |
| `DOCKERHUB_TOKEN` | optional | `publish-images.yml` | |
| `COSIGN_PRIVATE_KEY` / `COSIGN_PASSWORD` | optional | — | Keyless signing is the default; use these only for non-OIDC environments. |
| `PAYSTACK_SECRET_KEY` | optional | `release.yml`, `staging.yml` | Enables the live business-flow leg of the smoke test. |
| `WEBHOOK_SECRET` | optional | `release.yml`, `staging.yml` | |
| `VAULT_TOKEN` | reserved | future | Documented for the Vault integration in `.env.production.example`. |
| `GITLEAKS_LICENSE` | optional | `security.yml` | Only needed for gitleaks Pro features. |

### Environments (`Settings → Environments`)

| Environment | Protection | Purpose |
|---|---|---|
| `release` | required reviewers (recommended) | Gates the release smoke run. |
| `staging` | — | Ad-hoc validation target for `staging.yml`. |

### Branch protection (`Settings → Rules → Rulesets`)

Required checks on `main` and on `v*` tag pushes:

- `CI / Lint & typecheck (dashboard)`
- `CI / Unit tests (if present)`
- `CI / Validate compose & env config`
- `CI / Docker build validation (dashboard)`
- `CI / Compose deployment + smoke test`
- `Docs / ...` (both jobs, on docs-touching PRs)
- `Security / ...` (all jobs)

Require: linear history, signed commits (recommended), and one approving review.

---

## Security model

- **Secrets in the open**: none. The repo contains only `.env.example` and
  `.env.production.example` templates; production values live in the secret
  store (Vault / GitHub secrets) and are injected at runtime.
- **Placeholder rejection**: `scripts/validate-config.sh` refuses production
  config containing placeholder markers (`your_`, `pk_test_`, `changeme`).
- **Signed artifacts**: images are cosign-signed with GitHub OIDC identity;
  source snapshots are `sign-blob`-signed. Consumers verify identity, not a
  shared secret key.
- **Supply chain**: SBOM per image (syft) + SLSA build provenance attestation
  on every push. The `slsa-github-generator` reusable generator is the planned
  next step for stricter provenance.
- **Dependency hygiene**: dependabot opens weekly group PRs; pnpm audit, OSV
  and Trivy run on every PR and weekly; a nightly/weekly staleness report keeps
  upgrades visible.

---

## Local validation (mirror of CI)

```bash
bash -n scripts/*.sh                     # shell syntax
docker compose config -q                 # compose validity
./scripts/validate-config.sh             # env completeness + URL format
pnpm exec tsc --noEmit                   # dashboard types (in apps/merchant-dashboard)
./scripts/ci-smoke.sh                    # full local environment gate
./scripts/release.sh v1.2.0 --skip-smoke # local release pipeline (bundle + signing)
```

The self-hosted upgrade operator flow (backup → migrate-guard → apply → verify
→ auto-rollback) is documented at
`/docs/self-hosting/upgrades`; `make upgrade TARGET=v1.2.0` is the operator-side
counterpart of this pipeline's release output.
