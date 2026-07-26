FROM golang:1.21-alpine as builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git

# Copy go mod files first for caching
COPY go.mod go.sum* ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o nats-kb-bridge .

# Runtime stage
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user
RUN addgroup -S bridge && adduser -S bridge -G bridge

# Copy the binary from builder
COPY --from=builder /app/nats-kb-bridge /usr/local/bin/

# Switch to non-root user
USER bridge

EXPOSE 8081

ENTRYPOINT ["nats-kb-bridge"]