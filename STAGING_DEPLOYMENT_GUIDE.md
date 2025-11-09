# Sakshi Platform - Staging Deployment Guide

**Date**: November 9, 2025  
**Environment**: Staging  
**Purpose**: Pre-production testing and validation

---

## Overview

This guide provides step-by-step instructions for deploying the Sakshi platform to a staging environment for testing and validation before production launch.

---

## Prerequisites

### Required Accounts and Services

**Infrastructure**
- Cloud hosting account (AWS, Google Cloud, or Railway)
- Domain name for staging (e.g., staging.sakshi.org)
- SSL certificate provider

**External Services**
- MySQL database (8.0+) or TiDB Cloud account
- Razorpay test account for payment testing
- SendGrid account for email notifications
- AWS S3 or Cloudinary for image storage
- Google Analytics property for staging

**Development Tools**
- Git installed locally
- Node.js 22.x installed
- pnpm package manager
- Database client (MySQL Workbench or similar)

---

## Environment Configuration

### 1. Environment Variables

Create `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL="mysql://user:password@host:port/sakshi_staging"

# Server Configuration
NODE_ENV="staging"
PORT=3000
CLIENT_URL="https://staging.sakshi.org"
SERVER_URL="https://api-staging.sakshi.org"

# Authentication
JWT_SECRET="your-staging-jwt-secret-min-32-chars"
JWT_EXPIRES_IN="7d"
SESSION_SECRET="your-staging-session-secret"

# Payment Integration (Razorpay Test Mode)
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_test_secret_key"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Email Service (SendGrid)
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="noreply@staging.sakshi.org"
SENDGRID_FROM_NAME="Sakshi Staging"

# Image Storage (AWS S3)
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="sakshi-staging-images"

# Or Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Feature Flags
ENABLE_CAFE=true
ENABLE_REPAIR_CAFE=true
ENABLE_SWAP_EVENTS=true
ENABLE_UPCYCLE_STUDIO=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="debug"
```

### 2. Database Setup

**Option A: TiDB Cloud (Recommended)**

1. Create TiDB Cloud account at https://tidbcloud.com
2. Create new cluster (Developer Tier is free)
3. Note connection details
4. Update DATABASE_URL in .env

**Option B: Railway MySQL**

1. Create Railway account at https://railway.app
2. Create new project
3. Add MySQL service
4. Copy connection string
5. Update DATABASE_URL in .env

**Option C: AWS RDS MySQL**

1. Create RDS MySQL instance
2. Configure security groups
3. Note endpoint and credentials
4. Update DATABASE_URL in .env

### 3. External Services Configuration

**Razorpay Test Account**

1. Sign up at https://razorpay.com
2. Switch to Test Mode
3. Get API keys from Dashboard → Settings → API Keys
4. Generate webhook secret
5. Configure webhook URL: `https://api-staging.sakshi.org/webhooks/razorpay`

**SendGrid Setup**

1. Create SendGrid account at https://sendgrid.com
2. Verify sender email address
3. Create API key with full access
4. Configure domain authentication (optional for staging)
5. Create email templates (or use dynamic templates)

**AWS S3 Setup**

1. Create S3 bucket: `sakshi-staging-images`
2. Configure CORS policy:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://staging.sakshi.org"],
    "ExposeHeaders": ["ETag"]
  }
]
```
3. Create IAM user with S3 access
4. Note access key and secret
5. Configure CloudFront CDN (optional)

---

## Deployment Steps

### Step 1: Clone Repository

```bash
# Clone from GitHub
git clone https://github.com/projectai397/sakshi-platform.git
cd sakshi-platform

# Checkout staging branch (or create it)
git checkout -b staging
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
pnpm install

# Verify installation
pnpm list
```

### Step 3: Database Migration

```bash
# Generate migration files (if not already done)
pnpm drizzle-kit generate

# Push schema to database
pnpm drizzle-kit push

# Verify tables created
pnpm drizzle-kit studio
# Opens Drizzle Studio at http://localhost:4983
```

### Step 4: Seed Sample Data

```bash
# Run cafe seed script
npx ts-node server/db/seed-cafe.ts

# Verify data inserted
# Check via Drizzle Studio or database client
```

### Step 5: Build Application

```bash
# Build frontend
pnpm build:client

# Build backend
pnpm build:server

# Verify build output in /dist directory
ls -la dist/
```

### Step 6: Test Locally

```bash
# Start production build locally
NODE_ENV=staging pnpm start

# Test in browser
# Frontend: http://localhost:3000
# API: http://localhost:3000/api/trpc

# Run basic tests
pnpm test
```

### Step 7: Deploy to Hosting Platform

**Option A: Railway Deployment**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables
railway variables set DATABASE_URL="mysql://..."
railway variables set RAZORPAY_KEY_ID="rzp_test_..."
# ... add all other variables

# Deploy
railway up

# Get deployment URL
railway domain
```

**Option B: Vercel Deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables via Vercel dashboard
```

**Option C: AWS EC2 Deployment**

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js and pnpm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# Clone repository
git clone https://github.com/projectai397/sakshi-platform.git
cd sakshi-platform

# Install dependencies
pnpm install

# Create .env file with all variables
nano .env

# Build application
pnpm build

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start dist/index.js --name sakshi-staging

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 8: Configure Domain and SSL

**Using Cloudflare (Recommended)**

1. Add domain to Cloudflare
2. Update DNS records:
   - A record: staging.sakshi.org → server IP
   - CNAME: api-staging.sakshi.org → server domain
3. Enable SSL/TLS (Full mode)
4. Configure page rules for caching

**Using Let's Encrypt**

```bash
# Install Certbot
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d staging.sakshi.org

# Configure Nginx
sudo nano /etc/nginx/sites-available/sakshi-staging

# Add SSL configuration
server {
    listen 443 ssl;
    server_name staging.sakshi.org;
    
    ssl_certificate /etc/letsencrypt/live/staging.sakshi.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/staging.sakshi.org/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/sakshi-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Configure Monitoring

**Set Up Logging**

```bash
# Install Winston for logging (already in dependencies)
# Configure log rotation with PM2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Set Up Error Tracking (Sentry)**

```bash
# Install Sentry
pnpm add @sentry/node @sentry/tracing

# Add to server/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: "staging",
  tracesSampleRate: 1.0,
});
```

**Set Up Uptime Monitoring**

1. Create UptimeRobot account
2. Add monitor for https://staging.sakshi.org
3. Configure alerts

### Step 10: Verify Deployment

**Functional Testing Checklist**

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Browse cafe menu
- [ ] Add items to cart
- [ ] Complete test order (Razorpay test mode)
- [ ] Receive order confirmation email
- [ ] Register for cooking class
- [ ] Submit recipe
- [ ] View admin dashboard
- [ ] All images load from S3/Cloudinary
- [ ] Mobile responsive design works
- [ ] API endpoints respond correctly

**Performance Testing**

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test homepage
ab -n 100 -c 10 https://staging.sakshi.org/

# Test API endpoint
ab -n 100 -c 10 https://api-staging.sakshi.org/api/trpc/cafe.menu.getAll
```

**Security Testing**

- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers configured

---

## Post-Deployment Configuration

### 1. Create Admin User

```bash
# SSH into server or use database client
mysql -u user -p sakshi_staging

# Create admin user
INSERT INTO users (email, password, role, created_at, updated_at)
VALUES ('admin@sakshi.org', 'hashed_password', 'admin', NOW(), NOW());

# Or use admin creation script
npx ts-node scripts/create-admin.ts
```

### 2. Configure Email Templates

1. Login to SendGrid dashboard
2. Go to Email API → Dynamic Templates
3. Create templates for:
   - Order confirmation
   - Class registration
   - Recipe approval
   - Password reset
   - Welcome email
4. Note template IDs and update in code

### 3. Set Up Analytics

1. Create Google Analytics 4 property
2. Add tracking code to client/src/index.html
3. Configure events and conversions
4. Set up custom reports

### 4. Configure Payment Webhooks

1. Login to Razorpay dashboard
2. Go to Settings → Webhooks
3. Add webhook URL: `https://api-staging.sakshi.org/webhooks/razorpay`
4. Select events:
   - payment.captured
   - payment.failed
   - order.paid
   - refund.created
5. Note webhook secret

---

## Testing Procedures

### User Acceptance Testing (UAT)

**Test Scenarios**

1. **New User Journey**
   - Register account
   - Verify email
   - Complete profile
   - Browse cafe menu
   - Place first order
   - Receive confirmation

2. **Returning User Journey**
   - Login
   - View order history
   - Reorder previous meal
   - Register for class
   - Submit recipe

3. **Admin Journey**
   - Login to admin panel
   - View dashboard
   - Manage menu items
   - Process orders
   - Approve recipes

### Load Testing

```bash
# Install k6
sudo apt-get install k6

# Create load test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  let res = http.get('https://staging.sakshi.org');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
EOF

# Run load test
k6 run load-test.js
```

### Security Testing

```bash
# Install OWASP ZAP
# Run automated security scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://staging.sakshi.org

# Check SSL configuration
ssllabs-scan --quiet staging.sakshi.org
```

---

## Rollback Procedure

If issues are discovered:

```bash
# Using PM2
pm2 stop sakshi-staging
pm2 delete sakshi-staging

# Restore previous version
git checkout previous-commit-hash
pnpm install
pnpm build
pm2 start dist/index.js --name sakshi-staging

# Or using Railway
railway rollback

# Or using Vercel
vercel rollback
```

---

## Monitoring and Maintenance

### Daily Checks

- [ ] Check error logs
- [ ] Review performance metrics
- [ ] Monitor uptime
- [ ] Check email delivery rate
- [ ] Review payment transactions

### Weekly Tasks

- [ ] Review user feedback
- [ ] Analyze usage patterns
- [ ] Update content
- [ ] Security updates
- [ ] Database backup verification

### Monthly Tasks

- [ ] Performance optimization
- [ ] Security audit
- [ ] Dependency updates
- [ ] Cost analysis
- [ ] Capacity planning

---

## Troubleshooting

### Common Issues

**Database Connection Errors**

```bash
# Check database connectivity
mysql -h host -u user -p

# Verify DATABASE_URL format
echo $DATABASE_URL

# Check firewall rules
telnet db-host 3306
```

**Email Not Sending**

```bash
# Verify SendGrid API key
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer $SENDGRID_API_KEY" \
  -H "Content-Type: application/json"

# Check email logs
pm2 logs sakshi-staging | grep email
```

**Payment Failures**

```bash
# Verify Razorpay credentials
# Check webhook logs
pm2 logs sakshi-staging | grep razorpay

# Test webhook manually
curl -X POST https://api-staging.sakshi.org/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -d '{"event":"payment.captured"}'
```

**Image Upload Issues**

```bash
# Verify S3 credentials
aws s3 ls s3://sakshi-staging-images --profile staging

# Check CORS configuration
aws s3api get-bucket-cors --bucket sakshi-staging-images

# Test upload
curl -X PUT https://sakshi-staging-images.s3.amazonaws.com/test.jpg \
  -H "Authorization: AWS4-HMAC-SHA256 ..."
```

---

## Success Criteria

Staging deployment is successful when:

- ✅ All pages load without errors
- ✅ User registration and login work
- ✅ Orders can be placed and processed
- ✅ Payments work in test mode
- ✅ Emails are delivered
- ✅ Images upload and display
- ✅ Admin panel accessible
- ✅ Mobile responsive
- ✅ HTTPS enforced
- ✅ Performance acceptable (< 3s page load)
- ✅ No critical security issues
- ✅ Monitoring configured
- ✅ Backups automated

---

## Next Steps

After successful staging deployment:

1. **Beta Testing** - Invite 50-100 users
2. **Feedback Collection** - Gather and analyze feedback
3. **Bug Fixes** - Address issues discovered
4. **Performance Tuning** - Optimize based on real usage
5. **Production Deployment** - Deploy to production environment

---

**Staging environment is your safety net. Test thoroughly before production!** 🛡️

*Last updated: November 9, 2025*
