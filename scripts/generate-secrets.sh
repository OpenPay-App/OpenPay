#!/bin/bash
# =============================================================================
# Generate Secure Production Secrets
# =============================================================================
# This script generates cryptographically secure random values for all
# sensitive configuration variables.
#
# Usage:
#   ./scripts/generate-secrets.sh
#
# Output:
#   Generates a .env file with secure random values
#
# ⚠️  WARNING: This will overwrite the existing .env file!
# =============================================================================

set -e

echo "============================================="
echo "OpenPay Production Secret Generator"
echo "============================================="
echo ""

# Check if .env already exists
if [[ -f ".env" ]]; then
    echo "⚠️  Warning: .env file already exists!"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
    echo ""
fi

echo "Generating secure random values..."
echo ""

# Generate secure random values
POSTGRES_PASSWORD=$(openssl rand -hex 24)
REDIS_PASSWORD=$(openssl rand -hex 24)
HYPERSWITCH_JWT_SECRET=$(openssl rand -base64 32)
HYPERSWITCH_ADMIN_API_KEY=$(openssl rand -hex 32)
MASTER_ENC_KEY=$(openssl rand -hex 32)
GRAFANA_ADMIN_PASSWORD=$(openssl rand -hex 16)
KILLBILL_API_SECRET=$(openssl rand -hex 24)

# Create .env file
cat > .env << EOF
# =============================================================================
# OpenPay Production Configuration
# =============================================================================
# Generated on: $(date '+%Y-%m-%d %H:%M:%S')
# 
# ⚠️  SECURITY WARNING: This file contains sensitive credentials!
#     - NEVER commit this file to version control
#     - Keep this file secure and restrict access
#     - Use different credentials for each environment
# =============================================================================

# General Configuration
COMPOSE_PROJECT_NAME=openpay
ENVIRONMENT=production
LOG_LEVEL=info

# ─── Traefik Proxy ───────────────────────────────────────────────────────────
TRAEFIK_API_INSECURE=false
TRAEFIK_DASHBOARD=true

# ─── NATS JetStream ──────────────────────────────────────────────────────────
NATS_URL=nats://nats:4222
NATS_MONITORING_URL=http://nats:8222

# ─── Hyperswitch (Payment Orchestration) ─────────────────────────────────────
HYPERSWITCH_URL_TEST=http://hyperswitch:8080
HYPERSWITCH_API_KEY_TEST=your_hyperswitch_sandbox_api_key
HYPERSWITCH_URL_LIVE=https://router.yourdomain.com
HYPERSWITCH_API_KEY_LIVE=your_hyperswitch_live_api_key
HYPERSWITCH_API_KEY=your_hyperswitch_api_key
HYPERSWITCH_API_URL=http://hyperswitch:8080

# ─── Paystack Integration ────────────────────────────────────────────────────
PAYSTACK_SECRET_KEY=your-paystack-secret-key-here
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here
PAYSTACK_BASE_URL=https://api.paystack.co

# ─── Kill Bill (Subscription Billing) ────────────────────────────────────────
KILLBILL_API_KEY=your_killbill_api_key
KILLBILL_API_SECRET=${KILLBILL_API_SECRET}
KILLBILL_API_URL=http://killbill:8080

# ─── Tazama (Fraud Detection) ────────────────────────────────────────────────
TAZAMA_API_URL=http://tazama-rule-exec:8080
TAZAMA_AUTH_URL=http://tazama-auth:8080

# ─── Database (PostgreSQL) ───────────────────────────────────────────────────
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=coreplatform
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

# ─── Redis ───────────────────────────────────────────────────────────────────
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# ─── Hyperswitch Security ────────────────────────────────────────────────────
HYPERSWITCH_JWT_SECRET=${HYPERSWITCH_JWT_SECRET}
HYPERSWITCH_ADMIN_API_KEY=${HYPERSWITCH_ADMIN_API_KEY}
# ⚠️  NEVER change this after initial setup - existing encrypted data won't be decryptable
MASTER_ENC_KEY=${MASTER_ENC_KEY}

# ─── Grafana Monitoring ──────────────────────────────────────────────────────
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}

# ─── Email Delivery (SMTP) ───────────────────────────────────────────────────
EMAIL_ACTIVE_CLIENT=SMTP
EMAIL_SENDER_EMAIL=no-reply@yourdomain.com
EMAIL_SMTP_HOST=mailhog
EMAIL_SMTP_PORT=1025
EMAIL_SMTP_CONNECTION=plaintext
EMAIL_SMTP_TIMEOUT=10
EMAIL_SMTP_USERNAME=mailhog
EMAIL_SMTP_PASSWORD=mailhog

# ─── Dashboard URLs ──────────────────────────────────────────────────────────
HYPERSWITCH_DASHBOARD_URL=http://localhost:9000
HYPERSWITCH_PUBLIC_API_URL=http://localhost:8081
HYPER_EMAIL_ENABLED=false
EOF

echo "✅ .env file generated successfully!"
echo ""
echo "============================================="
echo "Generated Secrets:"
echo "============================================="
echo ""
echo "POSTGRES_PASSWORD:      ${POSTGRES_PASSWORD:0:8}...${POSTGRES_PASSWORD: -8}"
echo "REDIS_PASSWORD:         ${REDIS_PASSWORD:0:8}...${REDIS_PASSWORD: -8}"
echo "HYPERSWITCH_JWT_SECRET: ${HYPERSWITCH_JWT_SECRET:0:8}...${HYPERSWITCH_JWT_SECRET: -8}"
echo "MASTER_ENC_KEY:         ${MASTER_ENC_KEY:0:8}...${MASTER_ENC_KEY: -8}"
echo "GRAFANA_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD:0:8}...${GRAFANA_ADMIN_PASSWORD: -8}"
echo ""
echo "============================================="
echo "Next Steps:"
echo "============================================="
echo ""
echo "1. Edit .env and add your Paystack API keys"
echo "2. Edit .env and add your Hyperswitch API keys"
echo "3. Run: docker compose --profile core up -d"
echo ""
echo "⚠️  Never commit .env files to version control!"
echo ""
