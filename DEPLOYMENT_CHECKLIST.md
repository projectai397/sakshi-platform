# Sakshi Platform - Deployment Checklist

## 🚀 Pre-Deployment Checklist

### ✅ Code & Build
- [ ] All code committed to Git
- [ ] Build successful locally (`pnpm build`)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All tests passing

### ✅ Environment Configuration
- [ ] `.env.example` file created
- [ ] All required environment variables documented
- [ ] Production environment variables prepared
- [ ] Database connection string ready
- [ ] OAuth credentials obtained
- [ ] S3 credentials configured
- [ ] Email SMTP credentials ready
- [ ] API keys secured

### ✅ Database
- [ ] Database schema finalized
- [ ] Migrations tested
- [ ] Seed data prepared (optional)
- [ ] Backup strategy planned
- [ ] Database indexes optimized

### ✅ Security
- [ ] All secrets in environment variables
- [ ] No hardcoded credentials
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] SQL injection prevention
- [ ] XSS protection enabled

### ✅ Performance
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Lazy loading implemented
- [ ] Caching strategy defined
- [ ] CDN configured (if needed)

---

## 🎯 Railway Deployment Steps

### Step 1: Install Railway CLI

**macOS:**
```bash
brew install railway
```

**Linux/WSL:**
```bash
npm install -g @railway/cli
```

**Verify installation:**
```bash
railway --version
```

### Step 2: Login to Railway

```bash
railway login
```

This will open a browser window for authentication.

### Step 3: Initialize Project

**Option A: Use Automation Script**
```bash
cd /path/to/sakshi
./scripts/deploy-railway.sh
```

**Option B: Manual Steps**
```bash
# Initialize Railway project
railway init

# Link to existing project (if already created)
railway link

# Add MySQL database
railway add --plugin mysql
```

### Step 4: Set Environment Variables

**Option A: From .env file**
```bash
# The deploy script does this automatically
# Or manually:
railway variables --set KEY=VALUE
```

**Option B: Via Railway Dashboard**
1. Go to https://railway.app/dashboard
2. Select your project
3. Go to Variables tab
4. Add each variable

**Required Variables:**
```bash
# Database (automatically set by Railway MySQL plugin)
DATABASE_URL=mysql://...

# Application
NODE_ENV=production
PORT=3000

# Session
SESSION_SECRET=your-secret-key-here

# OAuth (Manus)
OAUTH_CLIENT_ID=oauth_xxxxx
OAUTH_CLIENT_SECRET=secret_xxxxx
OAUTH_REDIRECT_URI=https://your-domain.railway.app/auth/callback
OAUTH_ISSUER=https://auth.manus.im

# S3 Storage (Optional)
S3_ENDPOINT=https://...
S3_REGION=us-east-1
S3_BUCKET=sakshi-uploads
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=Sakshi Platform <noreply@sakshi.org>

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
POSTHOG_API_KEY=phc_xxxxx

# Payment (Optional)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxx

# AI (Optional)
OPENAI_API_KEY=sk-xxxxx
```

### Step 5: Deploy

```bash
# Deploy to Railway
railway up

# Or with the script
./scripts/deploy-railway.sh
```

### Step 6: Run Database Migrations

```bash
# Push database schema
railway run pnpm db:push

# Seed database (optional)
railway run pnpm db:seed
```

### Step 7: Verify Deployment

```bash
# View logs
railway logs

# Open in browser
railway open

# Check status
railway status
```

---

## ✅ Post-Deployment Checklist

### Immediate Verification
- [ ] Site loads successfully
- [ ] All pages accessible
- [ ] Adiyogi backgrounds displaying
- [ ] Animations working
- [ ] Dark mode functional
- [ ] No console errors

### Authentication
- [ ] OAuth login works
- [ ] User registration works
- [ ] Session persistence works
- [ ] Logout works

### Database
- [ ] Database connection successful
- [ ] Data persisting correctly
- [ ] Queries performing well
- [ ] No connection errors

### Features
- [ ] Product catalog loads
- [ ] Search functionality works
- [ ] Shopping cart works
- [ ] Checkout process functional
- [ ] Seva wallet operational
- [ ] Admin dashboard accessible

### Performance
- [ ] Page load time < 3 seconds
- [ ] Images loading properly
- [ ] No memory leaks
- [ ] API responses fast

### Security
- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] No exposed secrets
- [ ] CORS working correctly

---

## 🔧 Configuration Tasks

### Custom Domain (Optional)

1. **In Railway Dashboard:**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter your domain

2. **In Domain Registrar:**
   - Add CNAME record pointing to Railway
   - Wait for DNS propagation (5-30 minutes)

3. **Update OAuth Redirect:**
   - Update `OAUTH_REDIRECT_URI` to use custom domain
   - Update in Manus OAuth console

### SSL Certificate
- Railway automatically provisions SSL certificates
- No manual configuration needed
- Verify HTTPS is working

### Monitoring Setup

1. **Railway Dashboard:**
   - Enable deployment notifications
   - Set up usage alerts
   - Configure error tracking

2. **External Monitoring:**
   - Set up UptimeRobot or similar
   - Configure Sentry for error tracking
   - Set up performance monitoring

---

## 📊 Deployment Verification Script

Create a file `scripts/verify-deployment.sh`:

```bash
#!/bin/bash

DEPLOYMENT_URL="$1"

if [ -z "$DEPLOYMENT_URL" ]; then
    echo "Usage: ./verify-deployment.sh <deployment-url>"
    exit 1
fi

echo "Verifying deployment at: $DEPLOYMENT_URL"
echo ""

# Check if site is up
echo "1. Checking if site is accessible..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL")

if [ "$STATUS" -eq 200 ]; then
    echo "✓ Site is accessible (HTTP $STATUS)"
else
    echo "✗ Site returned HTTP $STATUS"
fi

# Check API health
echo ""
echo "2. Checking API health..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/api/health")

if [ "$API_STATUS" -eq 200 ]; then
    echo "✓ API is healthy (HTTP $API_STATUS)"
else
    echo "✗ API returned HTTP $API_STATUS"
fi

# Check database connection
echo ""
echo "3. Checking database connection..."
DB_STATUS=$(curl -s "$DEPLOYMENT_URL/api/health/db" | jq -r '.status' 2>/dev/null || echo "error")

if [ "$DB_STATUS" = "ok" ]; then
    echo "✓ Database connection successful"
else
    echo "✗ Database connection failed"
fi

# Check SSL certificate
echo ""
echo "4. Checking SSL certificate..."
SSL_INFO=$(echo | openssl s_client -servername "${DEPLOYMENT_URL#https://}" -connect "${DEPLOYMENT_URL#https://}:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✓ SSL certificate is valid"
    echo "$SSL_INFO"
else
    echo "✗ SSL certificate check failed"
fi

echo ""
echo "Verification complete!"
```

---

## 🚨 Troubleshooting

### Deployment Fails

**Check logs:**
```bash
railway logs
```

**Common issues:**
- Build errors → Check `pnpm build` locally
- Missing dependencies → Check `package.json`
- Environment variables → Verify all are set

### Database Connection Fails

**Check DATABASE_URL:**
```bash
railway variables
```

**Verify MySQL plugin:**
```bash
railway plugins
```

**Test connection:**
```bash
railway run pnpm db:push
```

### Site Not Loading

**Check deployment status:**
```bash
railway status
```

**Check domain configuration:**
- Verify DNS records
- Check CNAME pointing to Railway
- Wait for DNS propagation

**Check logs for errors:**
```bash
railway logs --follow
```

### OAuth Not Working

**Verify redirect URI:**
- Must match exactly in Manus OAuth console
- Include protocol (https://)
- No trailing slash

**Check environment variables:**
```bash
railway variables | grep OAUTH
```

### Performance Issues

**Check resource usage:**
- View metrics in Railway dashboard
- Monitor memory usage
- Check database query performance

**Optimize if needed:**
- Enable caching
- Optimize database queries
- Use CDN for static assets

---

## 📈 Monitoring & Maintenance

### Daily Checks
- [ ] Site is accessible
- [ ] No error spikes in logs
- [ ] Response times acceptable
- [ ] No security alerts

### Weekly Checks
- [ ] Review error logs
- [ ] Check database performance
- [ ] Monitor resource usage
- [ ] Review user feedback

### Monthly Checks
- [ ] Update dependencies
- [ ] Review security patches
- [ ] Optimize database
- [ ] Review analytics
- [ ] Backup database

---

## 💰 Cost Monitoring

### Railway Pricing
- **Starter**: $5/month
- **Developer**: $10/month
- **Team**: $20/month

### Monitor Usage
- Check Railway dashboard regularly
- Set up usage alerts
- Optimize resource usage
- Review monthly bills

---

## 🎉 Deployment Complete!

Once all checklist items are complete:

1. ✅ Deployment successful
2. ✅ All features verified
3. ✅ Monitoring configured
4. ✅ Documentation updated
5. ✅ Team notified

**Your Sakshi Platform is now live!** 🚀

---

## 📞 Support

**Railway Support:**
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Sakshi Platform:**
- Documentation: See COMPLETE_GUIDE_INDEX.md
- Issues: Check troubleshooting section
- Updates: Follow deployment guide

---

*Last Updated: November 5, 2025*
