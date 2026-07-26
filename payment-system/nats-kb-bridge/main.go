package main

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nats-io/nats.go"
	"go.uber.org/zap"
)

type Config struct {
	NATSURL              string `yaml:"nats_url"`
	NATSUser             string `yaml:"nats_user"`
	NATSPassword         string `yaml:"nats_password"`
	NATSStream           string `yaml:"nats_stream"`
	NATSConsumer         string `yaml:"nats_consumer"`
	KillBillAPIURL       string `yaml:"killbill_api_url"`
	KillBillAPIKey       string `yaml:"killbill_api_key"`
	KillBillAPISecret    string `yaml:"killbill_api_secret"`
	PaystackSecretKey    string `yaml:"paystack_secret_key"`
	PaystackWebhookSecret string `yaml:"paystack_webhook_secret"`
	Workers              int    `yaml:"bridge_workers"`
	BatchSize            int    `yaml:"bridge_batch_size"`
	AckTimeout           time.Duration `yaml:"ack_timeout"`
	MaxRetries           int    `yaml:"max_retries"`
	HealthCheckPort      int    `yaml:"health_check_port"`
}

type PaymentEvent struct {
	ID             string          `json:"id"`
	Type           string          `json:"type"`
	Source         string          `json:"source"`
	SpecVersion    string          `json:"specversion"`
	Data           json.RawMessage `json:"data"`
	Time           time.Time       `json:"time"`
	DataContentType string          `json:"datacontenttype"`
}

type PaymentData struct {
	PaymentID    string  `json:"paymentId"`
	CustomerID   string  `json:"customerId"`
	Amount       int64   `json:"amount"`
	Currency     string  `json:"currency"`
	Status       string  `json:"status"`
	PaymentMethod string `json:"paymentMethod"`
	Reference    string  `json:"reference"`
	Authorization *PaystackAuthorization `json:"authorization,omitempty"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
}

type PaystackAuthorization struct {
	AuthorizationCode string `json:"authorization_code"`
	Bin               string `json:"bin"`
	Last4             string `json:"last4"`
	ExpMonth          string `json:"exp_month"`
	ExpYear           string `json:"exp_year"`
	Channel           string `json:"channel"`
	CardType          string `json:"card_type"`
	Bank              string `json:"bank"`
	Reusable          bool   `json:"reusable"`
}

type Bridge struct {
	config        Config
	logger        *zap.Logger
	natsConn      *nats.Conn
	killBillClient *http.Client
}

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()

	config := loadConfig()

	bridge, err := NewBridge(config, logger)
	if err != nil {
		logger.Fatal("Failed to create bridge", zap.Error(err))
	}

	go bridge.startHealthCheck()

	if err := bridge.Start(); err != nil {
		logger.Fatal("Failed to start bridge", zap.Error(err))
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down bridge...")

	if err := bridge.Stop(); err != nil {
		logger.Error("Failed to stop bridge gracefully", zap.Error(err))
	}

	logger.Info("Bridge stopped")
}

func loadConfig() Config {
	return Config{
		NATSURL:              getEnv("NATS_URL", "nats://localhost:4222"),
		NATSUser:             getEnv("NATS_USER", ""),
		NATSPassword:         getEnv("NATS_PASSWORD", ""),
		NATSStream:           getEnv("NATS_STREAM", "PAYMENT_EVENTS"),
		NATSConsumer:         getEnv("NATS_CONSUMER", "payment-processed"),
		KillBillAPIURL:       getEnv("KILLBILL_API_URL", "http://localhost:8080"),
		KillBillAPIKey:       getEnv("KILLBILL_API_KEY", ""),
		KillBillAPISecret:    getEnv("KILLBILL_API_SECRET", ""),
		PaystackSecretKey:    getEnv("PAYSTACK_SECRET_KEY", ""),
		PaystackWebhookSecret: getEnv("PAYSTACK_WEBHOOK_SECRET", ""),
		Workers:              5,
		BatchSize:            10,
		AckTimeout:           30 * time.Second,
		MaxRetries:           3,
		HealthCheckPort:      8081,
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func NewBridge(config Config, logger *zap.Logger) (*Bridge, error) {
	natsConn, err := nats.Connect(config.NATSURL,
		nats.UserInfo(config.NATSUser, config.NATSPassword),
		nats.ReconnectWait(2*time.Second),
		nats.MaxReconnects(10),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to NATS: %w", err)
	}

	killBillClient := &http.Client{
		Timeout: 30 * time.Second,
	}

	return &Bridge{
		config:         config,
		logger:         logger,
		natsConn:       natsConn,
		killBillClient: killBillClient,
	}, nil
}

func (b *Bridge) Start() error {
	b.logger.Info("Starting NATS-KB Bridge for Paystack",
		zap.String("stream", b.config.NATSStream),
		zap.String("consumer", b.config.NATSConsumer),
		zap.Int("workers", b.config.Workers),
	)

	js, err := b.natsConn.JetStream()
	if err != nil {
		return fmt.Errorf("failed to get JetStream context: %w", err)
	}

	_, err = js.Subscribe(b.config.NATSStream, b.handleMessage,
		nats.Durable(b.config.NATSConsumer),
		nats.ManualAck(),
		nats.AckWait(b.config.AckTimeout),
		nats.MaxDeliver(b.config.MaxRetries),
		nats.DeliverAll(),
	)
	if err != nil {
		return fmt.Errorf("failed to subscribe to stream: %w", err)
	}

	b.logger.Info("Subscribed to NATS stream", zap.String("subject", b.config.NATSStream))

	select {}
}

func (b *Bridge) Stop() error {
	b.logger.Info("Stopping NATS-KB Bridge")
	b.natsConn.Close()
	return nil
}

func (b *Bridge) handleMessage(msg *nats.Msg) {
	b.logger.Info("Received message",
		zap.String("subject", msg.Subject),
		zap.Int("data_len", len(msg.Data)),
	)

	var event PaymentEvent
	if err := json.Unmarshal(msg.Data, &event); err != nil {
		b.logger.Error("Failed to parse event", zap.Error(err))
		msg.Nak()
		return
	}

	if err := b.processEvent(event); err != nil {
		b.logger.Error("Failed to process event",
			zap.String("event_id", event.ID),
			zap.Error(err),
		)
		msg.Nak()
		return
	}

	if err := msg.Ack(); err != nil {
		b.logger.Error("Failed to acknowledge message", zap.Error(err))
	}
}

func (b *Bridge) processEvent(event PaymentEvent) error {
	b.logger.Info("Processing Paystack payment event",
		zap.String("event_id", event.ID),
		zap.String("event_type", event.Type),
	)

	// Parse payment data
	var paymentData PaymentData
	if err := json.Unmarshal(event.Data, &paymentData); err != nil {
		return fmt.Errorf("failed to parse payment data: %w", err)
	}

	// Verify Paystack transaction if needed
	if b.config.PaystackSecretKey != "" && paymentData.Reference != "" {
		verified, err := b.verifyPaystackTransaction(paymentData.Reference)
		if err != nil {
			b.logger.Warn("Failed to verify Paystack transaction",
				zap.String("reference", paymentData.Reference),
				zap.Error(err),
			)
		} else if !verified {
			b.logger.Warn("Paystack transaction verification failed",
				zap.String("reference", paymentData.Reference),
			)
		}
	}

	// Sync with Kill Bill based on event type
	switch event.Type {
	case "payments.charge.completed":
		return b.syncPaymentToKillBill(paymentData)
	case "payments.charge.failed":
		return b.handleFailedPayment(paymentData)
	case "payments.refund.completed":
		return b.syncRefundToKillBill(paymentData)
	default:
		b.logger.Info("Unhandled event type", zap.String("type", event.Type))
	}

	return nil
}

func (b *Bridge) verifyPaystackTransaction(reference string) (bool, error) {
	req, err := http.NewRequest("GET",
		fmt.Sprintf("https://api.paystack.co/transaction/verify/%s", reference),
		nil)
	if err != nil {
		return false, err
	}

	req.Header.Set("Authorization", "Bearer "+b.config.PaystackSecretKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := b.killBillClient.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	var result struct {
		Status  bool `json:"status"`
		Data    struct {
			Status string `json:"status"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}

	return result.Status && result.Data.Status == "success", nil
}

func (b *Bridge) syncPaymentToKillBill(paymentData PaymentData) error {
	b.logger.Info("Syncing payment to Kill Bill",
		zap.String("payment_id", paymentData.PaymentID),
		zap.Int64("amount", paymentData.Amount),
		zap.String("currency", paymentData.Currency),
	)

	// TODO: Implement Kill Bill payment sync
	// This would typically:
	// 1. Create/update payment in Kill Bill
	// 2. Link to subscription if applicable
	// 3. Update invoice status

	return nil
}

func (b *Bridge) handleFailedPayment(paymentData PaymentData) error {
	b.logger.Info("Handling failed payment",
		zap.String("payment_id", paymentData.PaymentID),
	)

	// TODO: Implement failed payment handling
	// This would typically:
	// 1. Update payment status in Kill Bill
	// 2. Trigger retry logic if applicable
	// 3. Send notification to customer

	return nil
}

func (b *Bridge) syncRefundToKillBill(paymentData PaymentData) error {
	b.logger.Info("Syncing refund to Kill Bill",
		zap.String("payment_id", paymentData.PaymentID),
		zap.Int64("amount", paymentData.Amount),
	)

	// TODO: Implement Kill Bill refund sync
	// This would typically:
	// 1. Create refund in Kill Bill
	// 2. Update invoice balance
	// 3. Process credit note if applicable

	return nil
}

func (b *Bridge) startHealthCheck() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	addr := fmt.Sprintf(":%d", b.config.HealthCheckPort)
	b.logger.Info("Starting health check server", zap.String("addr", addr))

	if err := http.ListenAndServe(addr, nil); err != nil && err != http.ErrServerClosed {
		b.logger.Error("Health check server failed", zap.Error(err))
	}
}

// VerifyPaystackWebhookSignature verifies the webhook signature from Paystack
func VerifyPaystackWebhookSignature(payload []byte, signature, secret string) bool {
	hash := hmac.New(sha512.New, []byte(secret))
	hash.Write(payload)
	expectedSignature := hex.EncodeToString(hash.Sum(nil))
	return hmac.Equal([]byte(signature), []byte(expectedSignature))
}