# Sakshi Platform - External Services Configuration Guide

## Overview

This guide walks you through configuring external services for the Sakshi platform: OAuth authentication, S3 storage, and email notifications.

**Services Covered:**
- 🔐 OAuth (Manus Authentication)
- 📦 S3 Storage (File Uploads)
- 📧 Email Notifications (SMTP)
- 📊 Analytics (Optional)

**Estimated Time**: 30-45 minutes

---

## Table of Contents

1. [OAuth Authentication (Manus)](#oauth-authentication-manus)
2. [S3 Storage Configuration](#s3-storage-configuration)
3. [Email Service Setup](#email-service-setup)
4. [Analytics Integration](#analytics-integration)
5. [Testing Configuration](#testing-configuration)

---

## OAuth Authentication (Manus)

### What is Manus OAuth?

Manus provides secure authentication for your application. Users can log in with their Manus accounts.

### Step 1: Create OAuth Application

1. Visit [Manus OAuth Console](https://auth.manus.im/console)
2. Sign in with your Manus account
3. Click **"Create New Application"**
4. Fill in application details:
   - **Name**: Sakshi Platform
   - **Description**: Circular economy platform with spiritual values
   - **Homepage URL**: `https://your-domain.com`
   - **Callback URLs**: 
     ```
     http://localhost:3000/auth/callback
     https://your-domain.com/auth/callback
     ```
5. Click **"Create Application"**

### Step 2: Get Credentials

After creating the application, you'll receive:
- **Client ID**: `oauth_xxxxxxxxxxxxx`
- **Client Secret**: `secret_xxxxxxxxxxxxx`

**⚠️ Important**: Keep the Client Secret secure! Never commit it to git.

### Step 3: Configure Environment Variables

Add to your `.env` file:

```bash
# OAuth (Manus)
OAUTH_CLIENT_ID=oauth_xxxxxxxxxxxxx
OAUTH_CLIENT_SECRET=secret_xxxxxxxxxxxxx
OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
OAUTH_ISSUER=https://auth.manus.im
```

For production (Railway, Vercel, etc.):

```bash
OAUTH_REDIRECT_URI=https://your-domain.com/auth/callback
```

### Step 4: Test OAuth Flow

1. Start your development server: `pnpm dev`
2. Navigate to: `http://localhost:3000`
3. Click **"Login"** or **"Sign Up"**
4. You should be redirected to Manus OAuth
5. Authorize the application
6. You should be redirected back to your app, logged in

### Troubleshooting OAuth

**Error**: `redirect_uri_mismatch`

**Solution**: Ensure the redirect URI in your `.env` exactly matches what's configured in Manus OAuth Console.

**Error**: `invalid_client`

**Solution**: Check that your Client ID and Secret are correct.

---

## S3 Storage Configuration

### What is S3 Storage?

S3 (Simple Storage Service) is used for storing user-uploaded files like product images, avatars, and documents.

### Options

1. **AWS S3** (Most popular, pay-as-you-go)
2. **DigitalOcean Spaces** (Simple, $5/month)
3. **Cloudflare R2** (Free tier, no egress fees)
4. **Backblaze B2** (Cheapest, $0.005/GB)
5. **MinIO** (Self-hosted, free)

### Option A: AWS S3

#### Step 1: Create S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com)
2. Click **"Create bucket"**
3. Configure:
   - **Bucket name**: `sakshi-uploads` (must be globally unique)
   - **Region**: Choose closest to your users
   - **Block all public access**: Uncheck (we'll set specific permissions)
4. Click **"Create bucket"**

#### Step 2: Configure CORS

1. Go to your bucket
2. Click **"Permissions"** tab
3. Scroll to **"Cross-origin resource sharing (CORS)"**
4. Click **"Edit"**
5. Add:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-domain.com"
    ],
    "ExposeHeaders": ["ETag"]
  }
]
```

#### Step 3: Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam)
2. Click **"Users"** → **"Add users"**
3. User name: `sakshi-s3-user`
4. Access type: **Programmatic access**
5. Click **"Next: Permissions"**
6. Click **"Attach existing policies directly"**
7. Search and select: **AmazonS3FullAccess** (or create custom policy)
8. Click **"Next"** → **"Create user"**
9. **Save** the Access Key ID and Secret Access Key

#### Step 4: Configure Environment Variables

```bash
# S3 Storage (AWS)
S3_ENDPOINT=https://s3.amazonaws.com
S3_REGION=us-east-1
S3_BUCKET=sakshi-uploads
S3_ACCESS_KEY=AKIAXXXXXXXXXXXXXXXX
S3_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Option B: DigitalOcean Spaces

#### Step 1: Create Space

1. Go to [DigitalOcean Spaces](https://cloud.digitalocean.com/spaces)
2. Click **"Create a Space"**
3. Configure:
   - **Region**: Choose closest
   - **Name**: `sakshi-uploads`
   - **CDN**: Enable (recommended)
4. Click **"Create Space"**

#### Step 2: Generate API Keys

1. Go to **API** → **Spaces Keys**
2. Click **"Generate New Key"**
3. Name: `Sakshi Platform`
4. Save the **Key** and **Secret**

#### Step 3: Configure Environment Variables

```bash
# S3 Storage (DigitalOcean Spaces)
S3_ENDPOINT=https://nyc3.digitaloceanspaces.com
S3_REGION=us-east-1
S3_BUCKET=sakshi-uploads
S3_ACCESS_KEY=your_spaces_key
S3_SECRET_KEY=your_spaces_secret
```

### Option C: Cloudflare R2

#### Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** → **Create bucket**
3. Name: `sakshi-uploads`
4. Click **"Create bucket"**

#### Step 2: Generate API Token

1. Go to **R2** → **Manage R2 API Tokens**
2. Click **"Create API token"**
3. Permissions: **Object Read & Write**
4. Save the **Access Key ID** and **Secret Access Key**

#### Step 3: Configure Environment Variables

```bash
# S3 Storage (Cloudflare R2)
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=sakshi-uploads
S3_ACCESS_KEY=your_r2_access_key
S3_SECRET_KEY=your_r2_secret_key
```

### Testing S3 Upload

```bash
# Test upload using AWS CLI
aws s3 cp test-image.jpg s3://sakshi-uploads/test/ \
  --endpoint-url=$S3_ENDPOINT \
  --region=$S3_REGION

# Or test in your app
# Upload a product image through the admin dashboard
```

---

## Email Service Setup

### What is Email Service?

Used for sending transactional emails: order confirmations, password resets, seva token notifications, etc.

### Options

1. **Gmail SMTP** (Free, 500 emails/day)
2. **SendGrid** (Free tier: 100 emails/day)
3. **Mailgun** (Free tier: 5,000 emails/month)
4. **Amazon SES** (Pay-as-you-go, $0.10/1000 emails)
5. **Postmark** (Free trial, then $10/month)

### Option A: Gmail SMTP

#### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

#### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: **Mail**
3. Select device: **Other** (enter "Sakshi Platform")
4. Click **"Generate"**
5. Save the 16-character password

#### Step 3: Configure Environment Variables

```bash
# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # App password
SMTP_FROM=Sakshi Platform <your-email@gmail.com>
```

### Option B: SendGrid

#### Step 1: Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com)
2. Sign up for free account
3. Verify your email

#### Step 2: Create API Key

1. Go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name: `Sakshi Platform`
4. Permissions: **Full Access** (or **Mail Send** only)
5. Click **"Create & View"**
6. Save the API key

#### Step 3: Verify Sender Identity

1. Go to **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in your details
4. Verify email address

#### Step 4: Configure Environment Variables

```bash
# Email (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=Sakshi Platform <noreply@your-domain.com>
```

### Option C: Amazon SES

#### Step 1: Verify Email Address

1. Go to [SES Console](https://console.aws.amazon.com/ses)
2. Click **"Verify a New Email Address"**
3. Enter your email
4. Check inbox and click verification link

#### Step 2: Create SMTP Credentials

1. Go to **SMTP Settings**
2. Click **"Create My SMTP Credentials"**
3. Save the username and password

#### Step 3: Request Production Access

By default, SES is in sandbox mode (can only send to verified addresses).

1. Go to **Account Dashboard**
2. Click **"Request Production Access"**
3. Fill out the form
4. Wait for approval (usually 24 hours)

#### Step 4: Configure Environment Variables

```bash
# Email (Amazon SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIAXXXXXXXXXXXXXXXX
SMTP_PASSWORD=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=Sakshi Platform <noreply@your-domain.com>
```

### Testing Email

```bash
# Test email sending
# In your app, trigger an order confirmation email
# Or use a test script:

node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email from Sakshi Platform'
}).then(console.log).catch(console.error);
"
```

---

## Analytics Integration

### Google Analytics

#### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Click **"Admin"** → **"Create Property"**
3. Name: `Sakshi Platform`
4. Select timezone and currency
5. Click **"Next"** → **"Create"**

#### Step 2: Get Measurement ID

1. Go to **Admin** → **Data Streams**
2. Click **"Add stream"** → **"Web"**
3. Enter your website URL
4. Click **"Create stream"**
5. Copy the **Measurement ID** (G-XXXXXXXXXX)

#### Step 3: Configure Environment Variables

```bash
# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### PostHog (Optional)

#### Step 1: Create PostHog Account

1. Go to [PostHog](https://posthog.com)
2. Sign up for free account
3. Create new project

#### Step 2: Get API Key

1. Go to **Project Settings**
2. Copy **Project API Key**

#### Step 3: Configure Environment Variables

```bash
# PostHog
POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
POSTHOG_HOST=https://app.posthog.com
```

---

## Testing Configuration

### Test OAuth

```bash
# Start server
pnpm dev

# Visit http://localhost:3000
# Click "Login"
# Should redirect to Manus OAuth
# Authorize
# Should redirect back, logged in
```

### Test S3 Upload

```bash
# In admin dashboard
# Try uploading a product image
# Should upload to S3 bucket
# Image should be accessible via URL
```

### Test Email

```bash
# Place a test order
# Check email inbox
# Should receive order confirmation
```

### Test Analytics

```bash
# Visit your site
# Navigate between pages
# Go to Google Analytics Real-Time view
# Should see your activity
```

---

## Security Best Practices

### Environment Variables

```bash
# ✅ DO: Use environment variables
OAUTH_CLIENT_SECRET=secret_xxxxx

# ❌ DON'T: Hardcode secrets
const secret = "secret_xxxxx";
```

### API Keys

- ✅ Rotate keys regularly
- ✅ Use different keys for dev/staging/production
- ✅ Limit permissions (principle of least privilege)
- ✅ Monitor usage for anomalies

### S3 Bucket Security

- ✅ Enable versioning
- ✅ Enable encryption
- ✅ Set up lifecycle policies
- ✅ Use signed URLs for sensitive files
- ✅ Implement rate limiting

### Email Security

- ✅ Use SPF, DKIM, DMARC records
- ✅ Verify sender identity
- ✅ Rate limit email sending
- ✅ Validate recipient addresses
- ✅ Use templates to prevent injection

---

## Configuration Checklist

### OAuth ✅
- [ ] Manus OAuth app created
- [ ] Client ID and Secret obtained
- [ ] Redirect URIs configured
- [ ] Environment variables set
- [ ] Login flow tested

### S3 Storage ✅
- [ ] S3 bucket created
- [ ] CORS configured
- [ ] IAM user/API keys created
- [ ] Environment variables set
- [ ] Upload tested

### Email ✅
- [ ] Email service chosen
- [ ] Account created
- [ ] Sender verified
- [ ] SMTP credentials obtained
- [ ] Environment variables set
- [ ] Test email sent

### Analytics ✅
- [ ] Google Analytics property created
- [ ] Measurement ID obtained
- [ ] Environment variable set
- [ ] Tracking tested

---

## Troubleshooting

### OAuth Issues

**Error**: `redirect_uri_mismatch`
- Ensure redirect URI matches exactly in both .env and OAuth console
- Include protocol (http:// or https://)
- No trailing slash

**Error**: `invalid_client`
- Check Client ID and Secret are correct
- Ensure no extra spaces in .env file

### S3 Issues

**Error**: `Access Denied`
- Check IAM permissions
- Verify bucket policy
- Ensure CORS is configured

**Error**: `Bucket not found`
- Verify bucket name is correct
- Check region matches

### Email Issues

**Error**: `Authentication failed`
- For Gmail: Ensure app password is used (not regular password)
- Check SMTP credentials are correct
- Verify 2FA is enabled (for Gmail)

**Error**: `Connection timeout`
- Check SMTP host and port
- Verify firewall allows outbound SMTP
- Try alternative port (465 for SSL)

---

## Next Steps

After configuring external services:

1. ✅ **Test all integrations** thoroughly
2. ✅ **Update production environment** variables
3. ✅ **Implement payment integrations** (next phase)
4. ✅ **Set up monitoring** for services
5. ✅ **Configure backups** for S3
6. ✅ **Set up alerts** for failures

---

## Cost Estimation

### Monthly Costs (Approximate)

| Service | Free Tier | Paid |
|---------|-----------|------|
| OAuth (Manus) | Free | Free |
| AWS S3 | 5GB free | $0.023/GB |
| DigitalOcean Spaces | - | $5/month (250GB) |
| Cloudflare R2 | 10GB free | $0.015/GB |
| Gmail SMTP | 500 emails/day | Free |
| SendGrid | 100 emails/day | $15/month (40k) |
| Amazon SES | - | $0.10/1000 emails |
| Google Analytics | Free | Free |
| PostHog | 1M events/month | $0.00031/event |

**Estimated Total**: $5-20/month (depending on usage)

---

## Support Resources

- **Manus OAuth**: [docs.manus.im](https://docs.manus.im)
- **AWS S3**: [aws.amazon.com/s3/getting-started](https://aws.amazon.com/s3/getting-started/)
- **SendGrid**: [docs.sendgrid.com](https://docs.sendgrid.com)
- **Google Analytics**: [support.google.com/analytics](https://support.google.com/analytics)

---

*For deployment, see `RAILWAY_DEPLOYMENT_GUIDE.md`*  
*For local testing, see `LOCAL_DEVELOPMENT_GUIDE.md`*  
*For features, see `FEATURE_DEVELOPMENT_PLAN.md`*
