#!/bin/bash

# NATS JetStream Initialization Script
# This script creates the required streams and consumers for the Core Financial Platform

set -e

NATS_URL="${NATS_URL:-nats://localhost:4222}"

echo "Initializing NATS JetStream streams..."

# Wait for NATS to be ready
echo "Waiting for NATS to be ready..."
until nats server info --server "$NATS_URL" > /dev/null 2>&1; do
    sleep 1
done

echo "NATS is ready. Creating streams..."

# Payment Events Stream
echo "Creating PAYMENT_EVENTS stream..."
nats stream add PAYMENT_EVENTS \
    --server "$NATS_URL" \
    --subjects="payments.>" \
    --storage=file \
    --retention=limits \
    --max-msgs=-1 \
    --max-bytes=-1 \
    --max-age=72h \
    --max-msg-size=1048576 \
    --discard=old \
    --replicas=1 \
    --defaults

# Dead Letter Queue Stream
echo "Creating DLQ_EVENTS stream..."
nats stream add DLQ_EVENTS \
    --server "$NATS_URL" \
    --subjects="dlq.>" \
    --storage=file \
    --retention=limits \
    --max-msgs=-1 \
    --max-bytes=-1 \
    --max-age=168h \
    --max-msg-size=1048576 \
    --discard=old \
    --replicas=1 \
    --defaults

# Payment Processed Consumer
echo "Creating payment-processed consumer..."
nats consumer add PAYMENT_EVENTS payment-processed \
    --server "$NATS_URL" \
    --filter="payments.charge.completed" \
    --deliver=all \
    --ack=explicit \
    --max-deliver=3 \
    --ack-wait=30s \
    --defaults

# Fraud Detection Consumer
echo "Creating fraud-detection consumer..."
nats consumer add PAYMENT_EVENTS fraud-detection \
    --server "$NATS_URL" \
    --filter="payments.>" \
    --deliver=all \
    --ack=explicit \
    --max-deliver=1 \
    --defaults

echo "NATS JetStream initialization complete!"
echo "Streams created: PAYMENT_EVENTS, DLQ_EVENTS"
echo "Consumers created: payment-processed, fraud-detection"