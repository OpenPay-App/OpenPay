.PHONY: help up down logs test-flow test-payment clean build

# Default target
help: ## Show this help message
	@echo "Core Financial Platform - Development Shortcuts"
	@echo "================================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start all services in background
	docker compose up -d

down: ## Stop all services
	docker compose down

logs: ## View logs from all services
	docker compose logs -f

test-flow: ## Test payment flow end-to-end
	@echo "Testing payment flow..."
	@echo "1. Creating test customer..."
	@curl -s -X POST http://localhost:8081/customers \
		-H "Content-Type: application/json" \
		-H "api-key: your_hyperswitch_api_key" \
		-d '{"email": "test@example.com", "name": "Test User"}' | jq .
	@echo ""
	@echo "2. Initializing payment..."
	@curl -s -X POST http://localhost:8081/payments \
		-H "Content-Type: application/json" \
		-H "api-key: your_hyperswitch_api_key" \
		-d '{
			"amount": 500000,
			"currency": "NGN",
			"payment_method": "card",
			"connector": "paystack",
			"billing": {
				"email": "test@example.com"
			},
			"confirmation": "automatic"
		}' | jq .
	@echo ""
	@echo "3. Check NATS monitoring at http://localhost:8222"
	@echo "4. Check Kill Bill dashboard at http://localhost:8082"
	@echo "5. Check Tazama Rule Studio at http://localhost:3000"

test-webhook: ## Test Paystack webhook endpoint
	@echo "Testing Paystack webhook endpoint..."
	@curl -s -X POST http://localhost/webhooks/paystack \
		-H "Content-Type: application/json" \
		-H "X-Webhook-Secret: your_webhook_secret_here" \
		-d '{
			"event": "charge.success",
			"data": {
				"id": 1234567890,
				"reference": "test_ref_123",
				"amount": 500000,
				"currency": "NGN",
				"status": "success",
				"authorization": {
					"authorization_code": "AUTH_xxxxxxxx",
					"bin": "408800",
					"last4": "4081",
					"exp_month": "10",
					"exp_year": "2025",
					"channel": "card",
					"card_type": "visa",
					"bank": "TEST BANK"
				},
				"customer": {
					"email": "test@example.com",
					"first_name": "Test",
					"last_name": "User"
				}
			}
		}' | jq .

clean: ## Remove all containers, volumes, and networks
	docker compose down -v --remove-orphans

build: ## Rebuild all services
	docker compose build --no-cache

# Individual service targets
proxy-up: ## Start only the proxy service
	docker compose up -d proxy

nats-up: ## Start only NATS JetStream
	docker compose up -d nats

hyperswitch-up: ## Start only Hyperswitch
	docker compose up -d hyperswitch

killbill-up: ## Start only Kill Bill
	docker compose up -d killbill

tazama-up: ## Start only Tazama services
	docker compose up -d tazama-auth tazama-rule-exec tazama-rule-studio case-management

# Database management
db-shell: ## Connect to PostgreSQL shell
	docker compose exec postgres psql -U coreplatform -d hyperswitch

redis-shell: ## Connect to Redis shell
	docker compose exec redis redis-cli -a localdev123

# Monitoring
nats-monitor: ## Open NATS monitoring
	@echo "NATS Monitoring: http://localhost:8222"

killbill-admin: ## Open Kill Bill admin
	@echo "Kill Bill Admin: http://localhost:8082"
	@echo "Default credentials: admin / password"

# Initialize NATS streams
init-streams: ## Initialize NATS JetStream streams
	./event-bus/nats/scripts/init-streams.sh

# Paystack specific
paystack-test: ## Run Paystack integration test
	@echo "Running Paystack integration test..."
	@echo "1. Verify API keys are configured in .env"
	@echo "2. Test transaction initialization..."
	@curl -s -X POST https://api.paystack.co/transaction/initialize \
		-H "Authorization: Bearer $(PAYSTACK_SECRET_KEY)" \
		-H "Content-Type: application/json" \
		-d '{
			"email": "test@example.com",
			"amount": 500000,
			"currency": "NGN",
			"reference": "test_ref_$(date +%s)"
		}' | jq .