# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in OpenPay, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email**: Send details to security@openpay.dev
2. **Subject**: Include `[SECURITY]` in the subject line
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Assessment**: We'll evaluate the severity within 5 business days
- **Fix Timeline**: Critical vulnerabilities will be patched within 30 days
- **Disclosure**: We'll coordinate with you on public disclosure timing

## Security Measures

### Authentication
- API keys are required for all Hyperswitch API calls
- Dashboard uses Kinde for user authentication with OAuth2/OIDC support
- JWT tokens are used for service-to-service communication

### Data Protection
- Card data is tokenized by Hyperswitch and never stored in merchant databases
- All secrets are stored in environment variables (never hardcoded)
- TLS encryption for all external traffic

### Infrastructure
- Docker network isolation between services
- Rate limiting on public endpoints via Traefik
- Regular dependency vulnerability scanning (Dependabot + OSV Scanner)
- Container image scanning with Trivy

### Compliance
- PCI DSS compliant architecture when properly configured
- No raw card numbers stored in the application
- Audit logging for all payment state transitions

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | ✅ Yes    |
| < Latest | ❌ No    |

## Security Updates

Security patches are released as soon as possible. Subscribe to repository notifications to stay informed about security updates.

## Acknowledgments

We thank security researchers who responsibly disclose vulnerabilities. Your contributions help make OpenPay safer for everyone.
