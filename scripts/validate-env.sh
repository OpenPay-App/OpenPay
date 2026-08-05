#!/bin/bash
# =============================================================================
# Environment Configuration Validator
# =============================================================================
# This script validates that all required environment variables are set
# and have appropriate values.
#
# Usage:
#   ./scripts/validate-env.sh
#   source .env && ./scripts/validate-env.sh
# =============================================================================

set -e

# Load .env file if it exists
if [ -f ".env" ]; then
    echo "Loading .env file..."
    set -a
    source .env
    set +a
    echo ""
fi

echo "============================================="
echo "OpenPay Environment Validator"
echo "============================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track errors
ERRORS=0
WARNINGS=0

# Function to check if a variable is set
check_var() {
    local var_name=$1
    local required=$2
    local description=$3
    
    if [ -z "${!var_name}" ]; then
        if [ "$required" = "required" ]; then
            echo -e "${RED}❌ Missing required: ${var_name}${NC}"
            echo "   Description: ${description}"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${YELLOW}⚠️  Optional not set: ${var_name}${NC}"
            echo "   Description: ${description}"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        # Check if value is a placeholder
        if [[ "${!var_name}" == *"your_"* ]] || [[ "${!var_name}" == *"placeholder"* ]] || [[ "${!var_name}" == *"generate"* ]]; then
            echo -e "${YELLOW}⚠️  Placeholder value: ${var_name}${NC}"
            echo "   Current: ${!var_name:0:20}..."
            WARNINGS=$((WARNINGS + 1))
        else
            echo -e "${GREEN}✅ ${var_name}${NC}"
        fi
    fi
}

# Function to check password strength
check_password_strength() {
    local var_name=$1
    local min_length=$2
    
    if [ -n "${!var_name}" ]; then
        local value="${!var_name}"
        local length=${#value}
        if [ $length -lt $min_length ]; then
            echo -e "${YELLOW}⚠️  Weak password: ${var_name} (${length} chars, min: ${min_length})${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
}

echo "Checking required variables..."
echo ""

# ─── Database ────────────────────────────────────────────────────────────────
echo "Database:"
check_var "POSTGRES_PASSWORD" "required" "Strong password for PostgreSQL"
check_var "POSTGRES_USER" "optional" "PostgreSQL username (default: coreplatform)"
check_var "POSTGRES_DB" "optional" "PostgreSQL database name (default: hyperswitch)"
echo ""

# ─── Redis ───────────────────────────────────────────────────────────────────
echo "Redis:"
check_var "REDIS_PASSWORD" "required" "Strong password for Redis"
echo ""

# ─── Hyperswitch Security ───────────────────────────────────────────────────
echo "Hyperswitch Security:"
check_var "HYPERSWITCH_JWT_SECRET" "required" "JWT secret for Hyperswitch"
check_var "MASTER_ENC_KEY" "required" "Master encryption key (64 hex chars)"
check_var "HYPERSWITCH_ADMIN_API_KEY" "required" "Admin API key for Hyperswitch"
echo ""

# ─── Payment Processor ──────────────────────────────────────────────────────
echo "Payment Processor (Paystack):"
check_var "PAYSTACK_SECRET_KEY" "required" "Paystack secret key (sk_test_xxxxx or sk_live_xxxxx)"
check_var "PAYSTACK_PUBLIC_KEY" "required" "Paystack public key (pk_test_xxxxx or pk_live_xxxxx)"
check_var "PAYSTACK_WEBHOOK_SECRET" "required" "Webhook signing secret"
echo ""

# ─── Authentication ─────────────────────────────────────────────────────────
echo "Authentication (Kinde):"
check_var "KINDE_CLIENT_ID" "required" "Kinde application client ID"
check_var "KINDE_CLIENT_SECRET" "required" "Kinde application client secret"
echo ""

# ─── Email ───────────────────────────────────────────────────────────────────
echo "Email (SMTP):"
check_var "EMAIL_SMTP_HOST" "optional" "SMTP host (default: mailhog)"
check_var "EMAIL_SMTP_PASSWORD" "optional" "SMTP password"
echo ""

# ─── Monitoring ──────────────────────────────────────────────────────────────
echo "Monitoring:"
check_var "GRAFANA_ADMIN_PASSWORD" "optional" "Grafana admin password (CHANGE FOR PRODUCTION!)"
echo ""

# ─── Kill Bill ───────────────────────────────────────────────────────────────
echo "Kill Bill:"
check_var "KILLBILL_API_SECRET" "optional" "Kill Bill API secret"
echo ""

# ─── Password Strength Checks ───────────────────────────────────────────────
echo "Checking password strength..."
check_password_strength "POSTGRES_PASSWORD" 16
check_password_strength "REDIS_PASSWORD" 16
check_password_strength "HYPERSWITCH_JWT_SECRET" 32
check_password_strength "MASTER_ENC_KEY" 64
echo ""

# ─── Summary ─────────────────────────────────────────────────────────────────
echo "============================================="
echo "Summary"
echo "============================================="
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Validation failed: ${ERRORS} error(s)${NC}"
    echo ""
    echo "Please set the missing required variables in your .env file."
    echo "You can use './scripts/generate-secrets.sh' to generate secure values."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Validation passed with ${WARNINGS} warning(s)${NC}"
    echo ""
    echo "Consider addressing the warnings above for production use."
    exit 0
else
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Your environment configuration looks good."
    exit 0
fi
