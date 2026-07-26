#!/bin/bash

# Core Financial Platform Setup Script
# This script helps with initial setup and configuration for Paystack integration

set -e

echo "Core Financial Platform Setup"
echo "============================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo "Error: curl is not installed"
    echo "Please install curl"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "Warning: jq is not installed (recommended for JSON formatting)"
    echo "Install jq from https://stedolan.github.io/jq/download/"
fi

echo "Prerequisites check passed!"
echo ""

# Copy environment files
echo "Setting up environment files..."

# Root level
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env from .env.example"
fi

# Event Bus
if [ ! -f event-bus/.env ]; then
    cp event-bus/.env.example event-bus/.env
    echo "✓ Created event-bus/.env"
fi

# Payment System
if [ ! -f payment-system/hyperswitch/.env ]; then
    cp payment-system/hyperswitch/.env.example payment-system/hyperswitch/.env
    echo "✓ Created payment-system/hyperswitch/.env"
fi

if [ ! -f payment-system/killbill/.env ]; then
    cp payment-system/killbill/.env.example payment-system/killbill/.env
    echo "✓ Created payment-system/killbill/.env"
fi

if [ ! -f payment-system/nats-kb-bridge/.env ]; then
    cp payment-system/nats-kb-bridge/.env.example payment-system/nats-kb-bridge/.env
    echo "✓ Created payment-system/nats-kb-bridge/.env"
fi

# Monitoring and Rules
if [ ! -f monitoring-and-rules/.env ]; then
    cp monitoring-and-rules/.env.example monitoring-and-rules/.env
    echo "✓ Created monitoring-and-rules/.env"
fi

if [ ! -f monitoring-and-rules/tazama-auth/.env ]; then
    cp monitoring-and-rules/tazama-auth/.env.example monitoring-and-rules/tazama-auth/.env
    echo "✓ Created monitoring-and-rules/tazama-auth/.env"
fi

if [ ! -f monitoring-and-rules/tazama-rule-exec/.env ]; then
    cp monitoring-and-rules/tazama-rule-exec/.env.example monitoring-and-rules/tazama-rule-exec/.env
    echo "✓ Created monitoring-and-rules/tazama-rule-exec/.env"
fi

if [ ! -f monitoring-and-rules/tazama-rule-studio/.env ]; then
    cp monitoring-and-rules/tazama-rule-studio/.env.example monitoring-and-rules/tazama-rule-studio/.env
    echo "✓ Created monitoring-and-rules/tazama-rule-studio/.env"
fi

if [ ! -f monitoring-and-rules/case-management/.env ]; then
    cp monitoring-and-rules/case-management/.env.example monitoring-and-rules/case-management/.env
    echo "✓ Created monitoring-and-rules/case-management/.env"
fi

echo ""
echo "Environment files created!"
echo ""

# Generate secure keys
echo "Generating secure keys..."
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 64 2>/dev/null || echo "local-jwt-secret-dev-only-change-in-prod")
echo "Generated JWT_SECRET: $JWT_SECRET"

# Generate database password
DB_PASSWORD=$(openssl rand -base64 32 2>/dev/null || echo "localdev123")
echo "Generated DATABASE_PASSWORD: $DB_PASSWORD"

# Generate Redis password
REDIS_PASSWORD=$(openssl rand -base64 32 2>/dev/null || echo "localdev123")
echo "Generated REDIS_PASSWORD: $REDIS_PASSWORD"

# Generate NATS password
NATS_PASSWORD=$(openssl rand -base64 32 2>/dev/null || echo "nats-dev-2024")
echo "Generated NATS_PASSWORD: $NATS_PASSWORD"

# Generate webhook secret
WEBHOOK_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "dev-webhook-secret-change-in-prod")
echo "Generated WEBHOOK_SECRET: $WEBHOOK_SECRET"

echo ""
echo "Keys generated! Now updating .env files..."
echo ""

# Update .env files with generated keys
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/your_database_password_here/$DB_PASSWORD/g" .env
    sed -i '' "s/your_redis_password_here/$REDIS_PASSWORD/g" .env
    sed -i '' "s/your_nats_password_here/$NATS_PASSWORD/g" .env
    sed -i '' "s/your_jwt_secret_here/$JWT_SECRET/g" .env
    sed -i '' "s/your_webhook_secret_here/$WEBHOOK_SECRET/g" .env
    
    sed -i '' "s/your_database_password_here/$DB_PASSWORD/g" payment-system/hyperswitch/.env
    sed -i '' "s/your_redis_password_here/$REDIS_PASSWORD/g" payment-system/hyperswitch/.env
    sed -i '' "s/your_nats_password_here/$NATS_PASSWORD/g" payment-system/hyperswitch/.env
    sed -i '' "s/your_webhook_secret_here/$WEBHOOK_SECRET/g" payment-system/hyperswitch/.env
    
    sed -i '' "s/your_database_password_here/$DB_PASSWORD/g" payment-system/killbill/.env
    sed -i '' "s/your_nats_password_here/$NATS_PASSWORD/g" payment-system/killbill/.env
    
    sed -i '' "s/your_nats_password_here/$NATS_PASSWORD/g" payment-system/nats-kb-bridge/.env
    
    sed -i '' "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/.env
    sed -i '' "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/.env
    sed -i '' "s/your_jwt_secret_here/$JWT_SECRET/g" monitoring-and-rules/.env
    sed -i '' "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/.env
    sed -i '' "s/your_api_secret_here/$(openssl rand -hex 32 2>/dev/null || echo "dev-api-secret")/g" monitoring-and-rules/.env
    
    sed -i '' "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/tazama-auth/.env
    sed -i '' "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/tazama-auth/.env
    sed -i '' "s/your_jwt_secret_here/$JWT_SECRET/g" monitoring-and-rules/tazama-auth/.env
    sed -i '' "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/tazama-auth/.env
    sed -i '' "s/your_api_secret_here/$(openssl rand -hex 32 2>/dev/null || echo "dev-api-secret")/g" monitoring-and-rules/tazama-auth/.env
    
    sed -i '' "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/tazama-rule-exec/.env
    sed -i '' "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/tazama-rule-exec/.env
    sed -i '' "s/your_nats_password_here/$NATS_PASSWORD/g" monitoring-and-rules/tazama-rule-exec/.env
    sed -i '' "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/tazama-rule-exec/.env
    
    sed -i '' "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/tazama-rule-studio/.env
    sed -i '' "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/tazama-rule-studio/.env
    sed -i '' "s/your_jwt_secret_here/$JWT_SECRET/g" monitoring-and-rules/tazama-rule-studio/.env
    sed -i '' "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/tazama-rule-studio/.env
    
    sed -i '' "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/case-management/.env
    sed -i '' "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/case-management/.env
    sed -i '' "s/your_jwt_secret_here/$JWT_SECRET/g" monitoring-and-rules/case-management/.env
    sed -i '' "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/case-management/.env
else
    # Linux
    sed -i "s/your_database_password_here/$DB_PASSWORD/g" .env
    sed -i "s/your_redis_password_here/$REDIS_PASSWORD/g" .env
    sed -i "s/your_nats_password_here/$NATS_PASSWORD/g" .env
    sed -i "s/your_jwt_secret_here/$JWT_SECRET/g" .env
    sed -i "s/your_webhook_secret_here/$WEBHOOK_SECRET/g" .env
    
    sed -i "s/your_database_password_here/$DB_PASSWORD/g" payment-system/hyperswitch/.env
    sed -i "s/your_redis_password_here/$REDIS_PASSWORD/g" payment-system/hyperswitch/.env
    sed -i "s/your_nats_password_here/$NATS_PASSWORD/g" payment-system/hyperswitch/.env
    sed -i "s/your_webhook_secret_here/$WEBHOOK_SECRET/g" payment-system/hyperswitch/.env
    
    sed -i "s/your_database_password_here/$DB_PASSWORD/g" payment-system/killbill/.env
    sed -i "s/your_nats_password_here/$NATS_PASSWORD/g" payment-system/killbill/.env
    
    sed -i "s/your_nats_password_here/$NATS_PASSWORD/g" payment-system/nats-kb-bridge/.env
    
    sed -i "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/.env
    sed -i "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/.env
    sed -i "s/your_jwt_secret_here/$JWT_SECRET/g" monitoring-and-rules/.env
    sed -i "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/.env
    sed -i "s/your_api_secret_here/$(openssl rand -hex 32 2>/dev/null || echo "dev-api-secret")/g" monitoring-and-rules/.env
    
    sed -i "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/tazama-auth/.env
    sed -i "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/tazama-auth/.env
    sed -i "s/your_jwt_secret_here/$JWT_SECRET/g" monitoring-and-rules/tazama-auth/.env
    sed -i "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/tazama-auth/.env
    sed -i "s/your_api_secret_here/$(openssl rand -hex 32 2>/dev/null || echo "dev-api-secret")/g" monitoring-and-rules/tazama-auth/.env
    
    sed -i "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/tazama-rule-exec/.env
    sed -i "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/tazama-rule-exec/.env
    sed -i "s/your_nats_password_here/$NATS_PASSWORD/g" monitoring-and-rules/tazama-rule-exec/.env
    sed -i "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/tazama-rule-exec/.env
    
    sed -i "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/tazama-rule-studio/.env
    sed -i "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/tazama-rule-studio/.env
    sed -i "s/your_jwt_secret_here/$JWT_SECRET/g" monitoring-and-rules/tazama-rule-studio/.env
    sed -i "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/tazama-rule-studio/.env
    
    sed -i "s/your_database_password_here/$DB_PASSWORD/g" monitoring-and-rules/case-management/.env
    sed -i "s/your_redis_password_here/$REDIS_PASSWORD/g" monitoring-and-rules/case-management/.env
    sed -i "s/your_jwt_secret_here/$JWT_SECRET/g" monitoring-and-rules/case-management/.env
    sed -i "s/your_api_key_here/$(openssl rand -hex 16 2>/dev/null || echo "dev-api-key")/g" monitoring-and-rules/case-management/.env
fi

echo "✓ All .env files updated with secure keys"
echo ""

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p payment-system/hyperswitch/config
mkdir -p payment-system/killbill/config
mkdir -p monitoring-and-rules/tazama-rule-exec/rules
echo "✓ Directories created"
echo ""

# Set executable permissions for scripts
echo "Setting executable permissions..."
chmod +x event-bus/nats/scripts/init-streams.sh 2>/dev/null || true
chmod +x scripts/setup.sh 2>/dev/null || true
echo "✓ Permissions set"
echo ""

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Get your Paystack API keys from https://dashboard.paystack.com/#/settings/developer"
echo ""
echo "2. Update the following .env files with your Paystack credentials:"
echo "   - .env"
echo "   - payment-system/hyperswitch/.env"
echo "   - payment-system/killbill/.env"
echo "   - payment-system/nats-kb-bridge/.env"
echo "   - monitoring-and-rules/.env"
echo "   - monitoring-and-rules/tazama-rule-exec/.env"
echo ""
echo "3. Start the platform:"
echo "   make up"
echo ""
echo "4. Initialize NATS streams:"
echo "   ./event-bus/nats/scripts/init-streams.sh"
echo ""
echo "5. Test the platform:"
echo "   make test-flow"
echo ""
echo "6. Access the services:"
echo "   - Traefik Dashboard: http://localhost:8080"
echo "   - NATS Monitoring: http://localhost:8222"
echo "   - Hyperswitch API: http://localhost:8081"
echo "   - Kill Bill API: http://localhost:8082"
echo "   - Tazama Rule Studio: http://localhost:3000"
echo "   - Case Management: http://localhost:3001"
echo ""
echo "For more information, see README.md"