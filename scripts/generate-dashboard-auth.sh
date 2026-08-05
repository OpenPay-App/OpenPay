#!/bin/bash
# =============================================================================
# Generate Traefik Dashboard Basic Auth Credentials
# =============================================================================
# This script generates an htpasswd hash for the Traefik dashboard Basic Auth.
#
# Usage:
#   ./scripts/generate-dashboard-auth.sh [username] [password]
#
# Examples:
#   ./scripts/generate-dashboard-auth.sh admin mypassword
#   ./scripts/generate-dashboard-auth.sh  # Uses defaults: admin / openpay
#
# The output can be used in:
#   1. proxy/traefik/dynamic/tls.yml (dashboard-auth middleware)
#   2. Traefik dashboard configuration
# =============================================================================

set -e

# Default values
DEFAULT_USER="admin"
DEFAULT_PASS="openpay"

# Get username and password from arguments or use defaults
USERNAME="${1:-$DEFAULT_USER}"
PASSWORD="${2:-$DEFAULT_PASS}"

echo "============================================="
echo "Traefik Dashboard Basic Auth Generator"
echo "============================================="
echo ""
echo "Username: $USERNAME"
echo ""

# Check if htpasswd is available
if command -v htpasswd &> /dev/null; then
    # Generate hash using htpasswd (Apache)
    HASH=$(htpasswd -nb "$USERNAME" "$PASSWORD")
    echo "Generated hash (htpasswd):"
    echo "$HASH"
    echo ""
    echo "Use this in proxy/traefik/dynamic/tls.yml:"
    echo "  users:"
    echo "    - \"$HASH\""
elif command -v python3 &> /dev/null; then
    # Generate hash using Python
    echo "Generating hash using Python..."
    HASH=$(python3 << 'EOF'
import hashlib
import os

# Generate htpasswd-compatible MD5 hash
username = "$USERNAME"
password = "$PASSWORD"

# Generate random salt
salt = os.urandom(8)

# Create MD5 hash
ctx = hashlib.md5()
ctx.update(password.encode())
ctx.update(username.encode())
ctx.update(b":")
ctx.update(password.encode())
ctx.update(username.encode())
ctx.update(b":")
ctx.update(password.encode())

for i in range(1000):
    ctx.update(password.encode() if i % 2 == 0 else salt)

hash_value = ctx.digest()

# Encode to base64
import base64
table = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
encoded = ""
hash_bytes = list(hash_value)
for i in range(0, 12, 3):
    c1 = hash_bytes[i] >> 2
    c2 = ((hash_bytes[i] & 3) << 4) | (hash_bytes[i + 1] >> 4)
    c3 = ((hash_bytes[i + 1] & 15) << 2) | (hash_bytes[i + 2] >> 6)
    c4 = hash_bytes[i + 2] & 63
    encoded += table[c1] + table[c2] + table[c3] + table[c4]

# Format as htpasswd
print(f"$apr1${salt.hex()}${encoded}")
EOF
)
    echo "Generated hash (apr1):"
    echo "$USERNAME:$HASH"
    echo ""
    echo "Note: For production, use htpasswd or bcrypt for stronger security."
elif command -v openssl &> /dev/null; then
    # Generate using openssl (less secure but available)
    echo "Generating hash using openssl..."
    SALT=$(openssl rand -hex 8)
    HASH=$(openssl passwd -1 -salt "$SALT" "$PASSWORD")
    echo "Generated hash (md5):"
    echo "$HASH"
    echo ""
    echo "Note: For production, use htpasswd for stronger security."
else
    echo "Error: No suitable tool found to generate password hash."
    echo ""
    echo "Please install one of the following:"
    echo "  - apache2-utils (htpasswd): sudo apt-get install apache2-utils"
    echo "  - Python 3: sudo apt-get install python3"
    echo ""
    echo "Or use an online tool: https://www.htaccesstools.com/htpasswd-generator/"
    exit 1
fi

echo ""
echo "============================================="
echo "Instructions:"
echo "============================================="
echo ""
echo "1. Copy the generated hash"
echo "2. Open proxy/traefik/dynamic/dashboard.yml"
echo "3. Find the dashboard-auth middleware"
echo "4. Replace the placeholder with the actual hash:"
echo ""
echo "   dashboard-auth:"
echo "     basicAuth:"
echo "       users:"
echo "         - \"$HASH\""
echo ""
echo "5. Restart Traefik to apply changes"
echo ""
echo "============================================="
echo "Security Notes:"
echo "============================================="
echo ""
echo "- Never use default credentials in production"
echo "- Use a strong, unique password"
echo "- Store credentials securely (not in version control)"
echo "- Consider using environment variables for sensitive data"
echo ""
echo "============================================="
echo "Auto-Update Option:"
echo "============================================="
echo ""
echo "To automatically update dashboard.yml, run:"
echo "  ./scripts/generate-dashboard-auth.sh $USERNAME $PASSWORD --update"
echo ""

# Check if --update flag is provided
if [[ "$3" == "--update" ]]; then
    echo "Updating dashboard.yml..."
    DASHBOARD_FILE="proxy/traefik/dynamic/dashboard.yml"
    
    if [[ -f "$DASHBOARD_FILE" ]]; then
        # Replace the old hash with the new one using a temp file
        TEMP_FILE=$(mktemp)
        # Use awk to replace the hash line (more reliable than sed for complex patterns)
        awk -v newhash="$USERNAME:$HASH" '
        /users:/ { print; next }
        /- "admin:\$apr1\$/ { gsub(/- "admin:\$apr1\$[a-zA-Z0-9\$]*"/, "- \"" newhash "\""); print; next }
        { print }
        ' "$DASHBOARD_FILE" > "$TEMP_FILE"
        mv "$TEMP_FILE" "$DASHBOARD_FILE"
        echo "✅ Updated $DASHBOARD_FILE"
        echo ""
        echo "New credentials:"
        echo "  Username: $USERNAME"
        echo "  Password: $PASSWORD"
        echo ""
        echo "⚠️  Restart Traefik to apply changes"
    else
        echo "❌ Error: $DASHBOARD_FILE not found"
        exit 1
    fi
fi
