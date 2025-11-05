#!/bin/bash

# Sakshi Platform - External Services Configuration Script
# This script helps configure OAuth, S3, Email, and Analytics

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║      Sakshi Platform - Services Configuration Wizard         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env from .env.example"
    else
        touch .env
        print_success "Created new .env file"
    fi
fi

echo "This wizard will help you configure external services."
echo "Press Enter to skip any service you don't want to configure now."
echo ""

# Function to update or add env variable
update_env() {
    local key=$1
    local value=$2
    
    if grep -q "^${key}=" .env; then
        # Update existing
        sed -i "s|^${key}=.*|${key}=${value}|" .env
    else
        # Add new
        echo "${key}=${value}" >> .env
    fi
}

# OAuth Configuration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. OAuth (Manus) Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "Get your OAuth credentials from: https://auth.manus.im"
echo ""

read -p "OAuth Client ID (oauth_xxxxx): " oauth_client_id
if [ ! -z "$oauth_client_id" ]; then
    update_env "OAUTH_CLIENT_ID" "$oauth_client_id"
    
    read -p "OAuth Client Secret: " oauth_client_secret
    update_env "OAUTH_CLIENT_SECRET" "$oauth_client_secret"
    
    read -p "OAuth Redirect URI (https://your-domain.com/auth/callback): " oauth_redirect
    if [ ! -z "$oauth_redirect" ]; then
        update_env "OAUTH_REDIRECT_URI" "$oauth_redirect"
    fi
    
    update_env "OAUTH_ISSUER" "https://auth.manus.im"
    
    print_success "OAuth configured"
else
    print_warning "Skipped OAuth configuration"
fi

echo ""

# S3 Storage Configuration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. S3 Storage Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "Choose your S3 provider:"
echo "  1) AWS S3"
echo "  2) DigitalOcean Spaces"
echo "  3) Cloudflare R2"
echo "  4) Skip"
echo ""

read -p "Select option (1-4): " s3_option

case $s3_option in
    1)
        echo ""
        print_info "AWS S3 Configuration"
        read -p "S3 Bucket Name: " s3_bucket
        read -p "AWS Region (us-east-1): " s3_region
        s3_region=${s3_region:-us-east-1}
        read -p "AWS Access Key ID: " s3_access_key
        read -p "AWS Secret Access Key: " s3_secret_key
        
        update_env "S3_ENDPOINT" "https://s3.${s3_region}.amazonaws.com"
        update_env "S3_REGION" "$s3_region"
        update_env "S3_BUCKET" "$s3_bucket"
        update_env "S3_ACCESS_KEY" "$s3_access_key"
        update_env "S3_SECRET_KEY" "$s3_secret_key"
        
        print_success "AWS S3 configured"
        ;;
    2)
        echo ""
        print_info "DigitalOcean Spaces Configuration"
        read -p "Space Name: " s3_bucket
        read -p "Region (nyc3): " s3_region
        s3_region=${s3_region:-nyc3}
        read -p "Spaces Access Key: " s3_access_key
        read -p "Spaces Secret Key: " s3_secret_key
        
        update_env "S3_ENDPOINT" "https://${s3_region}.digitaloceanspaces.com"
        update_env "S3_REGION" "$s3_region"
        update_env "S3_BUCKET" "$s3_bucket"
        update_env "S3_ACCESS_KEY" "$s3_access_key"
        update_env "S3_SECRET_KEY" "$s3_secret_key"
        
        print_success "DigitalOcean Spaces configured"
        ;;
    3)
        echo ""
        print_info "Cloudflare R2 Configuration"
        read -p "Bucket Name: " s3_bucket
        read -p "Account ID: " cf_account_id
        read -p "R2 Access Key ID: " s3_access_key
        read -p "R2 Secret Access Key: " s3_secret_key
        
        update_env "S3_ENDPOINT" "https://${cf_account_id}.r2.cloudflarestorage.com"
        update_env "S3_REGION" "auto"
        update_env "S3_BUCKET" "$s3_bucket"
        update_env "S3_ACCESS_KEY" "$s3_access_key"
        update_env "S3_SECRET_KEY" "$s3_secret_key"
        
        print_success "Cloudflare R2 configured"
        ;;
    *)
        print_warning "Skipped S3 configuration"
        ;;
esac

echo ""

# Email Configuration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Email Service Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "Choose your email provider:"
echo "  1) Gmail SMTP"
echo "  2) SendGrid"
echo "  3) Amazon SES"
echo "  4) Skip"
echo ""

read -p "Select option (1-4): " email_option

case $email_option in
    1)
        echo ""
        print_info "Gmail SMTP Configuration"
        print_info "Note: Use App Password, not your regular password"
        print_info "Get App Password: https://myaccount.google.com/apppasswords"
        echo ""
        read -p "Gmail Address: " smtp_user
        read -p "Gmail App Password: " smtp_password
        
        update_env "SMTP_HOST" "smtp.gmail.com"
        update_env "SMTP_PORT" "587"
        update_env "SMTP_USER" "$smtp_user"
        update_env "SMTP_PASSWORD" "$smtp_password"
        update_env "SMTP_FROM" "Sakshi Platform <$smtp_user>"
        
        print_success "Gmail SMTP configured"
        ;;
    2)
        echo ""
        print_info "SendGrid Configuration"
        print_info "Get API Key: https://app.sendgrid.com/settings/api_keys"
        echo ""
        read -p "SendGrid API Key: " sendgrid_key
        read -p "From Email: " from_email
        
        update_env "SMTP_HOST" "smtp.sendgrid.net"
        update_env "SMTP_PORT" "587"
        update_env "SMTP_USER" "apikey"
        update_env "SMTP_PASSWORD" "$sendgrid_key"
        update_env "SMTP_FROM" "Sakshi Platform <$from_email>"
        
        print_success "SendGrid configured"
        ;;
    3)
        echo ""
        print_info "Amazon SES Configuration"
        read -p "SES Region (us-east-1): " ses_region
        ses_region=${ses_region:-us-east-1}
        read -p "SES SMTP Username: " smtp_user
        read -p "SES SMTP Password: " smtp_password
        read -p "From Email (verified): " from_email
        
        update_env "SMTP_HOST" "email-smtp.${ses_region}.amazonaws.com"
        update_env "SMTP_PORT" "587"
        update_env "SMTP_USER" "$smtp_user"
        update_env "SMTP_PASSWORD" "$smtp_password"
        update_env "SMTP_FROM" "Sakshi Platform <$from_email>"
        
        print_success "Amazon SES configured"
        ;;
    *)
        print_warning "Skipped email configuration"
        ;;
esac

echo ""

# Analytics Configuration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Analytics Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Google Analytics
print_info "Google Analytics GA4"
read -p "Google Analytics Measurement ID (G-XXXXXXXXXX) [Skip]: " ga_id
if [ ! -z "$ga_id" ]; then
    update_env "GOOGLE_ANALYTICS_ID" "$ga_id"
    print_success "Google Analytics configured"
else
    print_warning "Skipped Google Analytics"
fi

echo ""

# PostHog
print_info "PostHog Analytics"
read -p "PostHog API Key (phc_xxxxx) [Skip]: " posthog_key
if [ ! -z "$posthog_key" ]; then
    update_env "POSTHOG_API_KEY" "$posthog_key"
    read -p "PostHog Host (https://app.posthog.com): " posthog_host
    posthog_host=${posthog_host:-https://app.posthog.com}
    update_env "POSTHOG_HOST" "$posthog_host"
    print_success "PostHog configured"
else
    print_warning "Skipped PostHog"
fi

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Configuration Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

print_info "Configuration saved to .env file"
echo ""
print_info "Configured services:"

if grep -q "^OAUTH_CLIENT_ID=" .env; then
    print_success "✓ OAuth (Manus)"
fi

if grep -q "^S3_BUCKET=" .env; then
    print_success "✓ S3 Storage"
fi

if grep -q "^SMTP_HOST=" .env; then
    print_success "✓ Email Service"
fi

if grep -q "^GOOGLE_ANALYTICS_ID=" .env; then
    print_success "✓ Google Analytics"
fi

if grep -q "^POSTHOG_API_KEY=" .env; then
    print_success "✓ PostHog Analytics"
fi

echo ""
print_info "Next steps:"
echo "  1. Review .env file for accuracy"
echo "  2. Test each service connection"
echo "  3. Update production environment variables"
echo ""
print_info "To test services, run:"
echo "  pnpm test:services  # If configured"
echo ""

print_success "Configuration complete! 🎉"
