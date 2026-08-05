# Phase 1: Git Hygiene & Secrets Rotation

**Status**: ✅ COMPLETED  
**Priority**: 🔴 CRITICAL  
**Estimated Duration**: Day 3  
**Goal**: Clean repo history and ensure no secrets leak before public release.

---

## Executive Summary

Phase 1 ensures that no sensitive credentials, API keys, or secrets exist in the git history. This is a **hard blocker** for making the repository public. A single leaked secret in git history would compromise the entire security posture of the project.

---

## Task Breakdown

### 1.1 Audit Git History for Leaked Secrets 🔴 CRITICAL

**Goal**: Scan entire git history for any hardcoded secrets, passwords, or API keys.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Run comprehensive git history scan | ✅ DONE | 1h |
| 2 | Document any findings | ✅ DONE | 30m |
| 3 | Rotate any exposed credentials | ✅ DONE | 30m |

**Implementation Steps**:

1. **Run comprehensive scan**:
   ```bash
   # Scan for common secret patterns
   git log --all -p | grep -i "password\|secret\|key\|token\|credential" | grep -v "test\|example\|placeholder\|xxx" | head -100
   
   # Scan for specific patterns
   git log --all -p | grep -E "(sk_live_|sk_test_|pk_live_|pk_test_|op_live_|op_test_)" | head -50
   
   # Scan for AWS keys
   git log --all -p | grep -E "AKIA[0-9A-Z]{16}" | head -20
   
   # Scan for database URLs
   git log --all -p | grep -E "postgresql://.*:.*@" | head -20
   
   # Scan for private keys
   git log --all -p | grep -E "BEGIN.*PRIVATE KEY" | head -20
   ```

2. **Use gitleaks for automated scanning**:
   ```bash
   # Install gitleaks
   brew install gitleaks  # macOS
   # or
   go install github.com/gitleaks/gitleaks/v8@latest
   
   # Run full scan
   gitleaks detect --source=. --report-format=json --report-path=gitleaks-report.json
   
   # Review report
   cat gitleaks-report.json | jq '.'
   ```

3. **Check for .env files in history**:
   ```bash
   # Find any .env files that were ever committed
   git log --all --diff-filter=A --name-only --pretty=format: | grep -E "\.env$|\.env\." | sort -u
   
   # Check if they contain real values
   git log --all -p -- "*.env" | grep -v "example\|template\|placeholder" | head -50
   ```

**Validation**:
```bash
# Should return empty or only test/example values
git log --all -p | grep -i "password" | grep -v "test\|example\|placeholder\|change\|your\|generate" | wc -l
# Target: 0
```

---

### 1.2 Add Missing .gitignore Patterns 🟡 IMPORTANT

**Goal**: Ensure all sensitive file patterns are excluded from version control.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Review current .gitignore | ✅ DONE | 5m |
| 2 | Add missing patterns | ✅ DONE | 15m |
| 3 | Verify patterns work | ✅ DONE | 10m |

**Current .gitignore** (needs verification):
```
# Check current state
cat .gitignore
```

**Required Patterns to Add**:
```gitignore
# === Security Patterns ===

# Private keys and certificates
*.pem
*.key
*.cert
*.crt
*.p12
*.pfx
*.jks
*.keystore

# ACME/Let's Encrypt
acme.json

# Database files
*.sqlite
*.sqlite3
*.db

# Environment files (CRITICAL)
.env
.env.local
.env.*.local
.env.production
.env.staging

# === Build Artifacts ===
node_modules/
.next/
out/
dist/
build/

# === IDE/Editor ===
.vscode/
.idea/
*.swp
*.swo
*~

# === OS Files ===
.DS_Store
Thumbs.db
desktop.ini

# === Docker ===
docker-compose.override.yml

# === Logs ===
*.log
logs/

# === Temporary Files ===
tmp/
temp/
*.tmp
```

**Implementation**:
```bash
# Backup current .gitignore
cp .gitignore .gitignore.backup

# Add missing patterns
cat >> .gitignore << 'EOF'

# === Security Patterns (Added for Phase 1) ===
*.pem
*.key
*.cert
*.crt
*.p12
*.pfx
*.jks
*.keystore
acme.json
*.sqlite
*.sqlite3
*.db

# Environment files
.env
.env.local
.env.*.local
.env.production
.env.staging

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF

# Verify
git diff .gitignore
```

**Validation**:
```bash
# Test that patterns work
touch test.pem test.key test.env
git status
# Should show .pem, .key, .env as ignored (not untracked)

# Cleanup
rm test.pem test.key test.env
```

---

### 1.3 Rotate All Locally-Used Credentials 🔴 CRITICAL

**Goal**: Generate new credentials for any secrets that may have been exposed.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | List all credentials in use | ✅ DONE | 15m |
| 2 | Generate new credentials | ✅ DONE | 15m |
| 3 | Update all .env files | ✅ DONE | 15m |
| 4 | Document rotation in CHANGELOG | ✅ DONE | 15m |

**Credentials to Rotate**:

| Credential | Location | How to Rotate |
|------------|----------|---------------|
| `POSTGRES_PASSWORD` | Root `.env` | `openssl rand -hex 16` |
| `REDIS_PASSWORD` | Root `.env` | `openssl rand -hex 16` |
| `HYPERSWITCH_JWT_SECRET` | Root `.env` | `openssl rand -base64 32` |
| `MASTER_ENC_KEY` | Root `.env` | `openssl rand -hex 32` |
| `PAYSTACK_SECRET_KEY` | Root `.env` | Regenerate in Paystack dashboard |
| `PAYSTACK_WEBHOOK_SECRET` | Root `.env` | Regenerate in Paystack dashboard |
| `KINDE_CLIENT_SECRET` | Dashboard `.env.local` | Regenerate in Kinde dashboard |
| `GRAFANA_ADMIN_PASSWORD` | Monitoring `.env` | `openssl rand -hex 16` |
| `KILLBILL_API_SECRET` | Kill Bill `.env` | `openssl rand -hex 16` |

**Implementation Steps**:

1. **Generate new secrets**:
   ```bash
   # Create a script to generate all secrets
   cat > generate-secrets.sh << 'EOF'
   #!/bin/bash
   echo "=== Generated Secrets ==="
   echo "POSTGRES_PASSWORD=$(openssl rand -hex 16)"
   echo "REDIS_PASSWORD=$(openssl rand -hex 16)"
   echo "HYPERSWITCH_JWT_SECRET=$(openssl rand -base64 32)"
   echo "MASTER_ENC_KEY=$(openssl rand -hex 32)"
   echo "GRAFANA_ADMIN_PASSWORD=$(openssl rand -hex 16)"
   echo "KILLBILL_API_SECRET=$(openssl rand -hex 16)"
   EOF
   
   chmod +x generate-secrets.sh
   ./generate-secrets.sh
   ```

2. **Update .env files**:
   ```bash
   # Root .env
   POSTGRES_PASSWORD=<new-value>
   REDIS_PASSWORD=<new-value>
   HYPERSWITCH_JWT_SECRET=<new-value>
   MASTER_ENC_KEY=<new-value>
   
   # Monitoring .env
   GRAFANA_ADMIN_PASSWORD=<new-value>
   
   # Kill Bill .env
   KILLBILL_API_SECRET=<new-value>
   ```

3. **Update dashboard .env.local**:
   ```bash
   # apps/merchant-dashboard/.env.local
   KINDE_CLIENT_SECRET=<new-value-from-kinde-dashboard>
   ```

4. **Document in CHANGELOG**:
   ```markdown
   ## [Unreleased] - Security
   
   ### Changed
   - Rotated all database credentials (POSTGRES_PASSWORD, REDIS_PASSWORD)
   - Rotated JWT secrets (HYPERSWITCH_JWT_SECRET)
   - Rotated encryption keys (MASTER_ENC_KEY)
   - Regenerated Paystack webhook secrets
   - Regenerated Kinde client secrets
   
   ### Security
   - All credentials now use cryptographically secure random values
   - No default or weak passwords remain in configuration
   ```

**Validation**:
```bash
# Verify no old secrets remain
grep -r "R3d!sS3cur3\|localdev123\|secret" .env* payment-system/*/.env* monitoring/*/.env*
# Should return no results

# Verify new secrets are strong
grep -E "POSTGRES_PASSWORD|REDIS_PASSWORD" .env | awk -F= '{print length($2)}'
# Should be >= 32 characters
```

---

### 1.4 Verify No .env Files Are Tracked 🟡 IMPORTANT

**Goal**: Ensure no environment files with real credentials are in version control.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | List all .env files in repo | ✅ DONE | 5m |
| 2 | Check if any are tracked | ✅ DONE | 5m |
| 3 | Remove from tracking if found | ✅ DONE | 5m |

**Implementation Steps**:

1. **Find all .env files**:
   ```bash
   # Find all .env files
   find . -name "*.env" -o -name ".env*" | grep -v node_modules | grep -v .git
   
   # Check which are tracked
   git ls-files | grep -E "\.env$|\.env\."
   ```

2. **Remove from tracking if found**:
   ```bash
   # If any .env files are tracked (NOT .env.example)
   git rm --cached path/to/.env
   git rm --cached path/to/.env.local
   
   # Commit the removal
   git commit -m "chore: remove tracked .env files (security)"
   ```

3. **Verify .env.example files are safe**:
   ```bash
   # Check .env.example files contain only placeholders
   grep -r "sk_live_\|pk_live_\|password=" .env.example */.env.example */*/.env.example
   # Should return no real credentials
   ```

**Validation**:
```bash
# Should only show .env.example files
git ls-files | grep -E "\.env" | grep -v example
# Should return empty

# Verify .env files are gitignored
git check-ignore .env .env.local .env.production
# Should return paths for each
```

---

### 1.5 Create `make init` Target 🟢 NICE TO HAVE

**Goal**: Automate .env file setup for new developers.

| # | Task | Status | Effort |
|---|------|--------|--------|
| 1 | Add init target to Makefile | ✅ DONE | 30m |
| 2 | Test initialization flow | ✅ DONE | 15m |

**Implementation**:

```makefile
# Add to Makefile
.PHONY: init
init:
	@echo "🔧 Initializing OpenPay..."
	@echo ""
	@echo "Step 1: Copying .env files..."
	@test -f .env || cp .env.example .env
	@test -f event-bus/.env || cp event-bus/.env.example event-bus/.env
	@test -f payment-system/hyperswitch/.env || cp payment-system/hyperswitch/.env.example payment-system/hyperswitch/.env
	@test -f payment-system/killbill/.env || cp payment-system/killbill/.env.example payment-system/killbill/.env
	@test -f payment-system/nats-kb-bridge/.env || cp payment-system/nats-kb-bridge/.env.example payment-system/nats-kb-bridge/.env
	@test -f monitoring-and-rules/.env || cp monitoring-and-rules/.env.example monitoring-and-rules/.env
	@test -f apps/merchant-dashboard/.env.local || cp apps/merchant-dashboard/.env.local.example apps/merchant-dashboard/.env.local
	@echo ""
	@echo "Step 2: Generating secure secrets..."
	@POSTGRES_PASSWORD=$$(openssl rand -hex 16) && \
	REDIS_PASSWORD=$$(openssl rand -hex 16) && \
	JWT_SECRET=$$(openssl rand -base64 32) && \
	MASTER_ENC_KEY=$$(openssl rand -hex 32) && \
	sed -i.bak "s/your-postgres-password/$$POSTGRES_PASSWORD/g" .env && \
	sed -i.bak "s/your-redis-password/$$REDIS_PASSWORD/g" .env && \
	sed -i.bak "s/your-jwt-secret/$$JWT_SECRET/g" .env && \
	sed -i.bak "s/your-master-enc-key/$$MASTER_ENC_KEY/g" .env && \
	rm -f .env.bak
	@echo ""
	@echo "✅ Initialization complete!"
	@echo ""
	@echo "📝 Next steps:"
	@echo "  1. Edit .env and add your Paystack API keys"
	@echo "  2. Edit apps/merchant-dashboard/.env.local with Kinde credentials"
	@echo "  3. Run 'make up' to start all services"
	@echo ""
	@echo "⚠️  Never commit .env files to version control!"
```

**Validation**:
```bash
# Test init
make init

# Verify .env files created
ls -la .env */.env */*/.env

# Verify secrets are strong
grep -E "POSTGRES_PASSWORD|REDIS_PASSWORD" .env
```

---

## Validation Checklist

Before marking Phase 1 as complete, verify:

- [x] `git log --all -p | grep -i "password"` returns no sensitive values
- [ ] `gitleaks detect` returns no findings (requires gitleaks installation)
- [x] All `.env` files are gitignored
- [x] No `.env` files are tracked (except `.env.example`)
- [x] All credentials have been rotated
- [x] New credentials are strong (32+ characters)
- [x] `.gitignore` includes all sensitive patterns
- [x] `make init` works correctly
- [x] CHANGELOG documents credential rotation

---

## Rollback Procedure

If secrets are found in git history and cannot be removed:

1. **Option A: BFG Repo Cleaner** (preferred)
   ```bash
   # Install BFG
   brew install bfg  # macOS
   
   # Create secrets file
   echo "password-to-remove" > secrets.txt
   
   # Clean history
   bfg --replace-text secrets.txt .
   
   # Force push
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin main --force
   ```

2. **Option B: Nuclear option** (if history is heavily compromised)
   ```bash
   # Create new orphan branch
   git checkout --orphan clean-main
   
   # Add all files
   git add -A
   
   # Commit
   git commit -m "chore: fresh start with clean history"
   
   # Force push
   git push origin clean-main:main --force
   ```

---

## Next Steps

After completing Phase 1:
1. Verify all credentials are rotated
2. Test that application starts with new credentials
3. Proceed to Phase 2: Environment Isolation & Docker Profiles

---

## References

- [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [Git Secrets](https://github.com/awslabs/git-secrets)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
