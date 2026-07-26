# Core Financial Platform

A self-hosted, production-ready financial platform with environment isolation, build context, shared event contracts, and Traefik edge routing.

## Architecture Overview

This platform follows a microservices architecture with clear domain boundaries:

- **Edge Proxy (Traefik)**: Handles public ingress, SSL/TLS termination, and routes incoming webhooks/APIs
- **Event Bus (NATS JetStream)**: Asynchronous event-driven communication between services
- **Payment System**: Core payment processing (Hyperswitch) and subscription billing (Kill Bill)
- **Monitoring & Rules**: Fraud detection, rule evaluation, and case management

## Directory Structure

```
core-financial-platform/
├── .env.example                    # Master deployment environment template
├── docker-compose.yml              # Root orchestration file
├── Makefile                        # Local dev shortcuts
│
├── shared/                         # Shared schemas & contract definitions
│   └── schemas/                    # CloudEvents JSON schemas
│
├── proxy/                          # Edge Reverse Proxy & TLS Routing
│   └── traefik/                    # Traefik configuration
│
├── event-bus/                      # NATS JetStream Infrastructure
│   └── nats/                       # NATS server configuration
│
├── payment-system/                 # Core Payment & Subscription Engine
│   ├── hyperswitch/                # Payment orchestration (Rust)
│   ├── killbill/                   # Subscription & billing (Java)
│   └── nats-kb-bridge/            # Reconciliation bridge (Go)
│
└── monitoring-and-rules/           # Fraud Detection & Rule Evaluation
    ├── tazama-auth/                # Authentication service
    ├── tazama-rule-exec/           # Rule execution engine
    ├── tazama-rule-studio/         # Rule authoring UI
    └── case-management/            # Analyst dashboard
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (optional, for development shortcuts)

### 1. Clone and Configure

```bash
# Copy environment files
cp .env.example .env

# Copy environment files for each service
cp event-bus/.env.example event-bus/.env
cp payment-system/hyperswitch/.env.example payment-system/hyperswitch/.env
cp payment-system/killbill/.env.example payment-system/killbill/.env
cp payment-system/nats-kb-bridge/.env.example payment-system/nats-kb-bridge/.env
cp monitoring-and-rules/.env.example monitoring-and-rules/.env
cp monitoring-and-rules/tazama-auth/.env.example monitoring-and-rules/tazama-auth/.env
cp monitoring-and-rules/tazama-rule-exec/.env.example monitoring-and-rules/tazama-rule-exec/.env
cp monitoring-and-rules/tazama-rule-studio/.env.example monitoring-and-rules/tazama-rule-studio/.env
cp monitoring-and-rules/case-management/.env.example monitoring-and-rules/case-management/.env

# Edit .env files with your actual configuration values
```

### 2. Start the Platform

```bash
# Start all services
make up

# Or using Docker Compose directly
docker compose up -d
```

### 3. Initialize NATS JetStream

```bash
# Run the initialization script
./event-bus/nats/scripts/init-streams.sh
```

### 4. Access Services

- **Traefik Dashboard**: http://localhost:8080
- **NATS Monitoring**: http://localhost:8222
- **Hyperswitch API**: http://localhost:8080
- **Kill Bill API**: http://localhost:8081
- **Tazama Rule Studio**: http://localhost:3000
- **Case Management**: http://localhost:3001

## Development

### Using Make Commands

```bash
# Show all available commands
make help

# Start all services in background
make up

# View logs from all services
make logs

# Test payment flow
make test-flow

# Stop all services
make down

# Clean up (remove containers, volumes, networks)
make clean

# Rebuild all services
make build
```

### Individual Service Management

```bash
# Start only specific services
make proxy-up
make nats-up
make hyperswitch-up
make killbill-up
make tazama-up
```

## Event Schema

All events follow the CloudEvents specification:

### Payment Events

```json
{
  "specversion": "1.0",
  "id": "uuid",
  "source": "urn:core-financial:payment-system",
  "type": "payments.charge.completed",
  "time": "2024-01-01T00:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "paymentId": "uuid",
    "amount": 1000,
    "currency": "USD",
    "status": "completed"
  }
}
```

### Dead Letter Events

```json
{
  "specversion": "1.0",
  "id": "uuid",
  "source": "urn:core-financial:event-bus",
  "type": "dlq.event.failed",
  "time": "2024-01-01T00:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "originalEvent": {},
    "error": {
      "message": "Processing failed",
      "code": "PROCESSING_ERROR"
    },
    "retryCount": 3
  }
}
```

## Security Considerations

- Each service has its own environment file to prevent credential bleed
- Traefik handles SSL/TLS termination and security headers
- NATS uses authentication for client connections
- JWT tokens are used for service-to-service communication
- All sensitive configuration is stored in environment variables

## Production Deployment

### 1. Update Environment Variables

- Set strong passwords for all services
- Configure proper SSL certificates in Traefik
- Update NATS authentication credentials
- Set up proper database connections

### 2. Enable HTTPS

Edit `proxy/traefik/dynamic/tls.yml` to configure your SSL certificates.

### 3. Configure Persistence

Update Docker Compose volumes for production storage requirements.

### 4. Monitoring

- Enable metrics collection in each service
- Set up log aggregation
- Configure alerting for critical events

## Troubleshooting

### Service Won't Start

```bash
# Check service logs
docker compose logs <service-name>

# Check service status
docker compose ps
```

### NATS Connection Issues

```bash
# Verify NATS is running
docker compose ps nats

# Check NATS logs
docker compose logs nats

# Test NATS connection
nats server info --server nats://localhost:4222
```

### Database Connection Issues

```bash
# Check database container
docker compose ps postgres

# Verify database is accessible
docker compose exec postgres psql -U postgres -l
```

## Contributing

1. Follow the existing code structure
2. Add environment variables to `.env.example` files
3. Update documentation for any new services
4. Test changes locally before submitting

## License

See LICENSE file for details.