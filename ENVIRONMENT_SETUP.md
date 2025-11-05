# Sakshi Platform - Environment Setup Guide

## Overview

This guide explains how to configure the Sakshi platform for different environments (development, staging, production).

---

## Environment Files

The project uses `.env` files for configuration. Two files are provided:

- **`.env.example`** - Template with all available options
- **`.env`** - Your actual configuration (git-ignored)

---

## Quick Start (Development)

For local development, a basic `.env` file has been created with SQLite database:

```bash
# Already configured in .env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
PORT=3000
HOST="0.0.0.0"
APP_URL="http://localhost:3000"
SESSION_SECRET="dev_secret_key_for_local_testing_only"
```

This allows you to run the project immediately with:

```bash
pnpm install
pnpm db:push
pnpm dev
```

---

## Production Configuration

For production deployment, copy `.env.example` to `.env` and configure:

### 1. Database Configuration

**MySQL/TiDB** (Recommended for production):

```env
DATABASE_URL="mysql://username:password@host:3306/database"
```

**Examples**:
- Local MySQL: `mysql://sakshi:password@localhost:3306/sakshi_db`
- TiDB Cloud: `mysql://user.root:pass@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/sakshi`
- PlanetScale: `mysql://user:pass@aws.connect.psdb.cloud/sakshi?sslaccept=strict`

### 2. Authentication (Manus OAuth)

```env
OAUTH_CLIENT_ID="your_client_id_from_manus"
OAUTH_CLIENT_SECRET="your_client_secret_from_manus"
OAUTH_REDIRECT_URI="https://your-domain.com/auth/callback"
OAUTH_ISSUER="https://auth.manus.im"
```

**To get OAuth credentials**:
1. Visit [Manus OAuth Console](https://auth.manus.im/console)
2. Create a new application
3. Set redirect URI to your domain + `/auth/callback`
4. Copy Client ID and Secret

### 3. S3 Storage Configuration

**AWS S3**:
```env
S3_ENDPOINT="https://s3.amazonaws.com"
S3_REGION="us-east-1"
S3_BUCKET="sakshi-uploads"
S3_ACCESS_KEY="AKIAIOSFODNN7EXAMPLE"
S3_SECRET_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
S3_PUBLIC_URL="https://sakshi-uploads.s3.amazonaws.com"
```

**Cloudflare R2**:
```env
S3_ENDPOINT="https://[account-id].r2.cloudflarestorage.com"
S3_REGION="auto"
S3_BUCKET="sakshi-uploads"
S3_ACCESS_KEY="your_r2_access_key"
S3_SECRET_KEY="your_r2_secret_key"
S3_PUBLIC_URL="https://cdn.sakshi.org"
```

**DigitalOcean Spaces**:
```env
S3_ENDPOINT="https://nyc3.digitaloceanspaces.com"
S3_REGION="nyc3"
S3_BUCKET="sakshi-uploads"
S3_ACCESS_KEY="your_spaces_key"
S3_SECRET_KEY="your_spaces_secret"
S3_PUBLIC_URL="https://sakshi-uploads.nyc3.cdn.digitaloceanspaces.com"
```

### 4. Application Settings

```env
NODE_ENV="production"
PORT=3000
HOST="0.0.0.0"
APP_URL="https://sakshi.org"

# Generate a secure random string (minimum 32 characters)
SESSION_SECRET="use_openssl_rand_hex_32_to_generate_this"
```

**Generate secure session secret**:
```bash
openssl rand -hex 32
```

---

## Optional Integrations

### Email Notifications

**Gmail**:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"
SMTP_FROM="Sakshi Platform <noreply@sakshi.org>"
```

**SendGrid**:
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="your_sendgrid_api_key"
SMTP_FROM="Sakshi Platform <noreply@sakshi.org>"
```

### Payment Gateways

**Razorpay** (Indian payments):
```env
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

**Stripe** (International):
```env
STRIPE_PUBLIC_KEY="pk_test_xxxxx"
STRIPE_SECRET_KEY="sk_test_xxxxx"
```

### Analytics

**Google Analytics**:
```env
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

**PostHog**:
```env
POSTHOG_API_KEY="phc_xxxxx"
```

### AI Features

**OpenAI** (for chatbot):
```env
OPENAI_API_KEY="sk-xxxxx"
```

---

## Environment-Specific Configurations

### Development

```env
NODE_ENV="development"
DEBUG="true"
HOT_RELOAD="true"
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
DATABASE_URL="file:./dev.db"
```

### Staging

```env
NODE_ENV="staging"
DEBUG="true"
APP_URL="https://staging.sakshi.org"
DATABASE_URL="mysql://user:pass@staging-db:3306/sakshi"
```

### Production

```env
NODE_ENV="production"
DEBUG="false"
APP_URL="https://sakshi.org"
DATABASE_URL="mysql://user:pass@prod-db:3306/sakshi"
```

---

## Platform-Specific Setup

### Vercel

Create environment variables in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.example`
3. Set appropriate values for production
4. Deploy

**Important**: Vercel uses serverless functions, so database connections should use connection pooling.

### Railway

1. Create new project
2. Add MySQL database service
3. Copy `DATABASE_URL` from Railway
4. Add other environment variables in Railway dashboard
5. Deploy from GitHub

### DigitalOcean App Platform

1. Create new app
2. Add managed MySQL database
3. Configure environment variables in app settings
4. Deploy

### Docker

Create `.env` file and use with docker-compose:

```yaml
version: '3.8'
services:
  app:
    build: .
    env_file: .env
    ports:
      - "3000:3000"
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: sakshi_db
```

---

## Security Best Practices

### 1. Never Commit Secrets

The `.env` file is git-ignored. Never commit it to version control.

### 2. Use Strong Secrets

```bash
# Generate strong session secret
openssl rand -hex 32

# Generate strong database password
openssl rand -base64 24
```

### 3. Rotate Credentials

Regularly rotate:
- Session secrets
- Database passwords
- API keys
- OAuth secrets

### 4. Environment Separation

Use different credentials for:
- Development
- Staging
- Production

### 5. Principle of Least Privilege

Grant only necessary permissions:
- Database user: Only access to sakshi database
- S3 user: Only read/write to uploads bucket
- OAuth app: Only required scopes

---

## Validation

### Check Configuration

```bash
# Verify environment variables are loaded
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

### Test Database Connection

```bash
# Run migrations
pnpm db:push

# Check database tables
# For MySQL:
mysql -u user -p -e "SHOW TABLES;" sakshi_db

# For SQLite:
sqlite3 dev.db ".tables"
```

### Test OAuth

1. Start the server: `pnpm dev`
2. Visit: `http://localhost:3000`
3. Click login
4. Should redirect to Manus OAuth
5. After auth, should redirect back

### Test S3 Upload

```bash
# Test S3 connection (requires AWS CLI)
aws s3 ls s3://sakshi-uploads/ --endpoint-url=$S3_ENDPOINT
```

---

## Troubleshooting

### Database Connection Fails

**Error**: `Error: connect ECONNREFUSED`

**Solutions**:
1. Check database is running
2. Verify credentials in `.env`
3. Check firewall rules
4. Test connection manually

### OAuth Redirect Mismatch

**Error**: `redirect_uri_mismatch`

**Solutions**:
1. Ensure `OAUTH_REDIRECT_URI` matches OAuth app settings
2. Include protocol (http:// or https://)
3. Check for trailing slashes

### S3 Upload Fails

**Error**: `AccessDenied`

**Solutions**:
1. Verify S3 credentials
2. Check bucket permissions
3. Ensure CORS is configured
4. Verify endpoint URL

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

---

## Migration Guide

### From SQLite to MySQL

1. Export data from SQLite:
```bash
sqlite3 dev.db .dump > backup.sql
```

2. Update `.env` with MySQL connection
3. Run migrations:
```bash
pnpm db:push
```

4. Import data (may require manual conversion)

### From Development to Production

1. Copy `.env.example` to `.env`
2. Update all values for production
3. Run migrations on production database
4. Test thoroughly in staging first
5. Deploy to production

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | Database connection string |
| `NODE_ENV` | Yes | development | Environment mode |
| `PORT` | No | 3000 | Server port |
| `HOST` | No | localhost | Server host |
| `APP_URL` | Yes | - | Public application URL |
| `SESSION_SECRET` | Yes | - | JWT signing secret |
| `OAUTH_CLIENT_ID` | Yes | - | OAuth client ID |
| `OAUTH_CLIENT_SECRET` | Yes | - | OAuth client secret |
| `OAUTH_REDIRECT_URI` | Yes | - | OAuth callback URL |
| `S3_ENDPOINT` | Yes | - | S3 endpoint URL |
| `S3_BUCKET` | Yes | - | S3 bucket name |
| `S3_ACCESS_KEY` | Yes | - | S3 access key |
| `S3_SECRET_KEY` | Yes | - | S3 secret key |
| `SMTP_HOST` | No | - | Email server host |
| `SMTP_PORT` | No | 587 | Email server port |
| `SMTP_USER` | No | - | Email username |
| `SMTP_PASSWORD` | No | - | Email password |
| `RAZORPAY_KEY_ID` | No | - | Razorpay API key |
| `STRIPE_SECRET_KEY` | No | - | Stripe secret key |
| `OPENAI_API_KEY` | No | - | OpenAI API key |
| `DEBUG` | No | false | Enable debug logging |

---

## Next Steps

After configuring environment:

1. **Install dependencies**: `pnpm install`
2. **Run migrations**: `pnpm db:push`
3. **Seed database**: See `DATABASE_SEED.md`
4. **Start server**: `pnpm dev`
5. **Test features**: Visit `http://localhost:3000`

---

*For deployment instructions, see `DEPLOYMENT_GUIDE.md`*  
*For quick start, see `QUICK_START.md`*  
*For database setup, see next phase documentation*
