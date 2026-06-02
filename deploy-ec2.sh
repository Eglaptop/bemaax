#!/bin/bash

# =============================================================================
#  EGLAPTOP TECHNOLOGY — AWS EC2 Full Deployment Script
#  Amazon Linux 2 / Amazon Linux 2023 | Next.js 16 | Docker | Nginx | SSL
#
#  Usage:
#    chmod +x deploy-ec2.sh
#    sudo ./deploy-ec2.sh
#
#  After running, your app will be live at:
#    http://ec2-35-158-27-246.eu-central-1.compute.amazonaws.com
# =============================================================================

set -e  # Exit immediately on any error

# ─── CONFIGURATION ────────────────────────────────────────────────────────────
DOMAIN="ec2-35-158-27-246.eu-central-1.compute.amazonaws.com"
APP_DIR="/var/www/eglaptop"
APP_PORT=3000
NODE_VERSION=20
APP_NAME="eglaptop"
APP_USER="ec2-user"
USE_DOCKER=false   # ← Set to "true" to use Docker instead of PM2
USE_SSL=false      # ← Set to "true" only when you have a real domain (not EC2 hostname)
EMAIL="admin@eglaptop.com"

# ─── DETECT AMAZON LINUX VERSION ──────────────────────────────────────────────
if grep -q "Amazon Linux 2023" /etc/os-release 2>/dev/null; then
  AL_VERSION=2023
  PKG_MGR="dnf"
elif grep -q "Amazon Linux 2" /etc/os-release 2>/dev/null; then
  AL_VERSION=2
  PKG_MGR="yum"
else
  AL_VERSION=2023
  PKG_MGR="dnf"
fi

# ─── COLORS ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log()     { echo -e "${GREEN}[✔] $1${NC}"; }
info()    { echo -e "${BLUE}[ℹ] $1${NC}"; }
warn()    { echo -e "${YELLOW}[⚠] $1${NC}"; }
error()   { echo -e "${RED}[✖] $1${NC}"; exit 1; }
section() { echo -e "\n${CYAN}══════════════════════════════════════════${NC}";
            echo -e "${CYAN}  $1${NC}";
            echo -e "${CYAN}══════════════════════════════════════════${NC}\n"; }

# ─── ROOT CHECK ───────────────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  error "Run as root: sudo ./deploy-ec2.sh"
fi

info "Detected: Amazon Linux $AL_VERSION (package manager: $PKG_MGR)"

# =============================================================================
# STEP 1 — SYSTEM UPDATE & ESSENTIAL PACKAGES
# =============================================================================
section "STEP 1 — System Update & Essential Packages"

$PKG_MGR update -y
$PKG_MGR install -y \
  curl \
  wget \
  git \
  unzip \
  tar \
  gcc \
  gcc-c++ \
  make \
  openssl \
  openssl-devel \
  htop

log "System packages installed"

# =============================================================================
# STEP 2 — NODE.JS INSTALLATION
# =============================================================================
section "STEP 2 — Node.js ${NODE_VERSION} Installation"

if command -v node &>/dev/null; then
  warn "Node.js already installed: $(node -v)"
else
  curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | bash -
  $PKG_MGR install -y nodejs
  log "Node.js $(node -v) installed"
fi

npm install -g npm@latest
log "npm updated: $(npm -v)"

# =============================================================================
# STEP 3 — PM2 PROCESS MANAGER
# =============================================================================
section "STEP 3 — PM2 Process Manager"

npm install -g pm2
pm2 startup systemd -u $APP_USER --hp /home/$APP_USER || true
log "PM2 installed: $(pm2 -v)"

# =============================================================================
# STEP 4 — DOCKER
# =============================================================================
section "STEP 4 — Docker"

if command -v docker &>/dev/null; then
  warn "Docker already installed: $(docker -v)"
else
  if [[ $AL_VERSION == "2" ]]; then
    amazon-linux-extras install docker -y
  else
    $PKG_MGR install -y docker
  fi

  systemctl start docker
  systemctl enable docker
  usermod -aG docker $APP_USER
  log "Docker installed: $(docker -v)"
fi

# Docker Compose plugin
if ! docker compose version &>/dev/null 2>&1; then
  COMPOSE_VERSION="2.27.0"
  mkdir -p /usr/local/lib/docker/cli-plugins
  curl -SL "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-linux-x86_64" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose
  chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
  log "Docker Compose installed: $(docker compose version)"
fi

# =============================================================================
# STEP 5 — NGINX INSTALLATION & CONFIGURATION
# =============================================================================
section "STEP 5 — Nginx Installation & Configuration"

if [[ $AL_VERSION == "2" ]]; then
  amazon-linux-extras install nginx1 -y
else
  $PKG_MGR install -y nginx
fi

systemctl start nginx
systemctl enable nginx
log "Nginx installed and started"

# ── Create Nginx config directory structure ───────────────────────────────────
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# ── Add sites-enabled include to nginx.conf if not already there ─────────────
if ! grep -q "sites-enabled" /etc/nginx/nginx.conf; then
  sed -i '/http {/a \    include /etc/nginx/sites-enabled/*.conf;' /etc/nginx/nginx.conf
fi

# ── Write Nginx reverse proxy config ─────────────────────────────────────────
cat > /etc/nginx/sites-available/eglaptop.conf << NGINX_CONF
# ─── Rate limiting zone ────────────────────────────────────────────────────────
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;

# ─── Upstream Next.js ─────────────────────────────────────────────────────────
upstream nextjs_upstream {
    server 127.0.0.1:${APP_PORT};
    keepalive 64;
}

# ─── HTTP Server ──────────────────────────────────────────────────────────────
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} _;

    # ACME challenge for SSL (future use)
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json
               application/javascript application/rss+xml
               application/atom+xml image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Client upload limit
    client_max_body_size 50M;

    # Next.js static assets — long cache
    location /_next/static/ {
        proxy_pass http://nextjs_upstream;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public assets
    location /public/ {
        proxy_pass http://nextjs_upstream;
        add_header Cache-Control "public, max-age=86400";
    }

    # API routes — rate limited
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Main app proxy
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX_CONF

# Enable the site
ln -sf /etc/nginx/sites-available/eglaptop.conf /etc/nginx/sites-enabled/eglaptop.conf

# Test Nginx config
nginx -t && log "Nginx config valid ✔" || error "Nginx config has errors!"
systemctl reload nginx

# =============================================================================
# STEP 6 — APACHE (httpd) — PORT 8080 AS ALTERNATIVE
# =============================================================================
section "STEP 6 — Apache (httpd) on port 8080"

$PKG_MGR install -y httpd mod_ssl
systemctl start httpd
systemctl enable httpd

# Change Apache to port 8080
sed -i 's/^Listen 80$/Listen 8080/' /etc/httpd/conf/httpd.conf

# Enable proxy modules
cat > /etc/httpd/conf.d/eglaptop.conf << APACHE_CONF
# ─── EGLAPTOP Apache Config (port 8080) ───────────────────────────────────────
<VirtualHost *:8080>
    ServerName ${DOMAIN}

    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass / http://127.0.0.1:${APP_PORT}/
    ProxyPassReverse / http://127.0.0.1:${APP_PORT}/

    # WebSocket support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) ws://127.0.0.1:${APP_PORT}/\$1 [P,L]

    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"

    ErrorLog /var/log/httpd/eglaptop-error.log
    CustomLog /var/log/httpd/eglaptop-access.log combined
</VirtualHost>
APACHE_CONF

# Enable required modules
cat > /etc/httpd/conf.modules.d/00-proxy.conf << 'PROXY_CONF'
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
PROXY_CONF

httpd -t && systemctl restart httpd && log "Apache started on port 8080"

# =============================================================================
# STEP 7 — FIREWALL (firewalld)
# =============================================================================
section "STEP 7 — Firewall"

if systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-service=http
  firewall-cmd --permanent --add-service=https
  firewall-cmd --permanent --add-service=ssh
  firewall-cmd --permanent --add-port=8080/tcp
  firewall-cmd --permanent --add-port=3000/tcp
  firewall-cmd --reload
  firewall-cmd --list-all
  log "firewalld configured"
else
  warn "firewalld not running — relying on AWS Security Groups (that's fine)"
fi

# =============================================================================
# STEP 8 — APP DIRECTORY SETUP
# =============================================================================
section "STEP 8 — App Directory Setup"

mkdir -p "$APP_DIR"
chown -R $APP_USER:$APP_USER "$APP_DIR"
log "App directory ready: $APP_DIR"

# =============================================================================
# STEP 9 — BUILD & START NEXT.JS APP
# =============================================================================
section "STEP 9 — Build & Start Next.js App"

if [[ -f "${APP_DIR}/package.json" ]]; then
  info "Installing dependencies..."
  cd "$APP_DIR"
  sudo -u $APP_USER npm install

  info "Building Next.js app..."
  sudo -u $APP_USER npm run build

  if [[ "$USE_DOCKER" == "true" ]]; then
    info "Starting with Docker Compose..."
    cd "$APP_DIR"
    sudo -u $APP_USER docker compose up -d --build
    log "App running via Docker"
  else
    info "Starting with PM2..."
    sudo -u $APP_USER pm2 delete "$APP_NAME" 2>/dev/null || true
    sudo -u $APP_USER pm2 start "npm run start" --name "$APP_NAME" --cwd "$APP_DIR"
    sudo -u $APP_USER pm2 save
    log "App running via PM2 as '$APP_NAME'"
  fi
else
  warn "No package.json in ${APP_DIR} yet."
  warn "Project files not uploaded. After uploading, run:"
  warn "  cd ${APP_DIR} && npm install && npm run build"
  warn "  pm2 start 'npm run start' --name eglaptop"
fi

# =============================================================================
# STEP 10 — CERTBOT / SSL (Only if USE_SSL=true and real domain)
# =============================================================================
section "STEP 10 — SSL Certificate (Let's Encrypt)"

if [[ "$USE_SSL" == "true" ]]; then
  $PKG_MGR install -y python3 python3-pip augeas-libs
  pip3 install certbot certbot-nginx

  mkdir -p /var/www/certbot

  certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" || warn "SSL failed — make sure DNS is pointing to this server."

  # Auto-renewal cron
  (crontab -l 2>/dev/null; echo "0 */12 * * * /usr/local/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
  log "SSL installed + auto-renewal cron set"
else
  info "Skipping SSL (USE_SSL=false)"
  info "App is accessible via HTTP on port 80"
fi

# =============================================================================
# STEP 11 — VERIFY SERVICES
# =============================================================================
section "STEP 11 — Services Status"

echo ""
systemctl status nginx --no-pager | grep -E "Active|Loaded" && log "Nginx: OK"
systemctl status httpd --no-pager | grep -E "Active|Loaded" && log "Apache: OK"
systemctl status docker --no-pager | grep -E "Active|Loaded" && log "Docker: OK"

if sudo -u $APP_USER pm2 list 2>/dev/null | grep -q "$APP_NAME"; then
  log "PM2 '$APP_NAME': RUNNING"
else
  warn "PM2 '$APP_NAME': not started yet (upload project files first)"
fi

# =============================================================================
# STEP 12 — USEFUL COMMANDS REFERENCE
# =============================================================================
section "STEP 12 — Reference Commands"

cat << REFERENCE

${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}
  EGLAPTOP — COMMANDS CHEATSHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 PM2:
  pm2 status                     Show all processes
  pm2 logs eglaptop              Live logs
  pm2 restart eglaptop           Restart app
  pm2 stop eglaptop              Stop app

🐳 Docker:
  docker compose up -d --build   Start/rebuild
  docker compose down            Stop
  docker compose logs -f         Live logs
  docker ps                      Running containers

🌐 Nginx:
  nginx -t                       Test config
  systemctl reload nginx         Reload (no downtime)
  tail -f /var/log/nginx/error.log

🌐 Apache (port 8080):
  httpd -t                       Test config
  systemctl reload httpd         Reload
  tail -f /var/log/httpd/eglaptop-error.log

📁 Locations:
  App:    ${APP_DIR}
  Nginx:  /etc/nginx/sites-available/eglaptop.conf
  Apache: /etc/httpd/conf.d/eglaptop.conf

🔄 Deploy Updates:
  cd ${APP_DIR}
  git pull
  npm install && npm run build
  pm2 restart eglaptop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REFERENCE

# =============================================================================
# DONE
# =============================================================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     ✅  EGLAPTOP EC2 DEPLOYMENT COMPLETE!                    ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  🌐  http://${DOMAIN}  ║${NC}"
echo -e "${GREEN}║  🌐  http://${DOMAIN}:8080 (Apache) ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  ⚠  NEXT STEPS:                                              ║${NC}"
echo -e "${GREEN}║  1. Upload project files to ${APP_DIR}              ║${NC}"
echo -e "${GREEN}║  2. Copy .env.local with your API keys                       ║${NC}"
echo -e "${GREEN}║  3. Copy firebase-applet-config.json                         ║${NC}"
echo -e "${GREEN}║  4. Run: cd ${APP_DIR} && npm install && npm run build  ║${NC}"
echo -e "${GREEN}║  5. Run: pm2 start 'npm run start' --name eglaptop          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
