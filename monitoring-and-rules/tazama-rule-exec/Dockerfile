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
RUN CGO_ENABLED=0 GOOS=linux go build -o tazama-rule-exec .

# Runtime stage
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user
RUN addgroup -S tazama && adduser -S tazama -G tazama

# Copy the binary from builder
COPY --from=builder /app/tazama-rule-exec /usr/local/bin/

# Create rules directory
RUN mkdir -p /etc/tazama/rules && chown -R tazama:tazama /etc/tazama

# Switch to non-root user
USER tazama

EXPOSE 8080

ENTRYPOINT ["tazama-rule-exec"]